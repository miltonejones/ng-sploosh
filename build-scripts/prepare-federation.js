const fs = require('fs');
const path = require('path');

// Script to prepare federation configuration for static hosting
const prepareFederation = () => {
  const distPath = path.join(process.cwd(), 'dist');
  const manifestPath = path.join(distPath, 'host-app', 'federation.manifest.json');

  if (!fs.existsSync(manifestPath)) {
    console.error('Federation manifest not found. Build first!');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  // Transform manifest for static hosting
  // This will be updated with actual URLs during deployment
  const staticManifest = {};
  for (const [key, value] of Object.entries(manifest)) {
    // Keep relative paths - will be replaced by CDN URLs in deploy script
    staticManifest[key] = value;
  }

  fs.writeFileSync(manifestPath, JSON.stringify(staticManifest, null, 2));
  console.log('Federation manifest prepared for static hosting');
};

prepareFederation();
