const { test } = require('node:test');
const assert = require('node:assert/strict');
const { BOT } = require('./automation-common.cjs');
const { PROJECT, TEAM, ENVIRONMENT, deploymentUrl, start, finish } = require('./vercel-deployment.cjs');
const { evidence } = require('./deployment-evidence.cjs');

const context = { owner: 'UTMIST', repo: 'UTMIST' };
const sha = 'a'.repeat(40);
const url = 'https://utmist-test.vercel.app';
const runId = 42;
const runAttempt = 1;
const logUrl = `https://github.com/UTMIST/UTMIST/actions/runs/${runId}/attempts/${runAttempt}`;
const deployment = { id: 123, sha, environment: ENVIRONMENT, creator: { login: BOT },
  payload: { source: 'utmist-vercel-ci-v1', projectId: PROJECT, teamId: TEAM, runId, runAttempt } };
const status = { id: 9, creator: { login: BOT }, state: 'success', environment_url: url,
  log_url: logUrl, created_at: '2026-10-27T12:00:00Z' };
// Shape verified against the live production deployment response.
const provider = { project: { id: PROJECT }, target: 'production', readyState: 'READY',
  url: new URL(url).hostname, meta: { githubCommitSha: sha } };
const connection = (nodes) => ({ nodes, pageInfo: { hasNextPage: false } });

function fixture() {
  const writes = [];
  const comments = [];
  const run = { path: '.github/workflows/ci.yml', event: 'push', head_branch: 'main',
    head_repository: { full_name: 'UTMIST/UTMIST' }, status: 'completed', head_sha: sha, run_attempt: runAttempt };
  const records = [structuredClone(deployment)];
  const statuses = [{ ...status, id: 1, state: 'in_progress' }, structuredClone(status)];
  const github = {
    rest: {
      actions: { getWorkflowRun: async () => ({ data: run }) },
      repos: {
        getDeployment: async () => ({ data: records[0] }),
        createDeployment: async (args) => { writes.push(args); return { data: { id: 123 } }; },
        createDeploymentStatus: async (args) => { writes.push(args); },
        listDeployments: 'deployments', listDeploymentStatuses: 'statuses', listPullRequestsAssociatedWithCommit: 'pulls',
      },
      pulls: { get: async ({ pull_number }) => ({ data: {
        number: pull_number, base: { ref: 'main' }, merged_at: pull_number === 2 ? null : '2026-10-27T11:00:00Z',
        merge_commit_sha: pull_number === 3 ? 'b'.repeat(40) : sha,
      } }) },
      issues: {
        listComments: 'comments',
        createComment: async (args) => { writes.push(args); comments.push({ ...args, id: comments.length + 1, user: { login: BOT } }); },
        updateComment: async (args) => { writes.push(args); Object.assign(comments.find((c) => c.id === args.comment_id), args); },
      },
    },
    paginate: async (method, args) => {
      if (method === 'deployments') return records;
      if (method === 'statuses') return statuses;
      if (method === 'pulls') return [{ number: 1 }, { number: 2 }, { number: 3 }];
      if (method === 'comments') return comments.filter((c) => c.issue_number === args.issue_number);
      throw new Error('Unexpected API');
    },
    graphql: async () => ({ repository: { pullRequest: { closingIssuesReferences: connection([
      { number: 11, repository: { nameWithOwner: 'UTMIST/UTMIST' } },
      { number: 12, repository: { nameWithOwner: 'other/repo' } },
    ]) } } }),
  };
  return { github, ...context, runId, runAttempt, sha, deploymentId: deployment.id,
    writes, comments, run, records, statuses };
}

test('deployment URLs reject credentials, arbitrary hosts, paths and query strings', () => {
  assert.equal(deploymentUrl(url), url);
  for (const value of ['javascript:alert(1)', 'http://utmist-test.vercel.app', `${url}.evil.test`,
    'https://user:pass@utmist-test.vercel.app', `${url}/secret`, `${url}?token=secret`, `${url}#secret`]) {
    assert.equal(deploymentUrl(value), null);
  }
});

test('start records the precise SHA/run attempt without auto-merge or implicit contexts', async () => {
  const f = fixture();
  assert.equal(await start(f), 123);
  assert.equal(f.writes[0].ref, sha);
  assert.equal(f.writes[0].auto_merge, false);
  assert.deepEqual(f.writes[0].required_contexts, []);
  assert.deepEqual(f.writes[0].payload, deployment.payload);
  assert.equal(f.writes[1].state, 'in_progress');
  const invalid = fixture();
  await assert.rejects(start({ ...invalid, sha: 'main' }), /Invalid deployment/);
  assert.deepEqual(invalid.writes, []);
});

test('CLI success is confirmed with actual provider project, target, SHA and READY state', async () => {
  const f = fixture();
  const result = await finish({ ...f, outcome: 'success', url, token: 'test-only', fetchImpl: async (endpoint, options) => {
    assert.equal(new URL(endpoint).hostname, 'api.vercel.com');
    assert.equal(new URL(endpoint).searchParams.get('teamId'), TEAM);
    assert.equal(options.redirect, 'error');
    return { ok: true, json: async () => provider };
  } });
  assert.deepEqual(result, { state: 'success' });
  assert.equal(f.writes[0].environment_url, url);
  assert.equal(f.writes[0].log_url, logUrl);
});

test('unverified, mismatched or unavailable provider data records error and fails visibly', async () => {
  for (const data of [
    { ...provider, project: { id: 'other-project' } }, { ...provider, target: 'preview' },
    { ...provider, readyState: 'BUILDING' }, { ...provider, meta: { githubCommitSha: 'b'.repeat(40) } },
    { ...provider, url: 'other.vercel.app' },
  ]) {
    const f = fixture();
    await assert.rejects(finish({ ...f, outcome: 'success', url, token: 'test-only',
      fetchImpl: async () => ({ ok: true, json: async () => data }) }), /Could not verify/);
    assert.equal(f.writes[0].state, 'error');
    assert.equal(f.writes[0].environment_url, undefined);
  }
  const f = fixture();
  await assert.rejects(finish({ ...f, outcome: 'success', url, token: 'secret-value',
    fetchImpl: async () => { throw new Error('sensitive request secret-value'); } }), /Could not verify/);
  assert.doesNotMatch(JSON.stringify(f.writes), /secret-value|sensitive/);
});

test('failed/cancelled CLI attempts never query the provider or report success', async () => {
  for (const outcome of ['failure', 'cancelled', 'skipped']) {
    const f = fixture();
    assert.equal((await finish({ ...f, outcome,
      fetchImpl: async () => assert.fail('Should not fetch') })).state, 'failure');
  }
  const f = fixture();
  await assert.rejects(finish({ ...f, sha: 'b'.repeat(40), outcome: 'failure' }), /identity mismatch/);
  assert.deepEqual(f.writes, []);
});

test('evidence uses current status and only the exact merged PR and same-repo closing issues', async () => {
  const f = fixture();
  const result = await evidence(f);
  assert.equal(result.state, 'success');
  assert.deepEqual(result.comments.map((c) => c.number), [1, 11]);
  assert.match(result.comments[0].body, /not end-to-end acceptance/);
  assert.deepEqual(f.writes, []);
  await evidence({ ...f, dryRun: false });
  const writes = f.writes.length;
  await evidence({ ...f, dryRun: false });
  assert.equal(f.writes.length, writes);
  f.statuses.push({ ...status, id: 10, state: 'failure', environment_url: '' });
  await evidence({ ...f, dryRun: false });
  assert.match(f.comments[0].body, /production: failure/);
  assert.doesNotMatch(f.comments[0].body, /Verified READY/);
});

test('evidence ignores PR runs, other workflows, fork sources and prior attempts', async () => {
  for (const change of [{ event: 'pull_request' }, { path: '.github/workflows/other.yml' },
    { head_branch: 'feature' }, { head_repository: { full_name: 'other/repo' } }, { status: 'in_progress' }]) {
    const f = fixture();
    Object.assign(f.run, change);
    assert.match((await evidence({ ...f, dryRun: false })).skipped, /Not a completed/);
    assert.deepEqual(f.writes, []);
  }
  const f = fixture();
  f.run.run_attempt = 2;
  assert.match((await evidence(f)).skipped, /No recorded/);
});

test('evidence refuses duplicate records and truncated links before comments', async () => {
  const f = fixture();
  f.records.push(structuredClone(deployment));
  await assert.rejects(evidence({ ...f, dryRun: false }), /Duplicate deployment/);
  f.records.pop();
  f.github.graphql = async () => ({ repository: { pullRequest: { closingIssuesReferences: {
    nodes: [], pageInfo: { hasNextPage: true },
  } } } });
  await assert.rejects(evidence({ ...f, dryRun: false }), /Incomplete deployment issue links/);
  assert.deepEqual(f.writes, []);
});

test('evidence rejects untrusted actors and malformed success URLs', async () => {
  const f = fixture();
  f.records[0].creator.login = 'human';
  assert.match((await evidence(f)).skipped, /No recorded/);
  f.records[0].creator.login = BOT;
  f.statuses[1].creator.login = 'human';
  assert.match((await evidence(f)).skipped, /No current trusted/);
  f.statuses[1].creator.login = BOT;
  f.statuses[1].environment_url = 'https://evil.test';
  await assert.rejects(evidence({ ...f, dryRun: false }), /no verified Vercel URL/);
  assert.deepEqual(f.writes, []);
});
