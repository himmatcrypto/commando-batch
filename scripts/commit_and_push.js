/**
 * Stages all non-ignored modified/new files (never secrets/runtime caches),
 * commits to main, and pushes to GitHub (triggering automatic Firestore & Firebase deploy).
 * Usage: node scripts/commit_and_push.js ["Commit message"]
 */

const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

const dir = path.join(__dirname, '..');
const DEFAULT_REPO = 'https://github.com/himmatcrypto/commando-batch.git';

function loadToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim();
  const tokFile = path.join(dir, 'config', '.github_token');
  if (fs.existsSync(tokFile)) return fs.readFileSync(tokFile, 'utf8').trim();
  return '';
}

async function run() {
  const msg = process.argv[2] || `chore: update portal (${new Date().toISOString()})`;
  const token = loadToken();
  if (!token) throw new Error('Missing GitHub token (set GITHUB_TOKEN or config/.github_token)');

  const forbiddenPrefixes = [
    'firebase-service-account.json',
    'config/',
    'functions/config/',
    'functions/backend/',
    'functions/data/',
    'functions/node_modules/',
    'node_modules/',
    '.firebase/'
  ];

  const matrix = await git.statusMatrix({ fs, dir });
  let count = 0;
  for (const [filepath, head, worktree, stage] of matrix) {
    if (forbiddenPrefixes.some(p => filepath === p || filepath.startsWith(p))) continue;
    const ignored = await git.isIgnored({ fs, dir, filepath });
    if (ignored) continue;
    if (worktree === 0 && head !== 0) {
      await git.remove({ fs, dir, filepath });
      count++;
    } else if (head !== worktree || head !== stage) {
      await git.add({ fs, dir, filepath });
      count++;
    }
  }

  if (count > 0) {
    const sha = await git.commit({
      fs,
      dir,
      author: { name: 'Commando Batch Admin', email: 'himmatcrypto@users.noreply.github.com' },
      message: msg
    });
    console.log(`Committed ${count} file(s) -> ${sha}`);
  } else {
    console.log('Working tree clean; pushing existing commits on main...');
  }

  const pushRes = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    url: DEFAULT_REPO,
    onAuth: () => ({ username: token, password: token })
  });
  console.log('✓ Pushed to GitHub main:', JSON.stringify(pushRes));
}

run().catch(err => {
  console.error('Publish failed:', err.message);
  process.exit(1);
});
