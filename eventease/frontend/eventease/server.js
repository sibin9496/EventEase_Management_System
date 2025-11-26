import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log(`\n=== Frontend Server Starting ===`);
console.log(`PORT: ${PORT}`);
console.log(`DIST_PATH: ${distPath}`);
console.log(`INDEX_PATH: ${indexPath}`);
console.log(`DIST exists: ${fs.existsSync(distPath)}`);
console.log(`INDEX.html exists: ${fs.existsSync(indexPath)}`);
console.log(`============================\n`);

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Serve static files from dist folder
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-file routes
app.get('*', (req, res) => {
  // Don't redirect file requests (they should 404)
  if (req.path.match(/\.\w+$/) || req.path.startsWith('/api')) {
    console.log(`→ 404 (file or API route)`);
    return res.status(404).send('Not Found');
  }
  
  console.log(`→ Serving index.html`);
  res.sendFile(indexPath);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`Error:`, err);
  res.status(500).send('Server Error');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend server listening on port ${PORT}`);
});
