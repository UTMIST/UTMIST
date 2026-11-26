const { BOT, text, nodes, managedComment } = require('./automation-common.cjs');
const { ENVIRONMENT, configured, deploymentUrl } = require('./vercel-deployment.cjs');

async function evidence({ github, owner, repo, runId, dryRun = true }) {
  if (!Number.isSafeInteger(runId) || runId <= 0) throw new Error('Invalid CI run ID');
  const { data: run } = await github.rest.actions.getWorkflowRun({ owner, repo, run_id: runId });
  const fullName = `${owner}/${repo}`;
  if (run.path !== '.github/workflows/ci.yml' || run.event !== 'push' || run.head_branch !== 'main' ||
    run.head_repository?.full_name !== fullName || run.status !== 'completed') {
    return { skipped: 'Not a completed main CI push', comments: [] };
  }
  const deployments = await github.paginate(github.rest.repos.listDeployments, {
    owner, repo, sha: run.head_sha, environment: ENVIRONMENT, per_page: 100,
  });
  const matches = deployments.filter((d) => configured(d) && d.sha === run.head_sha &&
    d.payload.runId === runId && d.payload.runAttempt === run.run_attempt);
  if (!matches.length) return { skipped: 'No recorded production deployment attempt for this CI run', comments: [] };
  if (matches.length > 1) throw new Error('Duplicate deployment records for this CI attempt');
  const deployment = matches[0];
  const statuses = await github.paginate(github.rest.repos.listDeploymentStatuses, {
    owner, repo, deployment_id: deployment.id, per_page: 100,
  });
  const latest = [...statuses].sort((a, b) => b.id - a.id)[0];
  if (!latest || latest.creator?.login !== BOT || latest.state === 'inactive') {
    return { skipped: 'No current trusted deployment status', comments: [] };
  }
  const logUrl = `https://github.com/${owner}/${repo}/actions/runs/${runId}/attempts/${run.run_attempt}`;
  if (latest.log_url !== logUrl || !Number.isFinite(Date.parse(latest.created_at))) throw new Error('Invalid deployment provenance');
  const url = deploymentUrl(latest.environment_url);
  if (latest.state === 'success' && !url) throw new Error('Successful deployment has no verified Vercel URL');
  const associated = await github.paginate(github.rest.repos.listPullRequestsAssociatedWithCommit, {
    owner, repo, commit_sha: deployment.sha, per_page: 100,
  });
  const targets = new Set();
  for (const candidate of associated) {
    const { data: pr } = await github.rest.pulls.get({ owner, repo, pull_number: candidate.number });
    if (!pr.merged_at || pr.merge_commit_sha !== deployment.sha || pr.base.ref !== 'main') continue;
    targets.add(pr.number);
    const data = await github.graphql(`query($owner:String!,$repo:String!,$number:Int!) {
      repository(owner:$owner,name:$repo) { pullRequest(number:$number) {
        closingIssuesReferences(first:100) { pageInfo { hasNextPage } nodes {
          number repository { nameWithOwner }
        } }
      } }
    }`, { owner, repo, number: pr.number });
    for (const issue of nodes(data.repository.pullRequest.closingIssuesReferences, 'deployment issue links')) {
      if (issue.repository.nameWithOwner.toLowerCase() === fullName.toLowerCase()) targets.add(issue.number);
    }
  }
  const body = `### Deployment evidence\n\n**Vercel production: ${text(latest.state)}** at ${text(latest.created_at)}.\n\n` +
    `Commit [${deployment.sha.slice(0, 12)}](https://github.com/${owner}/${repo}/commit/${deployment.sha}) · [Deployment job](${logUrl}) · GitHub deployment ${deployment.id}.\n\n` +
    (latest.state === 'success' ? `[Verified READY deployment](${url}).\n\n` : 'Production readiness was not confirmed by this observation.\n\n') +
    'This records deployment status, not end-to-end acceptance or a guarantee that this version is still serving. Only the exact merged PR and its explicit closing issues receive this evidence.';
  const comments = [];
  for (const number of targets) comments.push(await managedComment({ github, owner, repo, number,
    key: `deployment:${deployment.id}`, body, dryRun }));
  return { deploymentId: deployment.id, state: latest.state, comments };
}

module.exports = { evidence };
