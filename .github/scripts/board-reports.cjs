const { PROJECT_ID, REPORT_LABEL, pages, text, nodes, unchecked, issueLink, managedIssue } = require('./automation-common.cjs');
const DAY = 86400000;
const WATCHED = [
  { file: 'project-board.yml', maxAge: 4 / 24, scheduled: true },
  { file: 'board-review.yml', maxAge: 9, scheduled: true },
  { file: 'pr-issue-check.yml', failures: true },
  { file: 'deployment-evidence.yml', failures: true },
  { file: 'automation-health.yml' },
  { file: 'ci.yml' },
];

function healthDryRun(context, requestedDryRun) {
  // A manual parent's dry_run input is not included in workflow_run payloads.
  // Treat all manual parents as previews; direct health dispatch can opt in.
  return requestedDryRun || (context.eventName === 'workflow_run' &&
    context.payload.workflow_run?.event === 'workflow_dispatch');
}

function age(value, now) {
  const time = Date.parse(value);
  if (!Number.isFinite(time)) throw new Error('Missing or invalid observation timestamp');
  return Math.max(0, (now.getTime() - time) / DAY);
}

function workflowFindings(spec, workflow, runs, now) {
  if (workflow.state !== 'active') return [`${spec.file}: workflow is ${workflow.state}.`];
  const done = runs.filter((run) => run.status === 'completed' && (!spec.scheduled || run.event === 'schedule'))
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  const findings = [];
  if ((spec.failures || spec.scheduled) && done[0] && done[0].conclusion !== 'success') {
    findings.push(`${spec.file}: latest completed ${spec.scheduled ? 'scheduled ' : ''}run ${done[0].id} ended ${done[0].conclusion}.`);
  }
  if (spec.maxAge) {
    const success = done.find((run) => run.conclusion === 'success');
    if (age(success?.created_at || workflow.created_at, now) > spec.maxAge) findings.push(`${spec.file}: no successful scheduled run within ${spec.maxAge * 24} hours.`);
  }
  return findings;
}

async function health({ github, projectGraphql, owner, repo, dryRun = true, now = new Date() }) {
  const findings = [];
  for (const spec of WATCHED) {
    try {
      const { data: workflow } = await github.rest.actions.getWorkflow({ owner, repo, workflow_id: spec.file });
      let runs = [];
      if (spec.scheduled || spec.failures) {
        // Only real scheduled runs satisfy a scheduled heartbeat. A successful
        // manual dry run must not mask failed writes or a stopped schedule.
        const { data } = await github.rest.actions.listWorkflowRuns({ owner, repo,
          workflow_id: spec.file, status: 'completed', per_page: 100,
          ...(spec.scheduled ? { event: 'schedule' } : {}) });
        runs = data.workflow_runs;
      }
      findings.push(...workflowFindings(spec, workflow, runs, now));
    } catch (error) {
      findings.push(`${spec.file}: inspection unavailable (HTTP ${Number(error.status) || 'unknown'}).`);
    }
  }
  try {
    if (!projectGraphql) throw new Error('Missing project credential');
    const { node } = await projectGraphql(`query($id:ID!) { node(id:$id) { ... on ProjectV2 {
      viewerCanUpdate field(name:"Status") { ... on ProjectV2SingleSelectField { options { name } } }
    } } }`, { id: PROJECT_ID });
    if (!node?.viewerCanUpdate) throw new Error('No project write permission');
    const names = new Set(node.field.options.map((option) => option.name));
    if (['Not Started', 'In Development', 'In Review', 'Done'].some((name) => !names.has(name))) findings.push('Project Status options no longer match the reconciliation policy.');
  } catch {
    // Never publish exception text that might contain a token or request body.
    findings.push('Project credential probe failed: check PROJECTS_TOKEN access and project permissions.');
  }
  const body = findings.length
    ? `Repository automation needs attention.\n\n${findings.map((f) => `- ${text(f)}`).join('\n')}\n\n[Workflow runs](https://github.com/${owner}/${repo}/actions) · [Recovery runbook](https://github.com/${owner}/${repo}/blob/HEAD/.github/PROJECT-BOARD.md)\n\nThis incident updates when findings change and closes on recovery. The retired readiness workflow is deliberately excluded.`
    : 'Repository automation recovered: the configured workflows are enabled, scheduled runs are within their allowed age, and the project credential probe passed. A newly created scheduled workflow has its documented startup grace period. See Actions for the dated check evidence.';
  const report = await managedIssue({ github, owner, repo, key: 'automation-health',
    title: '[automation] Repository workflow health', body, label: 'automation/health', active: !!findings.length, dryRun });
  return { findings, report };
}

function reviewCandidates({ issues, prs, fields, children, now }) {
  const rows = { reviews: [], approved: [], unassigned: [], held: [], epics: [] };
  for (const pr of prs) {
    const held = pr.labels.nodes.some((l) => l.name === 'on hold');
    if (held) {
      if (age(pr.updatedAt, now) >= 14) rows.held.push({ number: pr.number, kind: 'PR', reason: 'on hold without activity for at least 14 days' });
    } else if (!pr.isDraft && age(pr.updatedAt, now) >= (pr.reviewDecision === 'APPROVED' ? 2 : 3)) {
      if (pr.reviewDecision === 'APPROVED') rows.approved.push({ number: pr.number, kind: 'PR', reason: 'approved, still open; no activity for at least 2 days' });
      else if (pr.reviewDecision !== 'CHANGES_REQUESTED') rows.reviews.push({ number: pr.number, kind: 'PR', reason: 'awaiting review; no activity for at least 3 days' });
    }
  }
  for (const issue of issues) {
    const labels = new Set(issue.labels.map((l) => l.name));
    if (labels.has(REPORT_LABEL)) continue;
    if (labels.has('on hold')) {
      if (age(issue.updated_at, now) >= 14) rows.held.push({ number: issue.number, reason: 'on hold without activity for at least 14 days' });
      continue;
    }
    if (!issue.assignees.length && ['P0', 'P1'].includes(fields.get(issue.node_id)?.priority)) rows.unassigned.push({ number: issue.number, reason: `${fields.get(issue.node_id).priority}, no assignee` });
    const subs = children.get(issue.number) || [];
    if (labels.has('epic') && subs.length && subs.every((child) => child.state === 'closed')) {
      const completed = subs.filter((child) => child.state_reason === 'completed').length;
      const canceled = subs.filter((child) => child.state_reason === 'not_planned').length;
      rows.epics.push({ number: issue.number, reason: `all ${subs.length} direct sub-issues closed (${completed} completed, ${canceled} not planned, ${subs.length - completed - canceled} unspecified); ${unchecked(issue.body)} visible unchecked criteria — review final acceptance` });
    }
  }
  for (const values of Object.values(rows)) values.sort((a, b) => a.number - b.number);
  return rows;
}

async function review({ github, projectGraphql, owner, repo, now = new Date(), dryRun = true }) {
  const issues = (await github.paginate(github.rest.issues.listForRepo, { owner, repo, state: 'open', per_page: 100 })).filter((i) => !i.pull_request);
  const prs = await pages(async (cursor) => (await github.graphql(`query($owner:String!,$repo:String!,$cursor:String) {
    repository(owner:$owner,name:$repo) { pullRequests(first:100,after:$cursor,states:OPEN) {
      pageInfo { hasNextPage endCursor } nodes { number isDraft reviewDecision updatedAt
        labels(first:100) { nodes { name } pageInfo { hasNextPage } }
      }
    } }
  }`, { owner, repo, cursor })).repository.pullRequests);
  for (const pr of prs) nodes(pr.labels, 'PR labels');
  const items = await pages(async (cursor) => (await projectGraphql(`query($id:ID!,$cursor:String) {
    node(id:$id) { ... on ProjectV2 { items(first:100,after:$cursor) {
      pageInfo { hasNextPage endCursor } nodes { isArchived content { ... on Issue { id } }
        priority:fieldValueByName(name:"Priority") { ... on ProjectV2ItemFieldSingleSelectValue { name } }
      }
    } } }
  }`, { id: PROJECT_ID, cursor })).node.items);
  const fields = new Map(items.filter((i) => !i.isArchived && i.content?.id).map((i) => [i.content.id, { priority: i.priority?.name }]));
  const children = new Map();
  for (const issue of issues.filter((i) => i.labels.some((l) => l.name === 'epic'))) {
    children.set(issue.number, await github.paginate('GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues', { owner, repo, issue_number: issue.number, per_page: 100 }));
  }
  const rows = reviewCandidates({ issues, prs, fields, children, now });
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() + 6) % 7);
  const headings = { reviews: 'PRs awaiting review', approved: 'Approved PRs awaiting merge', unassigned: 'Unassigned high-priority work', held: 'Holds to revisit', epics: 'Epic completion review' };
  const sections = Object.entries(rows).map(([key, entries]) => `### ${headings[key]}\n\n${entries.length ? entries.map((entry) => `- ${entry.kind === 'PR' ? `[PR #${entry.number}](https://github.com/${owner}/${repo}/pull/${entry.number})` : issueLink(owner, repo, entry.number)} — ${entry.reason}`).join('\n') : 'None.'}`);
  const body = `Week of ${monday.toISOString().slice(0, 10)} (UTC).\n\n${sections.join('\n\n')}\n\nThis consolidated report requests review; it does not assign work, resume holds, close epics or mark acceptance passed. Ages use GitHub updated timestamps, not a claim about the exact time a reviewer was requested. Cancelled children are listed separately from completed work.`;
  const report = await managedIssue({ github, owner, repo, key: 'board-review', title: '[report] Board review and epic acceptance', body, label: REPORT_LABEL, dryRun });
  return { rows, report };
}

module.exports = { WATCHED, healthDryRun, age, workflowFindings, health, reviewCandidates, review };
