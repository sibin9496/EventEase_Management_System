import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

console.log(`Starting frontend server...`);
console.log(`PORT: ${PORT}`);
console.log(`__dirname: ${__dirname}`);
console.log(`dist path: ${path.join(__dirname, 'dist')}`);

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d',
  etag: false
}));

// SPA fallback - serve index.html for all non-file routes
app.get('*', (req, res) => {
  console.log(`Received request: ${req.method} ${req.path}`);
  
  // Don't redirect API or file requests
  if (req.path.startsWith('/api') || req.path.match(/\.\w+$/)) {
    console.log(`Not found (file or API): ${req.path}`);
    return res.status(404).send('Not Found');
  }
  
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  console.log(`Serving index.html from: ${indexPath}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`Error serving index.html:`, err);
      res.status(500).send('Server Error');
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Frontend server running on port ${PORT}`);
});
