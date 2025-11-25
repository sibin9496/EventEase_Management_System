import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

// Sample data - replace with database calls
const popularLocations = [
    { id: 1, name: 'Mumbai', state: 'MH', country: 'India', type: 'city' },
    { id: 2, name: 'Delhi', state: 'DL', country: 'India', type: 'city' },
    { id: 3, name: 'Bangalore', state: 'KA', country: 'India', type: 'city' },
    { id: 4, name: 'Hyderabad', state: 'TS', country: 'India', type: 'city' },
    { id: 5, name: 'Chennai', state: 'TN', country: 'India', type: 'city' },
    { id: 6, name: 'Kolkata', state: 'WB', country: 'India', type: 'city' },
    { id: 7, name: 'Pune', state: 'MH', country: 'India', type: 'city' },
    { id: 8, name: 'Ahmedabad', state: 'GJ', country: 'India', type: 'city' },
    { id: 9, name: 'New York', state: 'NY', country: 'USA', type: 'city' },
    { id: 10, name: 'Los Angeles', state: 'CA', country: 'USA', type: 'city' },
    { id: 11, name: 'Chicago', state: 'IL', country: 'USA', type: 'city' },
    { id: 12, name: 'Houston', state: 'TX', country: 'USA', type: 'city' },
];

// Get popular locations
router.get('/popular', (req, res) => {
    try {
        res.json({
            status: 'success',
            data: popularLocations,
            total: popularLocations.length
        });
    } catch (error) {
        console.error('❌ Error fetching popular locations:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// Search locations
router.get('/search', (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.json({
                status: 'success',
                data: [],
                total: 0
            });
        }

        const results = popularLocations.filter(location =>
            location.name.toLowerCase().includes(q.toLowerCase()) ||
            location.state.toLowerCase().includes(q.toLowerCase())
        );

        res.json({
            status: 'success',
            data: results,
            total: results.length
        });
    } catch (error) {
        console.error('❌ Error searching locations:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// Get all locations (for navigation/filtering)
router.get('/', (req, res) => {
    try {
        res.json({
            status: 'success',
            data: popularLocations,
            total: popularLocations.length
        });
    } catch (error) {
        console.error('❌ Error fetching locations:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// Save user location (protected)
router.post('/save', auth, async (req, res) => {
    try {
        // Here you would save to database
        // const { name, state, country, latitude, longitude } = req.body;
        
        // Example: Save to user profile in database
        // await User.findByIdAndUpdate(req.user.id, {
        //     location: { name, state, country, latitude, longitude }
        // });

        res.json({ 
            status: 'success',
            message: 'Location saved successfully' 
        });
    } catch (error) {
        console.error('❌ Error saving location:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// Get user's saved location (protected)
router.get('/user', auth, async (req, res) => {
    try {
        // Get from database
        // const user = await User.findById(req.user.id).select('location');
        // res.json(user.location);

        // Temporary response
        res.json({
            status: 'success',
            data: null,
            message: 'No saved location'
        });
    } catch (error) {
        console.error('❌ Error fetching user location:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

export default router;