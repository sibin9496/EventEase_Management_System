import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

console.log('1️⃣ Express initialized');

app.use(cors());
console.log('2️⃣ CORS configured');

app.use(express.json());
console.log('3️⃣ JSON middleware added');

// Test route
app.get('/api/health', (req, res) => {
    res.json({ message: 'OK' });
});

console.log('4️⃣ Health route added');

// Try to import and register routes one by one
try {
    console.log('5️⃣ Importing users route...');
    import('./routes/users.js').then(mod => {
        console.log('✅ Users route imported');
        app.use('/api/users', mod.default);
        console.log('✅ Users route registered');
    }).catch(err => {
        console.error('❌ Error importing users route:', err.message);
    });
} catch (err) {
    console.error('❌ Error with users route:', err.message);
}

const PORT = 5000;

setTimeout(() => {
    app.listen(PORT, () => {
        console.log(`✨ Server running on port ${PORT}`);
    });
}, 1000);
