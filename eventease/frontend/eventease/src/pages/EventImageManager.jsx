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
    CardActions,
    Grid,
    Typography,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageUploader from '../components/ImageUploader';
import api from '../config/api';

const EventImageManager = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [imageUploader, setImageUploader] = useState({ open: false, eventId: null, eventTitle: '', currentImage: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, eventId: null });

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            console.log('Fetching my events...');
            const response = await api.get('/events/user/my-events');
            console.log('Events response:', response.data);
            setEvents(response.data.data || response.data.events || []);
            setError('');
        } catch (err) {
            console.error('Error fetching events:', err);
            if (err.response?.status === 401) {
                setError('Please log in to manage event images');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to load your events. ' + (err.message || ''));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenImageUploader = (event) => {
        setImageUploader({
            open: true,
            eventId: event._id,
            eventTitle: event.title,
            currentImage: event.image
        });
    };

    const handleCloseImageUploader = () => {
        setImageUploader({ open: false, eventId: null, eventTitle: '', currentImage: '' });
    };

    const handleSaveImage = async (imageUrl) => {
        try {
            const response = await api.put(`/events/${imageUploader.eventId}/image`, {
                imageUrl: imageUrl
            });

            const updatedEvent = response.data.event;
            setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));

            setSuccessMessage('Event image updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to update image');
        }
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    📸 Event Image Manager
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
                    Manage and update images for all your events
                </Typography>

                <TextField
                    fullWidth
                    placeholder="Search events by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="outlined"
                    size="small"
                />
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {error}
                    </Typography>
                    {error.includes('log in') && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            You need to be logged in and be an event organizer to manage event images.
                        </Typography>
                    )}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            )}

            {filteredEvents.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        {searchTerm ? 'No events found matching your search' : 'You haven\'t created any events yet'}
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {filteredEvents.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image={event.image}
                                    alt={event.title}
                                    sx={{ objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop';
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        {event.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        Category: {event.category}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        Location: {event.location}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Date: {new Date(event.date).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleOpenImageUploader(event)}
                                        sx={{ flex: 1 }}
                                    >
                                        Change Image
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <ImageUploader
                open={imageUploader.open}
                onClose={handleCloseImageUploader}
                onSave={handleSaveImage}
                currentImage={imageUploader.currentImage}
                eventTitle={imageUploader.eventTitle}
            />
        </Container>
    );
};

export default EventImageManager;
