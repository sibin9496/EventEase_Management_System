// Minimal test server
import express from 'express';

const app = express();

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/events', (req, res) => {
    res.json({ events: [], total: 0 });
});

const PORT = 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Keep the process alive
process.on('SIGINT', () => {
    console.log('Shutting down...');
    server.close(() => process.exit(0));
});
