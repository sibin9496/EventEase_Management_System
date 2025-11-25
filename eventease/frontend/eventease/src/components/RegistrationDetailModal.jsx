import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Divider,
    Grid,
    Chip,
    Button,
    Card,
    CardContent,
    Stack
} from '@mui/material';
import {
    CalendarToday,
    LocationOn,
    Person,
    Email,
    Phone,
    BusinessCenter,
    AccessTime,
    People,
    AttachMoney
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const RegistrationDetailModal = ({ open, onClose, registration, event }) => {
    const navigate = useNavigate();

    // Allow modal to open even if event details aren't fully loaded
    if (!registration) return null;

    const handleViewFullEvent = () => {
        if (event && (event._id || event.id)) {
            onClose();
            // Add small delay to ensure modal closes before navigation
            setTimeout(() => {
                navigate(`/events/${event._id || event.id}`);
            }, 100);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableEnforceFocus>
            <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 700 }}>
                Registration Details
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                <Stack spacing={3}>
                    {/* Event Summary Card */}
                    {event ? (
                        <Card sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                                    EVENT INFORMATION
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                    {event.title || 'Event Details'}
                                </Typography>

                                <Stack spacing={1.5}>
                                    {/* Event Date */}
                                    {(event.date || event.startDate) && (
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                            <CalendarToday sx={{ fontSize: 18, color: 'primary.main', mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                    DATE
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {new Date(event.date || event.startDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Event Time */}
                                    {event.time && (
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                            <AccessTime sx={{ fontSize: 18, color: 'primary.main', mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                    TIME
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {event.time}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Location */}
                                    {(event.location || event.venue) && (
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                            <LocationOn sx={{ fontSize: 18, color: 'primary.main', mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                    LOCATION
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {event.location || event.venue || 'Location TBA'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Attendees */}
                                    {event.attendees !== undefined && (
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                            <People sx={{ fontSize: 18, color: 'primary.main', mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                    ATTENDEES
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {event.attendees || 0} attending
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Price */}
                                    {event.price !== undefined && (
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                            <AttachMoney sx={{ fontSize: 18, color: 'primary.main', mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                    PRICE
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    ₹{event.price || 0}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card sx={{ background: '#f0f4f8', p: 2 }}>
                            <Typography color="text.secondary">
                                Event details loading...
                            </Typography>
                        </Card>
                    )}

                    <Divider />

                    {/* Registration Details */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 2 }}>
                            YOUR REGISTRATION
                        </Typography>

                        <Stack spacing={2}>
                            {/* Name */}
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <Person sx={{ fontSize: 18, color: 'success.main', mt: 0.5 }} />
                                <Box flex={1}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                        FULL NAME
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {registration.fullName}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Email */}
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <Email sx={{ fontSize: 18, color: 'success.main', mt: 0.5 }} />
                                <Box flex={1}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                        EMAIL
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
                                        {registration.email}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Phone */}
                            {registration.phone && (
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                    <Phone sx={{ fontSize: 18, color: 'success.main', mt: 0.5 }} />
                                    <Box flex={1}>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                            PHONE
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {registration.phone}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {/* Company */}
                            {registration.company && (
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                    <BusinessCenter sx={{ fontSize: 18, color: 'success.main', mt: 0.5 }} />
                                    <Box flex={1}>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                            COMPANY
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {registration.company}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {/* Ticket Info */}
                            <Box sx={{ background: '#f5f7fa', p: 2, borderRadius: 1, mt: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                            TICKET TYPE
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                            {registration.ticketType || 'Standard'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                            TICKET PRICE
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AttachMoney sx={{ fontSize: 16, color: 'primary.main' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                                ₹{registration.ticketPrice || registration.totalPrice || 0}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Registration Date */}
                            {registration.registrationDate && (
                                <Box sx={{ background: '#f5f7fa', p: 2, borderRadius: 1, mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                        REGISTERED ON
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {new Date(registration.registrationDate).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })} at {new Date(registration.registrationDate).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Typography>
                                </Box>
                            )}

                            {/* Fallback for createdAt if registrationDate not available */}
                            {!registration.registrationDate && registration.createdAt && (
                                <Box sx={{ background: '#f5f7fa', p: 2, borderRadius: 1, mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                        REGISTERED ON
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {new Date(registration.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })} at {new Date(registration.createdAt).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose} variant="outlined">
                    Close
                </Button>
                <Button 
                    onClick={handleViewFullEvent} 
                    variant="contained" 
                    color="primary"
                    disabled={!event || (!event._id && !event.id)}
                    sx={{
                        transition: 'all 0.3s ease',
                        '&:not(:disabled)': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontWeight: 600
                        }
                    }}
                >
                    View Full Event
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RegistrationDetailModal;
