/**
 * Push Commando Batch project to GitHub (main branch).
 * Usage:
 *   node scripts/push_to_github.js [<REPO_URL>] [<GITHUB_TOKEN>]
 * Reads token from arg -> process.env.GITHUB_TOKEN -> gitignored config/.github_token
 */

const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

const dir = path.join(__dirname, '..');
const DEFAULT_REPO = 'https://github.com/himmatcrypto/commando-batch.git';

function loadToken(argToken) {
  if (argToken) return argToken.trim();
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim();
  const tokFile = path.join(dir, 'config', '.github_token');
  if (fs.existsSync(tokFile)) {
    return fs.readFileSync(tokFile, 'utf8').trim();
  }
  return '';
}

async function pushToGithub() {
  const args = process.argv.slice(2);
  const repoUrl = args[0] || process.env.GITHUB_REPO_URL || DEFAULT_REPO;
  const token = loadToken(args[1]);

  if (!token) {
    console.error('Error: GitHub token required (pass arg, GITHUB_TOKEN env, or config/.github_token).');
    process.exit(1);
  }

  // Ensure origin remote matches repoUrl cleanly without embedding secrets in .git/config
  const remotes = await git.listRemotes({ fs, dir });
  const existing = remotes.find(r => r.remote === 'origin');
  if (!existing || existing.url !== repoUrl) {
    if (existing) await git.deleteRemote({ fs, dir, remote: 'origin' });
    await git.addRemote({ fs, dir, remote: 'origin', url: repoUrl });
  }

  console.log(`Pushing main branch to ${repoUrl}...`);
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({
      username: token,
      password: token
    })
  });

  console.log('Push completed successfully!', JSON.stringify(pushResult));
}

pushToGithub().catch(err => {
  console.error('Push failed:', err.message);
  process.exit(1);
});
