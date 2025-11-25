import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import EventCard from '../components/EventCard';
import { eventService } from '../services/events';
import { Add as AddIcon } from '@mui/icons-material';

const Dashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventService.getMyEvents();
            
            // Handle different response structures
            const eventsList = response?.data || response?.events || [];
            
            const eventsData = (eventsList || []).slice(0, 3).map((event, index) => ({
                ...event,
                id: event._id || event.id || `event-${index}`,
                image: event.image || `https://images.unsplash.com/photo-${1540575467063 + index}?w=400`,
                isFavorite: false,
                isBookmarked: true,
                tags: event.tags || ['my-event'],
                rating: event.rating || 4.5,
                reviews: event.reviews || Math.floor(Math.random() * 500),
                attendees: event.attendees || Math.floor(Math.random() * 1000),
                organizer: event.organizer || {
                    name: user?.name || 'You',
                    avatar: 'https://i.pravatar.cc/28'
                },
                time: event.time || '09:00 AM',
                location: event.location || event.venue?.city || 'Location TBA'
            }));
            setEvents(eventsData);
        } catch (err) {
            console.error('Failed to fetch events:', err);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBookmark = (eventId) => {
        setEvents(prev => prev.map(e =>
            e.id === eventId ? { ...e, isBookmarked: !e.isBookmarked } : e
        ));
    };

    const handleRegister = (eventId) => {
        console.log('Registering for event:', eventId);
    };

    if (loading) {
        return <LoadingSpinner message="Loading your dashboard..." />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Welcome Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                    Welcome back, {user?.name}!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage your events and create new ones
                </Typography>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Events
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                {events.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Tickets Sold
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                0
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Revenue
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                $0
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Upcoming Events
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                {events.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Recent Events Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Your Recent Events
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        component={Link}
                        to="/create-event"
                    >
                        Create Event
                    </Button>
                </Box>
                
                {events.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        You haven't created any events yet. Create your first event to get started!
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {events.map((event, index) => (
                            <Grid item xs={12} sm={6} md={4} key={event.id}>
                                <EventCard
                                    event={event}
                                    onBookmark={handleBookmark}
                                    onRegister={handleRegister}
                                    index={index}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                    variant="outlined"
                    component={Link}
                    to="/my-events"
                >
                    View All Events
                </Button>
            </Box>
        </Container>
    );
};

export default Dashboard;