// Reconcile current GitHub state, never the potentially stale event payload.
// Only Status and ready are owned here. Native dependencies never change Status.
const { PROJECT_ID, REPORT_LABEL, pages } = require('./automation-common.cjs');
const STATUSES = ['Not Started', 'In Development', 'In Review', 'Done'];
const PAGE = 'pageInfo { hasNextPage endCursor }';
const LABELS = `labels(first:100) { nodes { name } ${PAGE} }`;
const LINKS = `closingIssuesReferences(first:100) {
  nodes { id number repository { nameWithOwner } } ${PAGE}
}`;
const ISSUE = `id number state body ${LABELS} assignees(first:1) { totalCount }
  blockedBy(first:100) { nodes { id number state repository { nameWithOwner } } ${PAGE} }
  repository { nameWithOwner }`;
const PR = `id number state isDraft reviewDecision merged ${LABELS} ${LINKS}
  repository { nameWithOwner }`;

function labelsOf(item) {
  return new Set(item.labels.nodes.map((label) => label.name));
}

function prStatus(pr) {
  if (pr.state !== 'OPEN') return 'Done'; // Closed unmerged is disposed, not shipped.
  if (labelsOf(pr).has('on hold')) return 'Not Started';
  return pr.isDraft || pr.reviewDecision === 'CHANGES_REQUESTED' ? 'In Development' : 'In Review';
}

function issuePlan(issue, current, linked, blockers) {
  let status = current || 'Not Started';
  const held = labelsOf(issue).has('on hold');
  const active = linked.filter((pr) => pr.state === 'OPEN');
  const working = active.filter((pr) => !labelsOf(pr).has('on hold'));
  const blocked = blockers.some((blocker) => blocker.state !== 'CLOSED');
  const assigned = issue.assignees.totalCount > 0;
  if (issue.state === 'CLOSED') status = 'Done';
  else if (held || (active.length > 0 && working.length === 0)) status = 'Not Started';
  else if (working.length) {
    // Any requested rework/draft keeps a multi-PR issue in development.
    status = working.some((pr) => prStatus(pr) === 'In Development') ? 'In Development' : 'In Review';
  } else if (status === 'Done' || (status === 'In Review' && linked.some((pr) => !pr.merged))) {
    status = assigned ? 'In Development' : 'Not Started';
  }
  const available = issue.state === 'OPEN' && !held && !active.length;
  return {
    status,
    ready: available && !assigned && !blocked && blockers.length > 0 && status === 'Not Started',
  };
}

function complete(connection, description) {
  if (connection.pageInfo.hasNextPage) throw new Error(`Incomplete ${description}; refusing partial reconciliation`);
  return connection.nodes;
}

async function snapshot(graphql, owner, repo) {
  const project = (await graphql(`query($id:ID!) { node(id:$id) { ... on ProjectV2 {
    id field(name:"Status") { ... on ProjectV2SingleSelectField { id options { id name } } }
  } } }`, { id: PROJECT_ID })).node;
  const options = Object.fromEntries((project?.field?.options || []).map((option) => [option.name, option.id]));
  for (const name of STATUSES) if (!options[name]) throw new Error(`Missing project Status option: ${name}`);
  const items = await pages(async (cursor) => (await graphql(`query($id:ID!,$cursor:String) {
    node(id:$id) { ... on ProjectV2 { items(first:100,after:$cursor) { ${PAGE} nodes {
      id isArchived fieldValueByName(name:"Status") { ... on ProjectV2ItemFieldSingleSelectValue { name } }
      content { __typename ... on Issue { ${ISSUE} } ... on PullRequest { ${PR} } }
    } } } }
  }`, { id: PROJECT_ID, cursor })).node.items);
  const issues = await pages(async (cursor) => (await graphql(`query($owner:String!,$repo:String!,$cursor:String) {
    repository(owner:$owner,name:$repo) { issues(first:100,after:$cursor,states:OPEN) { ${PAGE} nodes { ${ISSUE} } } }
  }`, { owner, repo, cursor })).repository.issues);
  const prs = await pages(async (cursor) => (await graphql(`query($owner:String!,$repo:String!,$cursor:String) {
    repository(owner:$owner,name:$repo) { pullRequests(first:100,after:$cursor,states:OPEN) { ${PAGE} nodes { ${PR} } } }
  }`, { owner, repo, cursor })).repository.pullRequests);
  // Closed issues may have left the project or been archived before an event
  // arrived. Repair stale availability independently of historical card status.
  const closedReady = await pages(async (cursor) => (await graphql(`query($owner:String!,$repo:String!,$cursor:String) {
    repository(owner:$owner,name:$repo) { closedReady:issues(first:100,after:$cursor,states:CLOSED,labels:["ready"]) {
      ${PAGE} nodes { ${ISSUE} }
    } }
  }`, { owner, repo, cursor })).repository.closedReady);
  return { project, options, items, issues, prs, closedReady };
}

async function reconcile({ github, graphql, owner, repo, dryRun = true, log = console.log }) {
  const state = await snapshot(graphql, owner, repo);
  const fullName = `${owner}/${repo}`;
  const items = new Map(state.items.filter((item) => item.content?.repository?.nameWithOwner === fullName)
    .map((item) => [item.content.id, item]));
  const issues = new Map();
  const prs = new Map();
  for (const item of items.values()) {
    if (item.isArchived && item.content.state !== 'OPEN') continue;
    (item.content.__typename === 'Issue' ? issues : prs).set(item.content.id, item.content);
  }
  // More recent repository reads supersede the project's content snapshot.
  for (const issue of state.issues) issues.set(issue.id, issue);
  for (const issue of state.closedReady) if (issues.has(issue.id)) issues.set(issue.id, issue);
  for (const pr of state.prs) prs.set(pr.id, pr);
  const linked = new Map();
  for (const pr of prs.values()) {
    complete(pr.labels, `labels on PR #${pr.number}`);
    for (const issue of complete(pr.closingIssuesReferences, `closing links on PR #${pr.number}`)) {
      if (issue.repository.nameWithOwner !== fullName) continue;
      if (!linked.has(issue.id)) linked.set(issue.id, []);
      linked.get(issue.id).push(pr);
    }
  }
  const plans = [];
  for (const issue of issues.values()) {
    complete(issue.labels, `labels on issue #${issue.number}`);
    // Consolidated advisory reports are not deliverable work. The native
    // auto-add filter excludes this label too; health incidents remain work.
    if (labelsOf(issue).has(REPORT_LABEL)) continue;
    const blockers = [...complete(issue.blockedBy, `dependencies on issue #${issue.number}`)];
    const item = items.get(issue.id);
    plans.push({ content: issue, item, ...issuePlan(issue, item?.fieldValueByName?.name, linked.get(issue.id) || [], blockers) });
  }
  for (const pr of prs.values()) plans.push({ content: pr, item: items.get(pr.id), status: prStatus(pr) });
  for (const issue of state.closedReady) {
    complete(issue.labels, `labels on closed issue #${issue.number}`);
    if (!issues.has(issue.id)) plans.push({ content: issue, labelOnly: true, ready: false });
  }

  // Validate the complete snapshot before making any writes. Do not close issues
  // here: GitHub's explicit closing links own that decision at merge time.
  const changes = [];
  for (const plan of plans) {
    const { content, status } = plan;
    let item = plan.item;
    if (!plan.labelOnly && (!item || item.isArchived || item.fieldValueByName?.name !== status)) {
      if (!dryRun && issues.has(content.id) && status === 'Done') {
        // A project may enable native Done → close. A reopened issue must not be closed
        // again by a snapshot that observed it just before the human reopened it.
        const { data } = await github.rest.issues.get({ owner, repo, issue_number: content.number });
        if (data.state !== 'closed') {
          changes.push({ number: content.number, skipped: 'Issue reopened during reconciliation' });
          continue;
        }
      }
      changes.push({ number: content.number, type: content.__typename || (issues.has(content.id) ? 'Issue' : 'PullRequest'), from: item?.fieldValueByName?.name || null, to: status, add: !item, unarchive: !!item?.isArchived });
      if (!dryRun) {
        if (!item) item = (await graphql(`mutation($project:ID!,$content:ID!) {
          addProjectV2ItemById(input:{projectId:$project,contentId:$content}) { item { id } }
        }`, { project: PROJECT_ID, content: content.id })).addProjectV2ItemById.item;
        if (item.isArchived) await graphql(`mutation($project:ID!,$item:ID!) {
          unarchiveProjectV2Item(input:{projectId:$project,itemId:$item}) { item { id } }
        }`, { project: PROJECT_ID, item: item.id });
        await graphql(`mutation($project:ID!,$item:ID!,$field:ID!,$option:String!) {
          updateProjectV2ItemFieldValue(input:{projectId:$project,itemId:$item,fieldId:$field,value:{singleSelectOptionId:$option}}) { projectV2Item { id } }
        }`, { project: PROJECT_ID, item: item.id, field: state.project.field.id, option: state.options[status] });
      }
    }
    for (const name of ['ready']) {
      if (plan[name] === undefined || labelsOf(content).has(name) === plan[name]) continue;
      changes.push({ number: content.number, label: name, add: plan[name] });
      if (!dryRun) {
        if (plan[name]) await github.rest.issues.addLabels({ owner, repo, issue_number: content.number, labels: [name] });
        else try {
          await github.rest.issues.removeLabel({ owner, repo, issue_number: content.number, name });
        } catch (error) { if (error.status !== 404) throw error; }
      }
    }
  }
  log(JSON.stringify({ dryRun, issues: issues.size, pullRequests: prs.size, changes }));
  return { dryRun, issues: issues.size, pullRequests: prs.size, changes };
}

module.exports = { PROJECT_ID, pages, prStatus, issuePlan, snapshot, reconcile };
