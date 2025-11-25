import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Button,
    Chip,
    Badge,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Divider,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    CalendarToday,
    LocationOn,
    Person,
    Email,
    Phone,
    BusinessCenter,
    Delete as DeleteIcon,
    EventAvailable,
    Info as InfoIcon
} from '@mui/icons-material';
import { registrationService } from '../services/registration';
import { eventService } from '../services/events';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import EmptyState from '../components/UI/EmptyState';
import RegistrationDetailModal from '../components/RegistrationDetailModal';

const MyRegistrations = () => {
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [events, setEvents] = useState({});

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const response = await registrationService.getUserRegistrations();
            const regsData = response?.data || response?.registrations || [];
            const regsArray = Array.isArray(regsData) ? regsData : [];
            setRegistrations(regsArray);

            // Fetch event details for each registration
            const eventData = {};
            for (const reg of regsArray) {
                if (reg.eventId && !eventData[reg.eventId]) {
                    try {
                        const eventResponse = await eventService.getEvent(reg.eventId);
                        const event = eventResponse?.data || eventResponse;
                        // Ensure the event has an id field
                        if (event) {
                            event.id = event._id || event.id || reg.eventId;
                        }
                        eventData[reg.eventId] = event;
                    } catch (err) {
                        console.error(`Error fetching event ${reg.eventId}:`, err);
                        eventData[reg.eventId] = null;
                    }
                }
            }
            setEvents(eventData);
        } catch (err) {
            setError('Failed to load your registrations');
            console.error('Error fetching registrations:', err);
            setRegistrations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (registration, eventDetails) => {
        setSelectedRegistration(registration);
        setSelectedEvent(eventDetails);
        setShowDetailModal(true);
    };

    const handleCancelRegistration = async () => {
        if (!deleteConfirm) return;

        try {
            setDeleting(true);
            await registrationService.cancelRegistration(deleteConfirm);
            setRegistrations(prev => prev.filter(reg => reg._id !== deleteConfirm));
            setDeleteConfirm(null);
        } catch (err) {
            setError('Failed to cancel registration');
            console.error('Error canceling registration:', err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading your registrations..." />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '20px', sm: '24px', md: '28px' } }}>
                    My Event Registrations
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '12px', sm: '13px' } }}>
                    View and manage all your event registrations
                </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Empty State */}
            {registrations.length === 0 ? (
                <EmptyState
                    title="No Registrations Yet"
                    description="You haven't registered for any events. Explore our events and register now!"
                    actionText="Browse Events"
                    onAction={() => navigate('/events')}
                />
            ) : (
                <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                    {registrations.map((registration) => {
                        const eventDetails = events[registration.eventId];
                        return (
                            <Grid item xs={12} sm={6} md={4} key={registration._id}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 2,
                                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid',
                                    borderColor: 'grey.100',
                                    transition: 'all 0.3s ease-in-out',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                                        transform: 'translateY(-6px)',
                                        borderColor: 'primary.main',
                                    }
                                }}>
                                    {/* Event Image */}
                                    {eventDetails?.image && (
                                        <Box
                                            component="img"
                                            src={eventDetails.image}
                                            sx={{
                                                width: '100%',
                                                height: { xs: 140, sm: 160, md: 180 },
                                                objectFit: 'cover',
                                                borderRadius: '8px 8px 0 0'
                                            }}
                                        />
                                    )}

                                    <CardContent sx={{ flexGrow: 1, pb: 2 }}>
                                        {/* Status Badge and Ticket Type */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                            <Chip
                                                icon={<EventAvailable />}
                                                label="Registered"
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                            />
                                            <Chip 
                                                label={registration.ticketType || 'standard'} 
                                                size="small"
                                                color="primary"
                                                variant="filled"
                                            />
                                        </Box>

                                        {/* Event Title - PROMINENT */}
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1e293b', fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' } }}>
                                            {registration.eventTitle || eventDetails?.title || 'Event Name'}
                                        </Typography>

                                        {/* Registered User Name - PROMINENT */}
                                        <Box sx={{ mb: 2, p: 1.5, background: '#eff6ff', borderRadius: 1, borderLeft: '4px solid #2563eb' }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                                👤 Registered As
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', mt: 0.5 }}>
                                                {registration.fullName}
                                            </Typography>
                                        </Box>

                                        {/* Quick Event Details */}
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                                📅 Event Details
                                            </Typography>
                                            <Stack spacing={0.8} sx={{ mt: 0.8 }}>
                                                {/* Date */}
                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <CalendarToday sx={{ fontSize: 14, color: '#2563eb', flexShrink: 0 }} />
                                                    <Typography variant="body2" sx={{ color: '#1e293b' }}>
                                                        {eventDetails?.date ? new Date(eventDetails.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : eventDetails?.startDate ? new Date(eventDetails.startDate).toLocaleDateString() : 'Date TBA'}
                                                    </Typography>
                                                </Box>

                                                {/* Time */}
                                                {eventDetails?.time && (
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        <Typography variant="caption" sx={{ fontSize: '12px', color: '#2563eb' }}>⏰</Typography>
                                                        <Typography variant="body2" sx={{ color: '#1e293b', fontSize: '0.9rem' }}>
                                                            {eventDetails.time}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {/* Location */}
                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <LocationOn sx={{ fontSize: 14, color: '#2563eb', flexShrink: 0 }} />
                                                    <Typography variant="body2" sx={{ color: '#1e293b' }}>
                                                        {eventDetails?.location || eventDetails?.venue?.city || 'Location TBA'}
                                                    </Typography>
                                                </Box>

                                                {/* Price */}
                                                {(eventDetails?.price || registration.totalPrice) && (
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        <Typography variant="caption" sx={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>💰</Typography>
                                                        <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                                                            ₹{registration.totalPrice || eventDetails?.price}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Stack>
                                        </Box>

                                        {/* Contact Info */}
                                        <Box sx={{ background: '#f8fafc', p: 1.5, borderRadius: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                                📧 Contact
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#1e293b', mt: 0.5, wordBreak: 'break-all', fontSize: '0.9rem' }}>
                                                {registration.email}
                                            </Typography>
                                        </Box>
                                    </CardContent>

                                    <CardActions sx={{ p: 2, pt: 1, gap: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Button
                                            fullWidth
                                            size="medium"
                                            startIcon={<InfoIcon />}
                                            onClick={() => handleViewDetails(registration, eventDetails)}
                                            variant="contained"
                                            sx={{ 
                                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                                fontWeight: 600,
                                                textTransform: 'none'
                                            }}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            fullWidth
                                            size="medium"
                                            color="error"
                                            variant="outlined"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => setDeleteConfirm(registration._id)}
                                            sx={{ fontWeight: 600, textTransform: 'none' }}
                                        >
                                            Cancel Registration
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Registration Detail Modal */}
            <RegistrationDetailModal
                open={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedRegistration(null);
                    setSelectedEvent(null);
                }}
                registration={selectedRegistration}
                event={selectedEvent}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onClose={() => !deleting && setDeleteConfirm(null)} disableEnforceFocus>
                <DialogTitle>Cancel Registration?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to cancel this registration? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm(null)} disabled={deleting}>
                        Keep Registration
                    </Button>
                    <Button
                        onClick={handleCancelRegistration}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                    >
                        {deleting ? 'Canceling...' : 'Yes, Cancel'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyRegistrations;
