/**
 * Script to push the Commando Batch project to GitHub
 * Usage: node scripts/push_to_github.js <REPO_URL> <GITHUB_TOKEN_OR_PAT>
 */

const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

const dir = path.join(__dirname, '..');

async function pushToGithub() {
  const args = process.argv.slice(2);
  const repoUrl = args[0] || process.env.GITHUB_REPO_URL;
  const token = args[1] || process.env.GITHUB_TOKEN;

  if (!repoUrl) {
    console.error('Error: Please provide your GitHub repository URL.');
    console.log('Example: node scripts/push_to_github.js https://github.com/username/commando-batch.git <TOKEN>');
    process.exit(1);
  }

  console.log(`Setting remote origin: ${repoUrl}`);

  // Set remote origin
  try {
    const remotes = await git.listRemotes({ fs, dir });
    if (remotes.find(r => r.remote === 'origin')) {
      await git.deleteRemote({ fs, dir, remote: 'origin' });
    }
  } catch (e) {}

  await git.addRemote({ fs, dir, remote: 'origin', url: repoUrl });

  console.log('Pushing to GitHub (main branch)...');

  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    force: true,
    onAuth: () => {
      return {
        username: token || 'git',
        password: token || ''
      };
    }
  });

  console.log('Push completed successfully!', pushResult);
}

pushToGithub().catch(err => {
  console.error('Push failed:', err.message);
  process.exit(1);
});
