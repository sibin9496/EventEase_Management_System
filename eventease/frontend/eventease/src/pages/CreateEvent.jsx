import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextareaAutosize,
    Alert
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';

const CreateEvent = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Check if user has permission to create events
    if (user && user.role !== 'admin') {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <Paper elevation={2} sx={{ p: 4, backgroundColor: '#fef3c7' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#92400e' }}>
                        ⚠️ Access Denied
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#b45309' }}>
                        Only admins can create events.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: '#b45309' }}>
                        Your current role: <strong>{user.role}</strong>
                    </Typography>
                    <Button 
                        variant="contained"
                        onClick={() => navigate('/events')}
                    >
                        Browse Events Instead
                    </Button>
                </Paper>
            </Container>
        );
    }

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        type: '',
        date: '',
        time: '',
        location: '',
        price: '0',
        capacity: '50',
        image: ''
    });

    const categories = [
        'Technology', 'Business', 'Music', 'Arts', 'Sports',
        'Food & Drink', 'Education', 'Health', 'Other'
    ];

    const eventTypes = [
        'Conference', 'Workshop', 'Seminar', 'Networking',
        'Festival', 'Concert', 'Exhibition', 'Summit',
        'Bootcamp', 'Retreat', 'Sports', 'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.title.trim()) {
            setError('Event title is required');
            return;
        }
        if (!formData.description.trim()) {
            setError('Event description is required');
            return;
        }
        if (!formData.category) {
            setError('Please select a category');
            return;
        }
        if (!formData.type) {
            setError('Please select an event type');
            return;
        }
        if (!formData.date) {
            setError('Date is required');
            return;
        }
        if (!formData.time) {
            setError('Time is required');
            return;
        }
        if (!formData.location.trim()) {
            setError('Location is required');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const API_BASE = '/api';

            const response = await fetch(`${API_BASE}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    type: formData.type,
                    date: new Date(formData.date).toISOString(),
                    time: formData.time,
                    location: formData.location,
                    price: parseFloat(formData.price) || 0,
                    capacity: parseInt(formData.capacity) || 50,
                    image: formData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.errors?.[0]?.msg || data.message || 'Failed to create event';
                setError(errorMsg);
                return;
            }

            setSuccess('Event created successfully! Redirecting...');
            setTimeout(() => {
                navigate('/my-events');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Network error while creating event');
            console.error('Create event error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && success) {
        return <LoadingSpinner message="Creating your event..." />;
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    startIcon={<BackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ textTransform: 'none' }}
                >
                    Back
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Create New Event
                </Typography>
            </Box>

            {/* Form Paper */}
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Title */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Event Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter event title"
                                inputProps={{ maxLength: 100 }}
                                helperText={`${formData.title.length}/100`}
                                disabled={loading}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                                Description
                            </Typography>
                            <TextareaAutosize
                                minRows={4}
                                maxRows={6}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter event description"
                                maxLength={1000}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontFamily: 'Roboto, sans-serif',
                                    resize: 'vertical'
                                }}
                            />
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {formData.description.length}/1000 characters
                            </Typography>
                        </Grid>

                        {/* Category and Type */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    label="Category"
                                    disabled={loading}
                                >
                                    <MenuItem value="">Select Category</MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            {cat}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Event Type</InputLabel>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    label="Event Type"
                                    disabled={loading}
                                >
                                    <MenuItem value="">Select Type</MenuItem>
                                    {eventTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Date and Time */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                disabled={loading}
                                inputProps={{
                                    min: new Date().toISOString().split('T')[0]
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Time"
                                name="time"
                                type="time"
                                value={formData.time}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                disabled={loading}
                            />
                        </Grid>

                        {/* Location */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter event location (e.g., City, Venue)"
                                disabled={loading}
                            />
                        </Grid>

                        {/* Price and Capacity */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Price (₹)"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                inputProps={{ min: '0', step: '100' }}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Capacity"
                                name="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={handleChange}
                                inputProps={{ min: '1' }}
                                disabled={loading}
                            />
                        </Grid>

                        {/* Image URL */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Image URL (Optional)"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                disabled={loading}
                                helperText="Leave empty for default image"
                            />
                        </Grid>

                        {/* Action Buttons */}
                        <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Event'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Helper Info */}
            <Paper sx={{ p: 3, mt: 4, backgroundColor: '#f8fafc', borderLeft: '4px solid #2563eb' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    ℹ️ Tips for Creating a Great Event
                </Typography>
                <ul style={{ margin: '0', paddingLeft: '20px', color: '#64748b' }}>
                    <li>Use a clear and descriptive title</li>
                    <li>Write a detailed description to attract attendees</li>
                    <li>Choose the right category and event type</li>
                    <li>Set an appropriate price (₹0 for free events)</li>
                    <li>Set realistic capacity based on venue</li>
                    <li>Add a high-quality event image</li>
                </ul>
            </Paper>
        </Container>
    );
};

export default CreateEvent;