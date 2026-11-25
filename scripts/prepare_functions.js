const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const fnDir = path.join(rootDir, 'functions');
const backendDest = path.join(fnDir, 'backend');
const dataDest = path.join(fnDir, 'data');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(path.join(rootDir, 'server'), backendDest);
copyDir(path.join(rootDir, 'data'), dataDest);
console.log('✓ Synced server/ and data/ into functions/ for Firebase Cloud Functions deployment.');
