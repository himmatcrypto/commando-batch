const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');

const dir = path.join(__dirname, '..');

async function main() {
  console.log('Initializing Git repository in:', dir);
  await git.init({ fs, dir });
  console.log('Git repository initialized successfully!');

  // Check status matrix
  console.log('Scanning working directory files...');
  const statusMatrix = await git.statusMatrix({ fs, dir });

  console.log(`Found ${statusMatrix.length} total files.`);

  // Stage all untracked or modified files
  for (const [filepath, head, worktree, stage] of statusMatrix) {
    if (worktree !== 0) {
      await git.add({ fs, dir, filepath });
    }
  }
  console.log('All project files staged successfully!');

  // Commit
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Commando Batch Admin',
      email: 'admin@commandobatch.gov.in'
    },
    message: 'Initial Commit: Commando Batch Defense & Competitive Exam Portal with 30 Full-Length CAPF Force-Wise CBT Mocks'
  });

  console.log('Committed successfully with SHA:', sha);
}

main().catch(err => {
  console.error('Git error:', err);
  process.exit(1);
});
