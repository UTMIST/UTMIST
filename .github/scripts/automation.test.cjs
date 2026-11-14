const { test } = require('node:test');
const assert = require('node:assert/strict');
const { BOT, text, unchecked, managedIssue, managedComment } = require('./automation-common.cjs');
const { references, warningsFor, check } = require('./pr-issue-check.cjs');
const { healthDryRun, workflowFindings, health, reviewCandidates, review } = require('./board-reports.cjs');
const connection = (nodes) => ({ nodes, pageInfo: { hasNextPage: false } });
const now = new Date('2026-10-26T12:00:00Z');
const daysAgo = (days) => new Date(now.getTime() - days * 86400000).toISOString();
const context = { owner: 'UTMIST', repo: 'UTMIST' };

function reportsFixture(initial = []) {
  const issues = structuredClone(initial);
  const comments = [];
  const writes = [];
  const github = { rest: { issues: {
    listForRepo: 'issues', listComments: 'comments',
    getLabel: async () => { throw Object.assign(new Error('Missing'), { status: 404 }); },
    createLabel: async (args) => writes.push(args),
    create: async (args) => {
      writes.push(args);
      const data = { ...args, number: 99, user: { login: BOT }, state: 'open' };
      issues.push(data);
      return { data };
    },
    update: async (args) => { writes.push(args); Object.assign(issues.find((i) => i.number === args.issue_number), args); },
    createComment: async (args) => { writes.push(args); comments.push({ ...args, id: 7, user: { login: BOT } }); },
    updateComment: async (args) => { writes.push(args); Object.assign(comments.find((c) => c.id === args.comment_id), args); },
  } }, paginate: async (method) => method === 'issues' ? issues : comments };
  return { github, issues, comments, writes, ...context };
}

test('reports ignore historical/code checklists and escape user-controlled Markdown and mentions', () => {
  assert.equal(unchecked('- [ ] Live acceptance\n<!-- - [ ] comment -->\n<details>\n- [ ] Historical\n</details>\n```\n- [ ] example\n```'), 1);
  assert.equal(text('@everyone <img>\n[x](url)'), '＠everyone \\<img\\> \\[x\\]\\(url\\)');
});

test('one incident is idempotent, closes on recovery and reopens on recurrence; dry runs never write', async () => {
  const f = reportsFixture();
  const args = { ...f, key: 'health', label: 'automation/health', title: 'Health', body: 'Failed' };
  assert.equal((await managedIssue({ ...args, active: false })).action, 'none');
  assert.equal((await managedIssue(args)).action, 'create');
  assert.deepEqual(f.writes, []);
  assert.equal((await managedIssue({ ...args, dryRun: false })).action, 'create');
  const count = f.writes.length;
  assert.equal((await managedIssue({ ...args, dryRun: false })).action, 'none');
  assert.equal(f.writes.length, count);
  assert.equal((await managedIssue({ ...args, dryRun: false, active: false, body: 'Recovered' })).action, 'recover');
  assert.equal(f.issues[0].state_reason, 'completed');
  assert.equal((await managedIssue({ ...args, dryRun: false })).action, 'reopen');
  assert.equal(f.issues.length, 1);
});

test('managed content never overwrites a human marker and refuses duplicate bot reports', async () => {
  const f = reportsFixture([{ number: 1, user: { login: 'human' }, body: '<!-- utmist:health -->', state: 'open' }]);
  const args = { ...f, key: 'health', label: 'automation/health', title: 'Health', body: 'Failed', dryRun: false };
  await managedIssue(args);
  assert.equal(f.issues[0].body, '<!-- utmist:health -->');
  f.issues.push({ ...f.issues[1], number: 100 });
  await assert.rejects(managedIssue(args), /Duplicate/);
  f.comments.push({ id: 1, user: { login: 'human' }, body: '<!-- utmist:deploy -->' });
  const comment = { ...f, number: 7, key: 'deploy', body: 'success' };
  await managedComment(comment);
  assert.equal(f.comments.length, 1);
  await managedComment({ ...comment, dryRun: false });
  await managedComment({ ...comment, dryRun: false });
  assert.equal(f.comments.length, 2);
  await managedComment({ ...comment, body: 'failure', dryRun: false });
  assert.match(f.comments[1].body, /failure/);
  assert.equal(f.comments[0].body, '<!-- utmist:deploy -->');
});

const pr = { labels: [], user: { login: 'human' }, base: { ref: 'main' }, body: '' };
const warningArgs = { pr, linked: [], referenced: [], files: [{ filename: 'services/llm/src/api.py' }], defaultBranch: 'main' };
test('PR linking accepts verified plain references and narrowly scoped documented exemptions', () => {
  assert.deepEqual(references('Part of #12, UTMIST/UTMIST#13, other/repo#14 and https://github.com/UTMIST/UTMIST/issues/15\n```\n#16\n```', 'UTMIST', 'UTMIST'), [12, 13, 15]);
  assert.equal(warningsFor(warningArgs).length, 1);
  assert.deepEqual(warningsFor({ ...warningArgs, referenced: [12] }), []);
  assert.deepEqual(warningsFor({ ...warningArgs, pr: { ...pr, labels: [{ name: 'no-issue-needed' }] } }), []);
  assert.deepEqual(warningsFor({ ...warningArgs, pr: { ...pr, user: { login: 'dependabot[bot]' } } }), []);
  assert.deepEqual(warningsFor({ ...warningArgs, files: [{ filename: 'docs/API.md' }] }), []);
  assert.equal(warningsFor({ ...warningArgs, files: [{ filename: 'docs/API.md' }, { filename: 'src/app.js' }] }).length, 1);
});

test('closing an epic or unchecked scope warns even for exempt PRs; other bases warn too', () => {
  const linked = [{ number: 1, repository: { nameWithOwner: 'UTMIST/UTMIST' }, state: 'OPEN', body: '- [ ] Acceptance', labels: connection([{ name: 'epic' }]) }];
  const warnings = warningsFor({ ...warningArgs, linked, pr: { ...pr, labels: ['no-issue-needed'], body: 'Closes #1', base: { ref: 'release' } } });
  assert.equal(warnings.length, 3);
  assert.ok(warnings.some((w) => w.includes('full parent scope')));
  assert.ok(warnings.some((w) => w.includes('unchecked criteria')));
});

test('PR check rejects truncated file data and does not treat a PR number as an issue reference', async () => {
  const github = { rest: { pulls: { get: async () => ({ data: { ...pr, body: 'Related #7', changed_files: 1 } }), listFiles: 'files' },
    repos: { get: async () => ({ data: { default_branch: 'main' } }) },
    issues: { get: async () => ({ data: { number: 7, pull_request: {} } }) } },
    paginate: async () => warningArgs.files,
    graphql: async () => ({ repository: { pullRequest: { closingIssuesReferences: connection([]) } } }) };
  assert.equal((await check({ github, ...context, number: 1 })).warnings.length, 1);
  github.paginate = async () => [];
  await assert.rejects(check({ github, ...context, number: 1 }), /Incomplete changed-file/);
});

test('health detects disabled, failed and stale schedules; manual dry runs cannot renew a heartbeat', () => {
  const spec = { file: 'board.yml', scheduled: true, maxAge: 4 / 24 };
  const workflow = { state: 'active', created_at: daysAgo(30) };
  const run = { id: 1, status: 'completed', event: 'schedule', conclusion: 'success', created_at: daysAgo(1) };
  assert.equal(workflowFindings(spec, workflow, [run, { ...run, event: 'workflow_dispatch', created_at: daysAgo(0) }], now).length, 1);
  assert.deepEqual(workflowFindings(spec, workflow, [{ ...run, created_at: daysAgo(0.01) }], now), []);
  assert.equal(workflowFindings(spec, workflow, [{ ...run, conclusion: 'failure' }], now).length, 2);
  assert.match(workflowFindings(spec, { ...workflow, state: 'disabled_manually' }, [], now)[0], /disabled/);
  assert.deepEqual(workflowFindings(spec, { ...workflow, created_at: daysAgo(0.01) }, [], now), []);
});

test('health remains able to report a broken project token without publishing exception details', async () => {
  const f = reportsFixture();
  f.github.rest.actions = {
    getWorkflow: async () => ({ data: { state: 'active', created_at: daysAgo(0) } }),
    listWorkflowRuns: async () => ({ data: { workflow_runs: [] } }),
  };
  const result = await health({ ...f, now, projectGraphql: async () => { throw new Error('sensitive request value'); } });
  assert.equal(result.findings.length, 1);
  assert.match(result.report.body, /credential probe failed/);
  assert.doesNotMatch(JSON.stringify(result), /sensitive request value/);
  assert.deepEqual(f.writes, []);
});

test('manual workflow completion cannot indirectly write health incidents; direct dispatch can opt in', async () => {
  const context = { eventName: 'workflow_run', payload: { workflow_run: { event: 'workflow_dispatch' } } };
  const f = reportsFixture();
  f.github.rest.actions = {
    getWorkflow: async () => ({ data: { state: 'active', created_at: daysAgo(0) } }),
    listWorkflowRuns: async () => ({ data: { workflow_runs: [] } }),
  };
  const result = await health({ ...f, now, projectGraphql: null, dryRun: healthDryRun(context, false) });
  assert.equal(result.report.action, 'create');
  assert.deepEqual(f.writes, []);
  assert.equal(healthDryRun({ eventName: 'workflow_dispatch', payload: {} }, true), true);
  assert.equal(healthDryRun({ eventName: 'workflow_dispatch', payload: {} }, false), false);
  assert.equal(healthDryRun({ eventName: 'schedule', payload: {} }, false), false);
  assert.equal(healthDryRun({ eventName: 'workflow_run', payload: { workflow_run: { event: 'schedule' } } }, false), false);
});

test('weekly exceptions respect holds, priority, review state and partial/cancelled epics', () => {
  const issue = (number, labels = []) => ({ number, node_id: `I${number}`, labels: labels.map((name) => ({ name })), assignees: [], body: '- [ ] Verify', updated_at: daysAgo(20) });
  const pull = (number, reviewDecision, labels = []) => ({ number, reviewDecision, isDraft: false, updatedAt: daysAgo(4), labels: connection(labels.map((name) => ({ name }))) });
  const rows = reviewCandidates({ now,
    issues: [issue(1), issue(2, ['on hold']), issue(3, ['epic']), issue(4, ['epic']), issue(5, ['automation/report'])],
    prs: [pull(11, 'REVIEW_REQUIRED'), pull(12, 'APPROVED'), pull(13, 'CHANGES_REQUESTED'), { ...pull(14, 'REVIEW_REQUIRED'), isDraft: true }, { ...pull(15, 'APPROVED', ['on hold']), updatedAt: daysAgo(20) }],
    fields: new Map([['I1', { priority: 'P1' }], ['I2', { priority: 'P0' }], ['I5', { priority: 'P0' }]]),
    children: new Map([[3, [{ state: 'closed', state_reason: 'completed' }, { state: 'closed', state_reason: 'not_planned' }]], [4, [{ state: 'open' }]]]),
  });
  assert.deepEqual(rows.reviews.map((r) => r.number), [11]);
  assert.deepEqual(rows.approved.map((r) => r.number), [12]);
  assert.deepEqual(rows.unassigned.map((r) => r.number), [1]);
  assert.deepEqual(rows.held.map((r) => r.number), [2, 15]);
  assert.equal(rows.epics.length, 1);
  assert.match(rows.epics[0].reason, /1 completed, 1 not planned/);
  assert.match(rows.epics[0].reason, /1 visible unchecked/);
});

test('weekly report reads sub-issues and project priorities and previews without writes', async () => {
  const f = reportsFixture();
  const epic = { number: 1, node_id: 'I1', labels: [{ name: 'epic' }], assignees: [], body: '', updated_at: daysAgo(1) };
  f.github.paginate = async (method, args) => method === 'issues' ? (args.state === 'open' ? [epic] : []) : [{ state: 'closed', state_reason: 'completed' }];
  f.github.graphql = async () => ({ repository: { pullRequests: connection([]) } });
  const projectGraphql = async () => ({ node: { items: connection([{ content: { id: 'I1' }, priority: { name: 'P1' } }]) } });
  const result = await review({ ...f, projectGraphql, now });
  assert.equal(result.rows.epics.length, 1);
  assert.equal(result.rows.unassigned.length, 1);
  assert.match(result.report.body, /Week of 2026-10-26/);
  assert.deepEqual(f.writes, []);
});
