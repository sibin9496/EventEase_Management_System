import express from 'express';

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/events', (req, res) => {
    res.json({ data: [], total: 0 });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on ${PORT}`);
    // Keep process from exiting
    process.exit = () => {}; // Override process.exit
});

// Prevent Node from exiting
process.on('exit', () => {});
setInterval(() => {}, 1000000);
