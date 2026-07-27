const fs = require('fs');
const path = require('path');

const manifest = {
  'app-list': './app-list/remoteEntry.json',
  'app-workspace': './app-workspace/remoteEntry.json',
  'actor-app': './actor-app/remoteEntry.json',
  'app-edit': './app-edit/remoteEntry.json',
  'home-app': './home-app/remoteEntry.json',
  'app-parser': './app-parser/remoteEntry.json',
  'app-models': './app-models/remoteEntry.json',
};

const dest = 'dist/host-app/browser/federation.manifest.json';
fs.writeFileSync(dest, JSON.stringify(manifest));
console.log('Wrote federation manifest to', dest);
console.log(JSON.stringify(manifest, null, 2));
