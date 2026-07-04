const { execSync } = require('child_process');
const pkg = require('./package.json');
const queue = Object.entries({ ...pkg.dependencies, ...pkg.devDependencies }).map(([name, version]) => ({ name, version }));
const seen = new Set();
const found = [];
const maxPackages = 2000;

function getManifest(name, version) {
  try {
    const out = execSync(`npm view ${name}@${version} --json`, { encoding: 'utf8' });
    return JSON.parse(out);
  } catch (err) {
    console.error(`ERR ${name}@${version}: ${err.message}`);
    return null;
  }
}

function processDeps(deps, parent) {
  if (!deps) return [];
  return Object.entries(deps).map(([name, version]) => ({ name, version, parent }));
}

while (queue.length && seen.size < maxPackages) {
  const { name, version, parent } = queue.shift();
  const key = `${name}@${version}`;
  if (seen.has(key)) continue;
  seen.add(key);

  const manifest = getManifest(name, version);
  if (!manifest) continue;

  const allDeps = {
    dependencies: manifest.dependencies,
    devDependencies: manifest.devDependencies,
    peerDependencies: manifest.peerDependencies,
    optionalDependencies: manifest.optionalDependencies,
  };

  for (const [field, deps] of Object.entries(allDeps)) {
    if (!deps) continue;
    for (const [depName, depVersion] of Object.entries(deps)) {
      if (depVersion && depVersion.includes('workspace:')) {
        found.push({ package: key, field, depName, depVersion, parent });
        console.log(`FOUND ${key} -> ${field} ${depName}: ${depVersion}`);
      }
      if (!seen.has(`${depName}@${depVersion}`) && queue.length < maxPackages) {
        queue.push({ name: depName, version: depVersion, parent: key });
      }
    }
  }
}

if (found.length === 0) {
  console.log('No workspace:* references found in metadata scan.');
} else {
  console.log('\nSUMMARY:');
  found.forEach((item) => console.log(JSON.stringify(item)));
}
