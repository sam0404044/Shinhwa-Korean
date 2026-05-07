const { spawn, spawnSync } = require('child_process');
const path = require('path');

function hasNonAscii(input) {
  return /[^\x00-\x7F]/.test(input);
}

function tryDrive(letter, target) {
  spawnSync('subst', [`${letter}:`, '/D'], { stdio: 'ignore', shell: true });
  const result = spawnSync('subst', [`${letter}:`, target], {
    stdio: 'ignore',
    shell: true,
  });
  return result.status === 0;
}

function findAsciiWorkspaceDir(cwd) {
  const projectRoot = path.resolve(cwd, '..');
  const workspaceRoot = path.resolve(projectRoot, '..');
  const relativeProject = path.relative(workspaceRoot, cwd);

  for (const letter of ['X', 'Y', 'Z', 'W', 'V']) {
    if (tryDrive(letter, workspaceRoot)) {
      return `${letter}:\\${relativeProject}`;
    }
  }

  return null;
}

const cwd = process.cwd();
const devCwd = hasNonAscii(cwd) ? findAsciiWorkspaceDir(cwd) : cwd;

if (!devCwd) {
  console.error('Unable to create an ASCII-safe path for Next.js dev server.');
  process.exit(1);
}

const child = spawn('npm.cmd', ['run', 'dev:direct'], {
  cwd: devCwd,
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
