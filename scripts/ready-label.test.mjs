import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

// Execute the actual github-script body. The mock API permits dependency reads
// and label writes only, so reintroducing project writes fails these tests.
const workflow = readFileSync(new URL('../.github/workflows/blocked-ready-automation.yml', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const script = workflow.split('          script: |\n')[1]
  .split('\n').map((line) => line.replace(/^ {12}/, '')).join('\n');

const issue = (number, { blockers = ['CLOSED'], assigned = false, ready = false, state = 'OPEN' } = {}) => ({
  number, state,
  blockedBy: { totalCount: blockers.length, nodes: blockers.map((state, i) => ({ number: 100 + i, state })) },
  assignees: { totalCount: assigned ? 1 : 0 },
  labels: { nodes: ready ? [{ name: 'ready' }] : [] },
});

async function run(issues, { eventName = 'workflow_dispatch', action, number = 1, pages, dependents = [] } = {}) {
  const writes = [];
  const reads = [];
  const byNumber = new Map(issues.map((i) => [i.number, i]));
  const applyLabel = (operation) => async (args) => {
    assert.equal(args.owner, 'UTMIST');
    assert.equal(args.repo, 'UTMIST');
    assert.equal(operation === 'add' ? args.labels[0] : args.name, 'ready');
    writes.push([operation, args.issue_number]);
    byNumber.get(args.issue_number).labels.nodes = operation === 'add' ? [{ name: 'ready' }] : [];
  };
  const github = {
    graphql: async (query, vars) => {
      assert.match(query.trim(), /^query\(/);
      assert.doesNotMatch(query, /project/i);
      if (query.includes('issues(first:')) {
        const index = vars.cursor === null ? 0 : Number(vars.cursor);
        const list = pages ?? [issues];
        reads.push(['page', index]);
        return { repository: { issues: {
          nodes: list[index],
          pageInfo: { hasNextPage: index + 1 < list.length, endCursor: String(index + 1) },
        } } };
      }
      if (query.includes('blocking(first:')) {
        return { repository: { issue: { blocking: { nodes: dependents } } } };
      }
      reads.push(['issue', vars.number]);
      assert.ok(byNumber.has(vars.number));
      return { repository: { issue: byNumber.get(vars.number) } };
    },
    rest: { issues: { addLabels: applyLabel('add'), removeLabel: applyLabel('remove') } },
  };
  const context = { repo: { owner: 'UTMIST', repo: 'UTMIST' }, eventName, payload: { action, issue: { number } } };
  const warnings = [];
  await runInNewContext(`(async () => {\n${script}\n})()`, {
    github, context,
    core: { info() {}, warning(message) { warnings.push(message); } },
    fetch() { throw new Error('Readiness must not write project progress'); },
  });
  assert.deepEqual(warnings, []);
  return { writes, reads };
}

for (const [name, options, expected] of [
  ['last blocker closed', {}, [['add', 1]]],
  ['remaining open blocker', { blockers: ['CLOSED', 'OPEN'], ready: true }, [['remove', 1]]],
  ['claimed work', { assigned: true, ready: true }, [['remove', 1]]],
  ['never had dependencies', { blockers: [] }, []],
  ['last dependency removed', { blockers: [], ready: true }, [['remove', 1]]],
  ['already ready', { ready: true }, []],
  ['closed issue', { state: 'CLOSED', ready: true }, [['remove', 1]]],
]) {
  test(name, async () => {
    assert.deepEqual((await run([issue(1, options)])).writes, expected);
  });
}

test('assignment and unassignment re-evaluate the claimed issue', async () => {
  for (const [action, assigned, ready, expected] of [
    ['assigned', true, true, 'remove'], ['unassigned', false, false, 'add'],
  ]) {
    assert.deepEqual((await run([issue(1, { assigned, ready })], { eventName: 'issues', action })).writes, [[expected, 1]]);
  }
});

test('closing and reopening a blocker re-evaluate open dependents only', async () => {
  for (const [action, state, ready, expected] of [
    ['closed', 'CLOSED', false, 'add'], ['reopened', 'OPEN', true, 'remove'],
  ]) {
    const result = await run([issue(1, { state, blockers: [] }), issue(2, { blockers: [state], ready })], {
      eventName: 'issues', action, dependents: [{ number: 2, state: 'OPEN' }, { number: 3, state: 'CLOSED' }],
    });
    assert.deepEqual(result.writes, [[expected, 2]]);
    assert.deepEqual(result.reads, [['issue', 1], ['issue', 2]]);
  }
});

test('scheduled sweep reads every page and a repeated sweep makes no writes', async () => {
  const first = issue(1);
  const second = issue(2, { blockers: ['OPEN'], ready: true });
  const options = { eventName: 'schedule', pages: [[first], [second]] };
  const result = await run([first, second], options);
  assert.deepEqual(result.reads, [['page', 0], ['page', 1]]);
  assert.deepEqual(result.writes, [['add', 1], ['remove', 2]]);
  assert.deepEqual((await run([first, second], options)).writes, []);
});
