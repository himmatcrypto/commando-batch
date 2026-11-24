const { execSync } = require('child_process');
const fs = require('fs');

const psCmd = 'Compress-Archive -Path public, server, data, scripts, package.json, .gitignore, README.md -DestinationPath "C:\\Users\\HP\\commando-batch-github-ready.zip" -Force';
fs.writeFileSync('scripts/run_zip.ps1', psCmd);

try {
  execSync('powershell -ExecutionPolicy Bypass -File scripts/run_zip.ps1', { stdio: 'inherit' });
  const stat = fs.statSync('C:\\Users\\HP\\commando-batch-github-ready.zip');
  console.log('Zip file created successfully at C:\\Users\\HP\\commando-batch-github-ready.zip (' + (stat.size / (1024 * 1024)).toFixed(2) + ' MB)');
} catch (e) {
  console.error('Error:', e.message);
}
