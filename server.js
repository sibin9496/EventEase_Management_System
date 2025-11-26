// Entry point for Render deployment
import('./eventease/backend/server.js').catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
