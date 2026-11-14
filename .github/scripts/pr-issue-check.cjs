const { visibleBody, unchecked, nodes } = require('./automation-common.cjs');

function references(body, owner, repo) {
  const source = visibleBody(body);
  const found = new Set();
  for (const match of source.matchAll(/(^|[^\w/])(?:(\w[\w.-]*)\/([\w.-]+))?#(\d+)\b/gm)) {
    if (!match[2] || `${match[2]}/${match[3]}`.toLowerCase() === `${owner}/${repo}`.toLowerCase()) found.add(Number(match[4]));
  }
  const prefix = `https://github.com/${owner}/${repo}/issues/`.toLowerCase();
  for (const match of source.matchAll(/https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/(\d+)\b/gi)) {
    if (match[0].toLowerCase().startsWith(prefix)) found.add(Number(match[1]));
  }
  return [...found];
}

function warningsFor({ pr, linked, referenced, files, defaultBranch }) {
  const labels = new Set(pr.labels.map((label) => typeof label === 'string' ? label : label.name));
  const exempt = labels.has('no-issue-needed') || pr.user.login === 'dependabot[bot]' ||
    (files.length > 0 && files.every((file) => /^(docs\/|\.github\/.*\.md$)|\.md$/i.test(file.filename)));
  const warnings = [];
  if (!exempt && !linked.length && !referenced.length) warnings.push('No verified issue link in the PR description or Development links. Add a related issue, or a maintainer can apply no-issue-needed.');
  if (pr.base.ref !== defaultBranch && /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s*:?[ \t]+(?:#[0-9]|[\w.-]+\/[\w.-]+#|https:\/\/github\.com\/)/i.test(visibleBody(pr.body))) {
    warnings.push(`Closing keywords target ${pr.base.ref}, not the default branch ${defaultBranch}; verify the intended issue closure.`);
  }
  for (const issue of linked) {
    const id = `${issue.repository.nameWithOwner}#${issue.number}`;
    if (issue.labels.nodes.some((label) => label.name === 'epic')) warnings.push(`${id} is an epic. Confirm this PR completes the full parent scope; use a plain reference for partial delivery.`);
    if (issue.state === 'OPEN' && unchecked(issue.body)) warnings.push(`${id} has unchecked criteria. Reconcile the acceptance evidence or retain a separate open acceptance issue before merging a closing link.`);
  }
  return warnings;
}

async function check({ github, owner, repo, number }) {
  const { data: pr } = await github.rest.pulls.get({ owner, repo, pull_number: number });
  const { data: repository } = await github.rest.repos.get({ owner, repo });
  const files = await github.paginate(github.rest.pulls.listFiles, { owner, repo, pull_number: number, per_page: 100 });
  if (files.length !== pr.changed_files) throw new Error('Incomplete changed-file list');
  const data = await github.graphql(`query($owner:String!,$repo:String!,$number:Int!) {
    repository(owner:$owner,name:$repo) { pullRequest(number:$number) {
      closingIssuesReferences(first:100) { pageInfo { hasNextPage } nodes {
        number state body repository { nameWithOwner }
        labels(first:100) { nodes { name } pageInfo { hasNextPage } }
      } }
    } }
  }`, { owner, repo, number });
  const linked = nodes(data.repository.pullRequest.closingIssuesReferences, 'closing issue links');
  for (const issue of linked) nodes(issue.labels, 'linked issue labels');
  const refs = references(pr.body, owner, repo);
  if (refs.length > 100) throw new Error('Too many issue references to verify');
  const referenced = [];
  for (const issue_number of refs) {
    try {
      const { data: issue } = await github.rest.issues.get({ owner, repo, issue_number });
      if (!issue.pull_request) referenced.push(issue.number);
    } catch (error) { if (error.status !== 404) throw error; }
  }
  return { number, warnings: warningsFor({ pr, files, linked, referenced, defaultBranch: repository.default_branch }) };
}

module.exports = { references, warningsFor, check };
