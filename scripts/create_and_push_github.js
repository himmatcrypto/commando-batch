/**
 * Automated script to create repo on GitHub under himmatcrypto and push code
 * Usage: node scripts/create_and_push_github.js <TOKEN>
 */

const https = require('https');
const path = require('path');
const fs = require('fs');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

const dir = path.join(__dirname, '..');
const USERNAME = 'himmatcrypto';
const REPO_NAME = 'commando-batch';

function apiRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
}

async function run() {
  const token = process.argv[2] ? process.argv[2].trim() : process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('Error: Please provide your GitHub Personal Access Token.');
    process.exit(1);
  }

  console.log(`[1/3] Creating repository "${REPO_NAME}" under user "${USERNAME}" on GitHub...`);

  const createOptions = {
    hostname: 'api.github.com',
    path: '/user/repos',
    method: 'POST',
    headers: {
      'User-Agent': 'NodeJS-Client',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    }
  };

  const createBody = {
    name: REPO_NAME,
    description: 'Commando Batch Defense & Competitive Exam Portal with 60 Full-Length CAPF Force-Wise CBT Mocks + 3 Free Common Mocks',
    private: false,
    auto_init: false
  };

  const createRes = await apiRequest(createOptions, createBody);

  if (createRes.status === 201) {
    console.log(`✓ Repository created successfully: ${createRes.body.html_url}`);
  } else if (createRes.status === 422) {
    console.log(`ℹ Repository "${REPO_NAME}" already exists, proceeding to push...`);
  } else {
    console.error(`Failed to create repository: HTTP ${createRes.status}`, createRes.body || createRes.raw);
    process.exit(1);
  }

  const repoUrl = `https://github.com/${USERNAME}/${REPO_NAME}.git`;
  console.log(`[2/3] Configuring Git remote origin: ${repoUrl}...`);

  try {
    const remotes = await git.listRemotes({ fs, dir });
    if (remotes.find(r => r.remote === 'origin')) {
      await git.deleteRemote({ fs, dir, remote: 'origin' });
    }
  } catch (e) {}

  await git.addRemote({ fs, dir, remote: 'origin', url: repoUrl });

  // Ensure 'main' branch exists
  try {
    await git.branch({ fs, dir, ref: 'main', checkout: true });
  } catch (e) {
    // If branch already exists, checkout
  }

  // Stage all modified/untracked files and commit
  console.log('Checking git status & staging modified/new files...');
  const statusMatrix = await git.statusMatrix({ fs, dir });
  let changesFound = false;
  for (const [filepath, head, worktree, stage] of statusMatrix) {
    if (worktree !== head || stage !== head) {
      if (worktree !== 0) {
        await git.add({ fs, dir, filepath });
        changesFound = true;
      } else {
        await git.remove({ fs, dir, filepath });
        changesFound = true;
      }
    }
  }

  if (changesFound) {
    console.log('Committing latest force pass condition updates...');
    const sha = await git.commit({
      fs,
      dir,
      author: {
        name: 'himmatcrypto',
        email: 'himmatcrypto@users.noreply.github.com'
      },
      message: 'feat: Add force selection in payment & lock/unlock condition for candidate target CAPF force'
    });
    console.log(`✓ Committed updates: ${sha}`);
  } else {
    console.log('Working directory is clean.');
  }

  console.log(`[3/3] Pushing all commits to https://github.com/${USERNAME}/${REPO_NAME}...`);

  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    force: true,
    onAuth: () => ({
      username: USERNAME,
      password: token
    })
  });

  console.log('\n======================================================');
  console.log(`🎉 SUCCESS! Project pushed live to:`);
  console.log(`👉 https://github.com/${USERNAME}/${REPO_NAME}`);
  console.log('======================================================\n');
}

run().catch(err => {
  console.error('Push error:', err.message);
  process.exit(1);
});
