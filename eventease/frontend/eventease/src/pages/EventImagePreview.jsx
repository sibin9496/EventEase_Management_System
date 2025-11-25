import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Box,
    TextField,
    Button,
    Card,
    CardMedia,
    CardContent,
    Grid,
    Typography,
    CircularProgress,
    Alert,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import api from '../config/api';

const EventImagePreview = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchAllEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [events, searchTerm, categoryFilter]);

    const fetchAllEvents = async () => {
        try {
            setLoading(true);
            console.log('Fetching all events...');
            const response = await api.get('/events?limit=500');
            console.log('Events response:', response.data);
            
            const eventsList = response.data.data || [];
            setEvents(eventsList);
            
            // Extract unique categories
            const uniqueCategories = [...new Set(eventsList.map(e => e.category))].sort();
            setCategories(uniqueCategories);
            
            setError('');
        } catch (err) {
            console.error('Error fetching events:', err);
            setError(`Failed to load events: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const filterEvents = () => {
        let filtered = events;

        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(event => event.category === categoryFilter);
        }

        setFilteredEvents(filtered);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Loading events...</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    🖼️ Event Image Gallery
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
                    Browse and preview all event images in the system. Total: {events.length} events
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <FormControl size="small" fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            label="Category"
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Typography variant="body2" color="textSecondary">
                    Showing {filteredEvents.length} of {events.length} events
                </Typography>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {filteredEvents.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        {searchTerm || categoryFilter ? 'No events found matching your filters' : 'No events available'}
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {filteredEvents.map((event) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={event._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={event.image}
                                    alt={event.title}
                                    sx={{ objectFit: 'cover', backgroundColor: '#f5f5f5' }}
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop';
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {event.title}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                                        📍 {event.location}
                                    </Typography>
                                    <Box sx={{ mb: 1 }}>
                                        <Chip
                                            label={event.category}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            sx={{ mr: 0.5 }}
                                        />
                                        {event.type && (
                                            <Chip
                                                label={event.type}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                        )}
                                    </Box>
                                    <Typography variant="caption" color="textSecondary" display="block">
                                        📅 {new Date(event.date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" display="block">
                                        💰 {event.price === 0 ? 'Free' : `₹${event.price}`}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" display="block">
                                        👥 {event.capacity} capacity
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default EventImagePreview;
