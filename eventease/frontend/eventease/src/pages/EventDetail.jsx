import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Box,
    Button,
    Chip,
    Rating,
    Divider,
    Card,
    CardContent,
    Avatar,
    IconButton,
    Paper,
    Breadcrumbs,
    Link,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stepper,
    Step,
    StepLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import {
    Bookmark,
    BookmarkBorder,
    Share,
    LocationOn,
    CalendarToday,
    AccessTime,
    People,
    ArrowBack,
    Event
} from '@mui/icons-material';
import { eventService } from '../services/events';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import EmptyState from '../components/UI/EmptyState';
import EventCard from '../components/EventCard';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [relatedEvents, setRelatedEvents] = useState([]);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [selectedTicketType, setSelectedTicketType] = useState('standard');
    const [bookingStep, setBookingStep] = useState(0);

    useEffect(() => {
        console.log('🔍 EventDetail: Component mounted');
        console.log('   URL Param ID:', id);
        
        if (id && id !== 'undefined') {
            console.log('✅ EventDetail: Valid ID received, fetching details...');
            fetchEventDetails();
        } else {
            console.warn('❌ EventDetail: No valid ID - showing error');
            setLoading(false);
            setError('Event ID is missing or invalid');
        }
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Validate ID
            if (!id) {
                console.warn('❌ EventDetail: Event ID is missing');
                setError('Event ID is missing');
                setLoading(false);
                return;
            }

            console.log('🔄 EventDetail: Fetching event from API...');
            console.log('   Event ID:', id);

            // Try to fetch specific event by ID first
            try {
                const response = await eventService.getEvent(id);
                console.log('✅ EventDetail: API response received');
                console.log('   Response:', response);
                
                const foundEvent = response?.data || response;
                console.log('   Extracted event:', foundEvent);
                
                if (foundEvent && (foundEvent._id || foundEvent.id)) {
                    console.log('✅ EventDetail: Event found, setting state');
                    const eventData = {
                        ...foundEvent,
                        id: foundEvent._id || foundEvent.id,
                        date: foundEvent.date || new Date(),
                        image: foundEvent.image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800`,
                        isBookmarked: foundEvent.isBookmarked || false,
                        tags: foundEvent.tags || ['featured'],
                        rating: foundEvent.rating || 4.5,
                        reviews: foundEvent.reviews || Math.floor(Math.random() * 1000),
                        attendees: foundEvent.attendees || Math.floor(Math.random() * 5000),
                        organizer: foundEvent.organizer ? {
                            name: foundEvent.organizer.name || 'Event Organizer',
                            avatar: foundEvent.organizer.avatar || `https://i.pravatar.cc/100?u=${foundEvent.organizer?.email || 'organizer'}`,
                            email: foundEvent.organizer.email || 'organizer@example.com',
                            phone: foundEvent.organizer.phone || '+91 9876543210'
                        } : {
                            name: 'Event Organizer',
                            avatar: 'https://i.pravatar.cc/100',
                            email: 'organizer@example.com',
                            phone: '+91 9876543210'
                        },
                        time: foundEvent.time || '09:00 AM',
                        location: foundEvent.location || foundEvent.venue?.city || 'Location TBA',
                        venue: foundEvent.venue || 'Venue TBA',
                        description: foundEvent.description || 'Join us for an amazing event filled with learning, networking, and fun activities.',
                        longDescription: foundEvent.longDescription || `This is a detailed description of the event. ${foundEvent.description} We have planned an incredible experience for all attendees with expert speakers, hands-on workshops, and networking opportunities.

Key Highlights:
• Expert-led sessions and workshops
• Networking with industry professionals
• Hands-on learning experiences
• Certificate of participation
• Lunch and refreshments included

Don't miss this opportunity to enhance your skills and connect with like-minded individuals.`,
                        includes: foundEvent.includes || [
                            'Certificate of Participation',
                            'Lunch and Refreshments',
                            'Networking Session',
                            'Event Kit',
                            'Parking Facility'
                        ],
                        requirements: foundEvent.requirements || [
                            'Valid ID Proof',
                            'Registration Confirmation',
                            'Laptop (if required)'
                        ]
                    };
                    setEvent(eventData);
                    console.log('✅ EventDetail: Event state set, title:', eventData.title);
                    fetchRelatedEvents(foundEvent.category, foundEvent._id);
                    return;
                }
            } catch (singleEventErr) {
                console.warn('⚠️ EventDetail: Single event fetch failed:', singleEventErr.message);
            }

            // Fallback: Fetch all events and find the matching one
            console.log('🔄 EventDetail: Trying fallback - fetching all events...');
            const listResponse = await eventService.getEvents();
            const allEvents = listResponse?.data || listResponse?.events || [];
            console.log('   Total events fetched:', allEvents.length);
            
            const foundEvent = allEvents.find(e => e._id === id || e.id === id);
            console.log('   Event found in list:', !!foundEvent);
            
            if (foundEvent) {
                console.log('✅ EventDetail: Event found in fallback, setting state');
                const eventData = {
                    ...foundEvent,
                    id: foundEvent._id || foundEvent.id,
                    date: foundEvent.date || new Date(),
                    image: foundEvent.image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800`,
                    isBookmarked: foundEvent.isBookmarked || false,
                    tags: foundEvent.tags || ['featured'],
                    rating: foundEvent.rating || 4.5,
                    reviews: foundEvent.reviews || Math.floor(Math.random() * 1000),
                    attendees: foundEvent.attendees || Math.floor(Math.random() * 5000),
                    organizer: foundEvent.organizer ? {
                        name: foundEvent.organizer.name || 'Event Organizer',
                        avatar: foundEvent.organizer.avatar || `https://i.pravatar.cc/100?u=${foundEvent.organizer?.email || 'organizer'}`,
                        email: foundEvent.organizer.email || 'organizer@example.com',
                        phone: foundEvent.organizer.phone || '+91 9876543210'
                    } : {
                        name: 'Event Organizer',
                        avatar: 'https://i.pravatar.cc/100',
                        email: 'organizer@example.com',
                        phone: '+91 9876543210'
                    },
                    time: foundEvent.time || '09:00 AM',
                    location: foundEvent.location || foundEvent.venue?.city || 'Location TBA',
                    venue: foundEvent.venue || 'Venue TBA',
                    description: foundEvent.description || 'Join us for an amazing event filled with learning, networking, and fun activities.',
                    longDescription: foundEvent.longDescription || `This is a detailed description of the event. ${foundEvent.description} We have planned an incredible experience for all attendees with expert speakers, hands-on workshops, and networking opportunities.

Key Highlights:
• Expert-led sessions and workshops
• Networking with industry professionals
• Hands-on learning experiences
• Certificate of participation
• Lunch and refreshments included

Don't miss this opportunity to enhance your skills and connect with like-minded individuals.`,
                    includes: foundEvent.includes || [
                        'Certificate of Participation',
                        'Lunch and Refreshments',
                        'Networking Session',
                        'Event Kit',
                        'Parking Facility'
                    ],
                    requirements: foundEvent.requirements || [
                        'Valid ID Proof',
                        'Registration Confirmation',
                        'Laptop (if required)'
                    ]
                };
                setEvent(eventData);
                console.log('✅ EventDetail: Event state set from fallback');
                fetchRelatedEvents(foundEvent.category, foundEvent._id);
            } else {
                console.error('❌ EventDetail: Event not found in any source');
                setError('Event not found');
            }
        } catch (err) {
            console.error('❌ EventDetail: Error fetching event:', err);
            setError('Failed to load event details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedEvents = async (category, currentEventId) => {
        try {
            const response = await eventService.getEvents();
            const eventsList = response?.data || response?.events || [];
            const related = eventsList
                .filter(e => e.category === category && (e.id !== currentEventId && e._id !== currentEventId))
                .slice(0, 3)
                .map(event => ({
                    ...event,
                    id: event._id || event.id
                }));
            setRelatedEvents(related);
        } catch (err) {
            console.error('Error fetching related events:', err);
        }
    };

    const handleBookmark = () => {
        setEvent(prev => ({ ...prev, isBookmarked: !prev.isBookmarked }));
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: event.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Event link copied to clipboard!');
        }
    };

    const handleRegister = () => {
        if (event?.id || event?._id) {
            navigate(`/events/${event.id || event._id}/register`);
        }
    };

    const handleViewDetails = () => {
        setOpenDetailsModal(true);
        setBookingStep(0);
        setSelectedQuantity(1);
        setSelectedTicketType('standard');
    };

    const handleCloseDetailsModal = () => {
        setOpenDetailsModal(false);
    };

    const handleProceedToRegistration = () => {
        navigate(`/events/${id}/register`, { 
            state: { 
                quantity: selectedQuantity, 
                ticketType: selectedTicketType 
            } 
        });
    };

    const handleNextStep = () => {
        if (bookingStep < 2) {
            setBookingStep(bookingStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (bookingStep > 0) {
            setBookingStep(bookingStep - 1);
        }
    };

    const handleRelatedEventClick = (eventId) => {
        if (eventId && eventId !== 'undefined') {
            navigate(`/events/${eventId}`);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBA';
        try {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-IN', options);
        } catch (err) {
            return 'Date TBA';
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading event details..." />;
    }

    if (error) {
        return (
            <EmptyState
                title="Event Not Found"
                description={error}
                actionText="Back to Events"
                onAction={() => navigate('/events')}
            />
        );
    }

    if (!event) {
        return (
            <EmptyState
                title="Event Not Found"
                description="The event you're looking for doesn't exist."
                actionText="Back to Events"
                onAction={() => navigate('/events')}
            />
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
            {/* Breadcrumb */}
            <Breadcrumbs sx={{ mb: 3, fontSize: { xs: '12px', sm: '13px', md: '14px' } }}>
                <Link
                    color="inherit"
                    href="/events"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/events');
                    }}
                    sx={{ cursor: 'pointer' }}
                >
                    Events
                </Link>
                <Typography color="text.primary">{event.title}</Typography>
            </Breadcrumbs>

            {/* Back Button */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/events')}
                sx={{ mb: 3, fontSize: { xs: '12px', sm: '13px', md: '14px' } }}
            >
                Back to Events
            </Button>

            <Grid container spacing={{ xs: 2, sm: 2.5, md: 4 }}>
                {/* Main Content */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ overflow: 'hidden', mb: 4 }}>
                        <img
                            src={event.image}
                            alt={event.title}
                            style={{
                                width: '100%',
                                height: 'auto',
                                minHeight: '250px',
                                maxHeight: '400px',
                                objectFit: 'cover'
                            }}
                        />
                    </Paper>

                    {/* Event Header */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, flex: 1, fontSize: { xs: '20px', sm: '24px', md: '28px' } }}>
                                {event.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton onClick={handleBookmark} color={event.isBookmarked ? 'primary' : 'default'}>
                                    {event.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                                </IconButton>
                                <IconButton onClick={handleShare} color="primary">
                                    <Share />
                                </IconButton>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            <Chip label={event.category} color="primary" variant="outlined" />
                            {event.tags.map((tag, index) => (
                                <Chip key={index} label={tag} variant="outlined" size="small" />
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Rating value={event.rating} precision={0.1} readOnly />
                            <Typography variant="body2" color="text.secondary">
                                {event.rating} ({event.reviews} reviews)
                            </Typography>
                        </Box>
                    </Box>

                    {/* Event Details */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '16px', sm: '18px' } }}>
                                Event Details
                            </Typography>
                            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <CalendarToday color="primary" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Date
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {formatDate(event.date)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <AccessTime color="primary" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Time
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {event.time}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <LocationOn color="primary" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Location
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {event.location}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {event.venue}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <People color="primary" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Attendees
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {event.attendees?.toLocaleString()}+ registered
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '16px', sm: '18px' } }}>
                                About This Event
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ fontSize: { xs: '13px', sm: '14px' } }}>
                                {event.longDescription || event.description}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* What's Included */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '16px', sm: '18px' } }}>
                                What's Included
                            </Typography>
                            {event.includes && event.includes.length > 0 ? (
                                <Box component="ul" sx={{ pl: 2 }}>
                                    {event.includes.map((item, index) => (
                                        <Typography key={index} component="li" variant="body1" sx={{ mb: 1 }}>
                                            {item}
                                        </Typography>
                                    ))}
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Typography sx={{ fontSize: '1.2rem' }}>🎟️</Typography>
                                        <Typography variant="body1">Event Entry Pass</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Typography sx={{ fontSize: '1.2rem' }}>☕</Typography>
                                        <Typography variant="body1">Complimentary Refreshments</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Typography sx={{ fontSize: '1.2rem' }}>🎓</Typography>
                                        <Typography variant="body1">Certificate of Participation</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Typography sx={{ fontSize: '1.2rem' }}>🤝</Typography>
                                        <Typography variant="body1">Networking Opportunities</Typography>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {/* Location Details */}
                    <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2, color: '#1e293b', fontSize: { xs: '16px', sm: '18px' } }}>
                                📍 Location & Venue Details
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ 
                                    background: 'white', 
                                    p: 2, 
                                    borderRadius: 1.5,
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
                                        Venue Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                        {event.venue || event.location}
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    background: 'white', 
                                    p: 2, 
                                    borderRadius: 1.5,
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
                                        City & Location
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                        {event.location}
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    background: 'white', 
                                    p: 2, 
                                    borderRadius: 1.5,
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
                                        Event Capacity
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                        {event.capacity?.toLocaleString()} persons
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Pricing & Payment Options */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2, color: '#1e293b', fontSize: { xs: '16px', sm: '18px' } }}>
                                💳 Pricing & Payment Options
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Box sx={{ 
                                    background: '#f8f9fa', 
                                    p: 2, 
                                    borderRadius: 1.5,
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Typography variant="body1">Base Price</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#667eea' }}>
                                        ₹{event.price?.toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    background: '#f8f9fa', 
                                    p: 2, 
                                    borderRadius: 1.5,
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Typography variant="body1">Platform Fee</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#667eea' }}>
                                        ₹{Math.round(event.price * 0.02).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    background: '#f8f9fa', 
                                    p: 2, 
                                    borderRadius: 1.5,
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Typography variant="body1">GST (18%)</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#667eea' }}>
                                        ₹{Math.round(event.price * 0.18).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    p: 2.5, 
                                    borderRadius: 1.5,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: 'white' }}>
                                        Total Amount
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>
                                        ₹{(event.price + Math.round(event.price * 0.02) + Math.round(event.price * 0.18)).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: '#1e293b' }}>
                                        Payment Methods:
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Chip label="💳 Credit Card" size="small" variant="outlined" />
                                        <Chip label="🏦 Debit Card" size="small" variant="outlined" />
                                        <Chip label="📱 UPI" size="small" variant="outlined" />
                                        <Chip label="💰 Wallet" size="small" variant="outlined" />
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '16px', sm: '18px' } }}>
                                Requirements
                            </Typography>
                            {event.requirements && event.requirements.length > 0 ? (
                                <Box component="ul" sx={{ pl: 2 }}>
                                    {event.requirements.map((item, index) => (
                                        <Typography key={index} component="li" variant="body1" sx={{ mb: 1 }}>
                                            {item}
                                        </Typography>
                                    ))}
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Typography sx={{ fontSize: '1.2rem' }}>✓</Typography>
                                        <Typography variant="body1">Valid ID Proof</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Typography sx={{ fontSize: '1.2rem' }}>✓</Typography>
                                        <Typography variant="body1">Confirmation Email</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Typography sx={{ fontSize: '1.2rem' }}>✓</Typography>
                                        <Typography variant="body1">Arrive 15 minutes early</Typography>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    {/* Registration Card */}
                    <Card sx={{ 
                        position: 'sticky', 
                        top: 100, 
                        mb: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        boxShadow: '0 12px 32px rgba(102, 126, 234, 0.35)',
                        borderRadius: 3,
                        overflow: 'hidden'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            {/* Price Section */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 0.5, fontSize: { xs: '28px', sm: '32px', md: '36px' } }}>
                                    ₹{event.price?.toLocaleString() || '0'}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500, fontSize: { xs: '13px', sm: '14px' } }}>
                                    Per Person
                                </Typography>
                            </Box>

                            {/* Register Button */}
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleRegister}
                                sx={{ 
                                    mb: 1.5, 
                                    py: { xs: 1.2, sm: 1.5, md: 1.8 }, 
                                    backgroundColor: '#fff',
                                    color: '#667eea',
                                    fontWeight: 700,
                                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.05rem' },
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Register Now
                            </Button>

                            {/* View Details Button */}
                            <Button
                                variant="outlined"
                                fullWidth
                                size="large"
                                onClick={handleViewDetails}
                                sx={{ 
                                    mb: 2.5, 
                                    py: { xs: 1.2, sm: 1.3, md: 1.5 },
                                    borderColor: 'rgba(255,255,255,0.8)',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.15)',
                                        borderColor: 'white'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                View Details
                            </Button>

                            {/* Info Section */}
                            <Box sx={{ 
                                background: 'rgba(255,255,255,0.12)', 
                                p: 2, 
                                borderRadius: 1.5,
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.2 }}>
                                    <Typography sx={{ fontSize: '1.2rem' }}>✓</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}>
                                        {event.attendees?.toLocaleString() || 0}+ people attending
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Typography sx={{ fontSize: '1.2rem' }}>📍</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}>
                                        {event.capacity && event.attendees ? `${event.capacity - event.attendees} seats available` : 'Unlimited capacity'}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Organizer Info */}
                    <Card sx={{ 
                        mb: 3,
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        borderTop: '4px solid #667eea',
                        borderRadius: 2
                    }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '16px', sm: '18px' } }}>
                                📋 Event Organizer
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    src={event.organizer?.avatar}
                                    sx={{ width: 70, height: 70, border: '3px solid #667eea' }}
                                >
                                    {event.organizer?.name?.charAt(0)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                        {event.organizer?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                        📧 {event.organizer?.email}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                        📞 {event.organizer?.phone}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
                <Box sx={{ mt: 6 }}>
                    <Divider sx={{ mb: 4 }} />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                        Related Events
                    </Typography>
                    <Grid container spacing={3}>
                        {relatedEvents.map((relatedEvent) => (
                            <Grid item xs={12} sm={6} md={4} key={relatedEvent.id}>
                                <EventCard
                                    event={relatedEvent}
                                    onBookmark={() => {}}
                                    onRegister={() => {}}
                                    onClick={() => handleRelatedEventClick(relatedEvent.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Event Details & Booking Modal */}
            <Dialog 
                open={openDetailsModal} 
                onClose={handleCloseDetailsModal}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                    pb: 3
                }}>
                    📋 Complete Booking Details
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {/* Stepper */}
                    <Stepper 
                        activeStep={bookingStep}
                        sx={{ mb: 4 }}
                    >
                        <Step>
                            <StepLabel>Location & Details</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Ticket Options</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Summary & Confirm</StepLabel>
                        </Step>
                    </Stepper>

                    {/* Step 0: Location & Venue Details */}
                    {bookingStep === 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ 
                                background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
                                p: 3,
                                borderRadius: 2
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
                                    📍 Location & Venue Information
                                </Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableBody>
                                            <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ fontWeight: 600, width: '40%' }}>Venue Name:</TableCell>
                                                <TableCell>{event?.venue || event?.location}</TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ fontWeight: 600 }}>City:</TableCell>
                                                <TableCell>{event?.location}</TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ fontWeight: 600 }}>Date:</TableCell>
                                                <TableCell>{new Date(event?.date).toLocaleDateString('en-IN', { 
                                                    weekday: 'long', 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}</TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ fontWeight: 600 }}>Time:</TableCell>
                                                <TableCell>{event?.time}</TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ fontWeight: 600 }}>Venue Capacity:</TableCell>
                                                <TableCell>{event?.capacity?.toLocaleString()} people</TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ fontWeight: 600 }}>Seats Available:</TableCell>
                                                <TableCell sx={{ color: '#22c55e', fontWeight: 700 }}>
                                                    {Math.max(0, event?.capacity - (event?.attendees || 0)).toLocaleString()} seats
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            {/* Event Description */}
                            <Box sx={{ 
                                background: '#f8f9fa',
                                p: 2.5,
                                borderRadius: 2,
                                border: '1px solid #e2e8f0'
                            }}>
                                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                                    {event?.description}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* Step 1: Ticket Options */}
                    {bookingStep === 1 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ 
                                background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
                                p: 3,
                                borderRadius: 2
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#1e293b' }}>
                                    🎟️ Select Ticket Type
                                </Typography>
                                <RadioGroup 
                                    value={selectedTicketType}
                                    onChange={(e) => setSelectedTicketType(e.target.value)}
                                >
                                    <Box sx={{ 
                                        mb: 2, 
                                        p: 2, 
                                        border: '2px solid #e2e8f0',
                                        borderRadius: 1.5,
                                        background: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        '&:hover': { borderColor: '#667eea', background: '#f8f9ff' }
                                    }}>
                                        <FormControlLabel 
                                            value="standard" 
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                                        Standard Ticket
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                                                        Basic entry pass + refreshments
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ width: '100%' }}
                                        />
                                    </Box>
                                    <Box sx={{ 
                                        mb: 2, 
                                        p: 2, 
                                        border: '2px solid #e2e8f0',
                                        borderRadius: 1.5,
                                        background: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        '&:hover': { borderColor: '#667eea', background: '#f8f9ff' }
                                    }}>
                                        <FormControlLabel 
                                            value="vip" 
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                                        ⭐ VIP Ticket (+₹{Math.round(event?.price * 0.5).toLocaleString()})
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                                                        Premium seating + priority check-in + exclusive lounge access
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ width: '100%' }}
                                        />
                                    </Box>
                                    <Box sx={{ 
                                        mb: 2, 
                                        p: 2, 
                                        border: '2px solid #e2e8f0',
                                        borderRadius: 1.5,
                                        background: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        '&:hover': { borderColor: '#667eea', background: '#f8f9ff' }
                                    }}>
                                        <FormControlLabel 
                                            value="group" 
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                                        👥 Group Ticket (5+ people, -15% discount)
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                                                        Best for groups of 5 or more attendees
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ width: '100%' }}
                                        />
                                    </Box>
                                </RadioGroup>
                            </Box>

                            {/* Quantity Selector */}
                            <Box sx={{ 
                                background: '#f8f9fa',
                                p: 2.5,
                                borderRadius: 2,
                                border: '1px solid #e2e8f0'
                            }}>
                                <Typography variant="body1" sx={{ fontWeight: 700, mb: 1.5 }}>
                                    🎫 Number of Tickets
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Button 
                                        variant="outlined" 
                                        size="small"
                                        onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                                        sx={{ minWidth: 40 }}
                                    >
                                        −
                                    </Button>
                                    <TextField
                                        type="number"
                                        value={selectedQuantity}
                                        onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        inputProps={{ min: 1, max: 10 }}
                                        sx={{ width: 80, '& input': { textAlign: 'center', fontWeight: 700 } }}
                                    />
                                    <Button 
                                        variant="outlined" 
                                        size="small"
                                        onClick={() => setSelectedQuantity(Math.min(10, selectedQuantity + 1))}
                                        sx={{ minWidth: 40 }}
                                    >
                                        +
                                    </Button>
                                    <Typography variant="body2" sx={{ color: '#64748b', ml: 'auto' }}>
                                        Max 10 tickets per booking
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Step 2: Summary & Confirm */}
                    {bookingStep === 2 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Order Summary */}
                            <Card sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#1e293b' }}>
                                        💰 Order Summary
                                    </Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                                                    <TableCell sx={{ fontWeight: 600 }}>Event:</TableCell>
                                                    <TableCell sx={{ textAlign: 'right' }}>{event?.title}</TableCell>
                                                </TableRow>
                                                <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                                                    <TableCell sx={{ fontWeight: 600 }}>Ticket Type:</TableCell>
                                                    <TableCell sx={{ textAlign: 'right', textTransform: 'capitalize' }}>
                                                        {selectedTicketType}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                                                    <TableCell sx={{ fontWeight: 600 }}>Quantity:</TableCell>
                                                    <TableCell sx={{ textAlign: 'right' }}>{selectedQuantity} tickets</TableCell>
                                                </TableRow>
                                                <TableRow sx={{ background: '#e0e7ff', '&:last-child td': { border: 0 } }}>
                                                    <TableCell sx={{ fontWeight: 700 }}>Subtotal:</TableCell>
                                                    <TableCell sx={{ textAlign: 'right', fontWeight: 700 }}>
                                                        ₹{(event?.price * selectedQuantity).toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                                                    <TableCell sx={{ fontWeight: 600 }}>Platform Fee (2%):</TableCell>
                                                    <TableCell sx={{ textAlign: 'right' }}>
                                                        ₹{Math.round(event?.price * selectedQuantity * 0.02).toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                                                    <TableCell sx={{ fontWeight: 600 }}>GST (18%):</TableCell>
                                                    <TableCell sx={{ textAlign: 'right' }}>
                                                        ₹{Math.round(event?.price * selectedQuantity * 0.18).toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '&:last-child td': { border: 0 } }}>
                                                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>Total Amount:</TableCell>
                                                    <TableCell sx={{ textAlign: 'right', fontWeight: 700, color: 'white' }}>
                                                        ₹{(event?.price * selectedQuantity + Math.round(event?.price * selectedQuantity * 0.02) + Math.round(event?.price * selectedQuantity * 0.18)).toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>

                            {/* Payment Methods */}
                            <Box sx={{ 
                                background: '#f8f9fa',
                                p: 2.5,
                                borderRadius: 2,
                                border: '1px solid #e2e8f0'
                            }}>
                                <Typography variant="body1" sx={{ fontWeight: 700, mb: 1.5 }}>
                                    💳 Accepted Payment Methods
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip label="💳 Credit Card" />
                                    <Chip label="🏦 Debit Card" />
                                    <Chip label="📱 UPI" />
                                    <Chip label="💰 Digital Wallet" />
                                </Box>
                            </Box>

                            {/* Cancellation Policy */}
                            <Box sx={{ 
                                background: '#fef3c7',
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid #fcd34d'
                            }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#92400e' }}>
                                    ⚠️ Cancellation Policy: Free cancellation until 2 days before the event. After that, 10% deduction will be applied.
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button 
                        onClick={handleCloseDetailsModal}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        Cancel
                    </Button>
                    {bookingStep > 0 && (
                        <Button 
                            onClick={handlePrevStep}
                            variant="outlined"
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            ← Back
                        </Button>
                    )}
                    {bookingStep < 2 ? (
                        <Button 
                            onClick={handleNextStep}
                            variant="contained"
                            sx={{ 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                textTransform: 'none',
                                fontWeight: 700
                            }}
                        >
                            Next →
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleProceedToRegistration}
                            variant="contained"
                            sx={{ 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 3
                            }}
                        >
                            Proceed to Registration
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EventDetail;