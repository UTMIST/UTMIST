const { BOT } = require('./automation-common.cjs');
const PROJECT = 'prj_L6wyTsPfqVyJGmheCUenmIutXtJz';
const TEAM = 'team_xAGWQZLeFUyvgLA8iOTNJFnu';
const ENVIRONMENT = 'Production';

function deploymentUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port ||
      !/^[a-z0-9-]+\.vercel\.app$/.test(url.hostname) ||
      url.pathname !== '/' || url.search || url.hash) return null;
    return url.origin;
  } catch { return null; }
}

function configured(deployment) {
  return deployment.creator?.login === BOT && deployment.environment === ENVIRONMENT &&
    deployment.payload?.source === 'utmist-vercel-ci-v1' &&
    deployment.payload.projectId === PROJECT && deployment.payload.teamId === TEAM;
}

async function start({ github, owner, repo, sha, runId, runAttempt }) {
  if (!/^[a-f0-9]{40}$/i.test(sha) || !Number.isSafeInteger(runId) || runId <= 0 ||
    !Number.isSafeInteger(runAttempt) || runAttempt <= 0) throw new Error('Invalid deployment identity');
  const { data } = await github.rest.repos.createDeployment({ owner, repo, ref: sha,
    auto_merge: false, required_contexts: [], environment: ENVIRONMENT,
    production_environment: true, transient_environment: false,
    description: 'Vercel production deployment attempt',
    payload: { source: 'utmist-vercel-ci-v1', projectId: PROJECT, teamId: TEAM, runId, runAttempt },
  });
  if (!data.id) throw new Error('GitHub did not create a deployment record');
  await github.rest.repos.createDeploymentStatus({ owner, repo, deployment_id: data.id,
    state: 'in_progress', auto_inactive: false,
    log_url: `https://github.com/${owner}/${repo}/actions/runs/${runId}/attempts/${runAttempt}`,
  });
  return data.id;
}

async function finish({ github, owner, repo, deploymentId, sha, runId, runAttempt,
  outcome, url, token, fetchImpl = fetch }) {
  const { data: deployment } = await github.rest.repos.getDeployment({ owner, repo, deployment_id: deploymentId });
  if (!configured(deployment) || deployment.sha !== sha || deployment.payload.runId !== runId ||
    deployment.payload.runAttempt !== runAttempt) throw new Error('Deployment identity mismatch');
  let verifiedUrl;
  let verificationFailed = false;
  if (outcome === 'success') {
    try {
      const safeUrl = deploymentUrl(url);
      if (!safeUrl || !token) throw new Error('Missing deployment URL or credential');
      // The CLI's exit code alone is insufficient. Verify this project's actual
      // READY production deployment, with explicit metadata for the deployed SHA.
      const response = await fetchImpl(`https://api.vercel.com/v13/deployments/${new URL(safeUrl).hostname}?teamId=${TEAM}`, {
        headers: { Authorization: `Bearer ${token}` }, redirect: 'error', signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error('Vercel inspection failed');
      const data = await response.json();
      const projectId = data.projectId ?? data.project?.id;
      if (projectId !== PROJECT || data.target !== 'production' || data.readyState !== 'READY' ||
        data.meta?.githubCommitSha !== sha || deploymentUrl(`https://${data.url}`) !== safeUrl) {
        throw new Error('Vercel evidence mismatch');
      }
      verifiedUrl = safeUrl;
    } catch {
      // Provider exceptions may contain request credentials; publish only a
      // fixed failure description, and leave detailed inspection to Vercel.
      verificationFailed = true;
    }
  }
  const state = verifiedUrl ? 'success' : verificationFailed ? 'error' : 'failure';
  await github.rest.repos.createDeploymentStatus({ owner, repo, deployment_id: deploymentId,
    state, auto_inactive: false,
    description: verifiedUrl ? 'Vercel confirms READY for this project and commit' : 'Deployment failed, cancelled, or could not be verified; inspect CI',
    log_url: `https://github.com/${owner}/${repo}/actions/runs/${runId}/attempts/${runAttempt}`,
    ...(verifiedUrl ? { environment_url: verifiedUrl } : {}),
  });
  if (verificationFailed) throw new Error('Could not verify Vercel production deployment identity and readiness');
  return { state };
}

module.exports = { PROJECT, TEAM, ENVIRONMENT, deploymentUrl, configured, start, finish };
