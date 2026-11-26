const BOT = 'github-actions[bot]';
const REPORT_LABEL = 'automation/report';
const PROJECT_ID = 'PVT_kwDOAovuf84Bf3xL';

function text(value) {
  return String(value || '').replace(/[\r\n\t]+/g, ' ').replace(/@/g, '＠')
    .replace(/[\\`*_{}[\]()<>#|]/g, '\\$&').slice(0, 240);
}

function visibleBody(body) {
  return String(body || '').replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<details\b[^>]*>[\s\S]*?<\/details>/gi, '')
    .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, '');
}

function unchecked(body) {
  return (visibleBody(body).match(/^\s*[-*]\s+\[ \]\s+\S/gm) || []).length;
}

function nodes(connection, description) {
  if (!connection || connection.pageInfo.hasNextPage) throw new Error(`Incomplete ${description}`);
  return connection.nodes;
}

async function pages(read) {
  const result = [];
  let cursor = null;
  do {
    const page = await read(cursor);
    result.push(...page.nodes);
    cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
    if (page.pageInfo.hasNextPage && !cursor) throw new Error('Missing pagination cursor');
  } while (cursor);
  return result;
}

function issueLink(owner, repo, number) {
  return `[#${number}](https://github.com/${owner}/${repo}/issues/${number})`;
}

async function ensureLabel(github, owner, repo, name, description) {
  try { await github.rest.issues.getLabel({ owner, repo, name }); }
  catch (error) {
    if (error.status !== 404) throw error;
    await github.rest.issues.createLabel({ owner, repo, name, description, color: 'D4C5F9' });
  }
}

// One managed issue per report/incident. The bot only edits its own marked issue.
// A healthy monitor does not create an empty incident; recurrence reuses it.
async function managedIssue({ github, owner, repo, key, title, body, label, active = true, dryRun = true }) {
  const marker = `<!-- utmist:${key} -->`;
  const matches = (await github.paginate(github.rest.issues.listForRepo, {
    owner, repo, state: 'all', labels: label, per_page: 100,
  })).filter((i) => !i.pull_request && i.user.login === BOT && i.body?.includes(marker));
  if (matches.length > 1) throw new Error(`Duplicate managed issue: ${key}`);
  const existing = matches[0];
  if (!active && !existing) return { action: 'none' };
  const desired = `${marker}\n${body}`;
  if (desired.length > 60000) throw new Error('Report exceeds issue body limit');
  const state = active ? 'open' : 'closed';
  if (existing?.body === desired && existing.state === state && existing.title === title) return { action: 'none', number: existing.number };
  const action = existing ? (existing.state === state ? 'update' : active ? 'reopen' : 'recover') : 'create';
  if (dryRun) return { action, number: existing?.number, body: desired };
  if (!existing) {
    await ensureLabel(github, owner, repo, label, label === REPORT_LABEL ? 'Consolidated automation report; excluded from the working board.' : 'Actionable repository automation health incident.');
    const { data } = await github.rest.issues.create({ owner, repo, title, body: desired, labels: [label, 'area: engineering'] });
    return { action, number: data.number };
  }
  await github.rest.issues.update({ owner, repo, issue_number: existing.number,
    title, body: desired, state, ...(active ? {} : { state_reason: 'completed' }) });
  return { action, number: existing.number };
}

async function managedComment({ github, owner, repo, number, key, body, dryRun = true }) {
  const marker = `<!-- utmist:${key} -->`;
  const comments = await github.paginate(github.rest.issues.listComments, { owner, repo, issue_number: number, per_page: 100 });
  const matches = comments.filter((c) => c.user.login === BOT && c.body?.includes(marker));
  if (matches.length > 1) throw new Error(`Duplicate managed comment: ${key}`);
  const existing = matches[0];
  const desired = `${marker}\n${body}`;
  if (existing?.body === desired) return { action: 'none', number };
  const action = existing ? 'update' : 'create';
  if (!dryRun) {
    if (existing) await github.rest.issues.updateComment({ owner, repo, comment_id: existing.id, body: desired });
    else await github.rest.issues.createComment({ owner, repo, issue_number: number, body: desired });
  }
  return { action, number, ...(dryRun ? { body: desired } : {}) };
}

module.exports = { BOT, REPORT_LABEL, PROJECT_ID, text, visibleBody, unchecked, nodes, pages, issueLink, managedIssue, managedComment };
