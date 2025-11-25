import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import EmptyState from '../components/UI/EmptyState';
import { eventService } from '../services/events';
import { useAuth } from '../context/AuthContext';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            const response = await eventService.getMyEvents();
            
            // Handle different response structures
            const eventsList = response?.data || response?.events || [];
            
            const eventsData = eventsList.map((event, index) => ({
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
            console.error('Failed to fetch my events:', err);
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
        return <LoadingSpinner message="Loading your events..." />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                    My Events
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage your created and registered events
                </Typography>
            </Box>

            {events.length === 0 ? (
                <EmptyState
                    title="No Events Yet"
                    description="You haven't created or registered for any events yet."
                    actionText="Browse Events"
                />
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
        </Container>
    );
};

export default MyEvents;