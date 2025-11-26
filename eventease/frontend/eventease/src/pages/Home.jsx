import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Chip,
    Stack,
    Paper,
    IconButton
} from '@mui/material';
import {
    CalendarToday,
    LocationOn,
    People,
    TrendingUp,
    East,
    ChevronLeft,
    ChevronRight,
    Headphones,
    MusicNote,
    Radio,
    DirectionsRun,
    Mic,
    Build,
    Dashboard,
    Palette,
    Layers
} from '@mui/icons-material';
import { eventService } from '../services/events';
import { API_BASE_URL } from '../config/api';

const CATEGORY_FILTERS = [
    { id: 'all', label: 'All', icon: Dashboard, dbValue: 'all' },
    { id: 'Music', label: 'Music', icon: MusicNote, dbValue: 'Music' },
    { id: 'Arts', label: 'Arts', icon: Palette, dbValue: 'Arts' },
    { id: 'Sports', label: 'Sports', icon: DirectionsRun, dbValue: 'Sports' },
    { id: 'Business', label: 'Business', icon: Dashboard, dbValue: 'Business' },
    { id: 'Technology', label: 'Technology', icon: Build, dbValue: 'Technology' },
    { id: 'Wedding', label: 'Wedding', icon: Palette, dbValue: 'Wedding' },
    { id: 'Education', label: 'Education', icon: Build, dbValue: 'Education' }
];

const Home = () => {
    const navigate = useNavigate();
    const [featuredEvent, setFeaturedEvent] = useState(null);
    const [allEvents, setAllEvents] = useState([]);
    const [trendingEvents, setTrendingEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            console.log('📡 Home: Fetching events from:', `${API_BASE_URL}/events?limit=50`);
            // Fetch with limit=50 (max allowed by API)
            const response = await fetch(`${API_BASE_URL}/events?limit=50`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                console.error('❌ Home: API response not OK:', response.status);
                throw new Error('Failed to fetch events');
            }
            
            const data = await response.json();
            console.log('📊 Home: API response data:', data);
            const events = data?.data || data?.events || [];
            
            console.log('📋 Home: Events count:', events.length);
            
            // Add IDs to all events
            const eventsWithIds = events.map(event => ({
                ...event,
                id: event._id || event.id
            }));
            
            setAllEvents(eventsWithIds);
            
            // Get featured/trending event for hero
            const featured = eventsWithIds.find(e => e.isFeatured || e.isTrending) || eventsWithIds[0];
            setFeaturedEvent(featured);
            console.log('⭐ Home: Featured event:', featured?.title);
            
            // Use all events for carousel (not just trending)
            setTrendingEvents(eventsWithIds);
        } catch (err) {
            console.error('❌ Home: Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBrowseEvents = () => {
        navigate('/events');
    };

    const handleViewEvent = (eventId) => {
        if (eventId) {
            navigate(`/events/${eventId}`);
        }
    };

    const handleCarouselNext = () => {
        setCarouselIndex((prev) => (prev + 1) % trendingEvents.length);
    };

    const handleCarouselPrev = () => {
        setCarouselIndex((prev) => (prev - 1 + trendingEvents.length) % trendingEvents.length);
    };

    const getFilteredEvents = () => {
        if (selectedCategory === 'all') {
            return allEvents;
        }
        
        return allEvents.filter(event => {
            if (!event.category) return false;
            return event.category === selectedCategory;
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBA';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return 'Date TBA';
        }
    };

    const filteredEvents = getFilteredEvents();
    const carouselEvent = trendingEvents[carouselIndex];

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: '350px', sm: '450px', md: '600px' },
                    backgroundImage: featuredEvent?.image 
                        ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${featuredEvent.image})`
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    overflow: 'hidden'
                }}
            >
                <Container maxWidth="lg" sx={{ zIndex: 2, py: { xs: 3, sm: 5, md: 8 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
                    <Stack spacing={3} alignItems="center">
                        <Chip
                            icon={<TrendingUp />}
                            label="Featured Event"
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                fontWeight: 600,
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        />

                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                                mb: 2,
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }
                            }}
                        >
                            {featuredEvent?.title || 'EventEase'}
                        </Typography>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                fontSize: '1.1rem',
                                mb: 3
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn sx={{ fontSize: 20 }} />
                                <Typography variant="body1">
                                    {featuredEvent?.location || 'Multiple Locations'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarToday sx={{ fontSize: 20 }} />
                                <Typography variant="body1">
                                    {featuredEvent ? formatDate(featuredEvent.date) : 'Date TBA'}
                                </Typography>
                            </Box>
                        </Stack>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => handleViewEvent(featuredEvent?._id || featuredEvent?.id)}
                            sx={{
                                backgroundColor: 'white',
                                color: '#667eea',
                                fontWeight: 700,
                                fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                                px: { xs: 2, sm: 3, md: 4 },
                                py: { xs: 1, sm: 1.2, md: 1.5 },
                                borderRadius: '50px',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                                    backgroundColor: '#f0f0f0'
                                }
                            }}
                        >
                            View Event
                        </Button>
                    </Stack>
                </Container>
            </Box>

            {/* Spotlight Section with Carousel */}
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
                <Box sx={{ mb: 6 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            mb: 1,
                            color: '#1e293b',
                            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        Spotlight 🎯
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#64748b',
                            fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1.05rem' }
                        }}
                    >
                        Handpicked experiences and standout events you won't want to miss!
                    </Typography>
                </Box>

                {trendingEvents.length > 0 && carouselEvent && (
                    <Box
                        sx={{
                            position: 'relative',
                            borderRadius: 3,
                            overflow: 'hidden',
                            mb: 4
                        }}
                    >
                        {/* Event Counter */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Chip
                                label={`Event ${carouselIndex + 1} of ${trendingEvents.length}`}
                                sx={{
                                    backgroundColor: '#667eea',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.9rem'
                                }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {/* Left Navigation Button */}
                            <IconButton
                                onClick={handleCarouselPrev}
                                disabled={trendingEvents.length === 0}
                                sx={{
                                    backgroundColor: '#667eea',
                                    border: '3px solid #667eea',
                                    borderRadius: '50%',
                                    width: { xs: 45, sm: 55, md: 65 },
                                    height: { xs: 45, sm: 55, md: 65 },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        backgroundColor: '#764ba2',
                                        transform: 'scale(1.15)',
                                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                                    },
                                    transition: 'all 0.3s ease',
                                    '&:disabled': {
                                        backgroundColor: '#cbd5e1',
                                        border: '3px solid #cbd5e1',
                                        cursor: 'not-allowed'
                                    }
                                }}
                                title="Previous Event"
                            >
                                <ChevronLeft sx={{ color: 'white', fontSize: { xs: 24, md: 36 }, fontWeight: 'bold' }} />
                            </IconButton>

                            {/* Main Carousel Card */}
                            <Box sx={{ flex: 1, maxWidth: 900 }}>
                                <Grid container spacing={3} alignItems="stretch">
                                    {/* Carousel Image */}
                                    <Grid item xs={12} md={6}>
                                        <Card
                                            sx={{
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                                height: '100%',
                                                minHeight: { xs: '300px', md: '400px' }
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={carouselEvent.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600'}
                                                alt={carouselEvent.title}
                                                sx={{ height: '100%', objectFit: 'cover' }}
                                            />
                                        </Card>
                                    </Grid>

                                    {/* Event Details */}
                                    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Stack spacing={3}>
                                            <Box>
                                                <Typography
                                                    variant="h4"
                                                    sx={{
                                                        fontWeight: 800,
                                                        color: '#1e293b',
                                                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.8rem' },
                                                        mb: 1
                                                    }}
                                                >
                                                    {carouselEvent.title}
                                                </Typography>
                                                <Chip
                                                    label={carouselEvent.category || 'Event'}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#667eea',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        mb: 2
                                                    }}
                                                />
                                            </Box>

                                            <Stack spacing={2}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <LocationOn sx={{ color: '#667eea', fontSize: 20 }} />
                                                    <Typography sx={{ color: '#64748b', fontWeight: 500 }}>
                                                        {carouselEvent.location}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <CalendarToday sx={{ color: '#667eea', fontSize: 20 }} />
                                                    <Typography sx={{ color: '#64748b', fontWeight: 500 }}>
                                                        {formatDate(carouselEvent.date)}
                                                    </Typography>
                                                </Box>
                                                {carouselEvent.time && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Headphones sx={{ color: '#667eea', fontSize: 20 }} />
                                                        <Typography sx={{ color: '#64748b', fontWeight: 500 }}>
                                                            {carouselEvent.time}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {carouselEvent.price && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Typography sx={{ fontWeight: 700, color: '#667eea', fontSize: '1.2rem' }}>
                                                            ₹{carouselEvent.price}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Stack>

                                            <Typography
                                                sx={{
                                                    color: '#64748b',
                                                    lineHeight: 1.6,
                                                    fontSize: '0.95rem'
                                                }}
                                            >
                                                {carouselEvent.description?.substring(0, 200) || 'Amazing event awaiting you...'}
                                            </Typography>

                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: '#ec4899',
                                                        px: 4,
                                                        py: 1.5,
                                                        borderRadius: '25px',
                                                        fontWeight: 700,
                                                        textTransform: 'none',
                                                        fontSize: '1rem',
                                                        '&:hover': {
                                                            backgroundColor: '#db2777'
                                                        }
                                                    }}
                                                    onClick={() => handleViewEvent(carouselEvent.id)}
                                                >
                                                    Book Now
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Right Navigation Button */}
                            <IconButton
                                onClick={handleCarouselNext}
                                disabled={trendingEvents.length === 0}
                                sx={{
                                    backgroundColor: '#667eea',
                                    border: '3px solid #667eea',
                                    borderRadius: '50%',
                                    width: { xs: 45, sm: 55, md: 65 },
                                    height: { xs: 45, sm: 55, md: 65 },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        backgroundColor: '#764ba2',
                                        transform: 'scale(1.15)',
                                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                                    },
                                    transition: 'all 0.3s ease',
                                    '&:disabled': {
                                        backgroundColor: '#cbd5e1',
                                        border: '3px solid #cbd5e1',
                                        cursor: 'not-allowed'
                                    }
                                }}
                                title="Next Event"
                            >
                                <ChevronRight sx={{ color: 'white', fontSize: { xs: 24, md: 36 }, fontWeight: 'bold' }} />
                            </IconButton>
                        </Box>

                        {/* Slide Indicators */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4, mb: 2, flexWrap: 'wrap' }}>
                            {trendingEvents.map((_, index) => (
                                <Box
                                    key={index}
                                    onClick={() => setCarouselIndex(index)}
                                    sx={{
                                        width: index === carouselIndex ? 28 : 10,
                                        height: 10,
                                        borderRadius: '5px',
                                        backgroundColor: index === carouselIndex ? '#667eea' : '#cbd5e1',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: '#667eea'
                                        }
                                    }}
                                    title={`Go to event ${index + 1}`}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Container>

            {/* Explore Popular Events Section */}
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    color: '#1e293b',
                                    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                Explore Popular Events 🎉
                            </Typography>
                            <Typography sx={{ color: '#64748b', mt: 1, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
                                Dive into the most popular events and experiences nearby!
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            onClick={handleBrowseEvents}
                            sx={{
                                borderColor: '#ec4899',
                                color: '#ec4899',
                                fontWeight: 700,
                                borderRadius: '25px',
                                px: { xs: 2, sm: 3 },
                                fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                                '&:hover': {
                                    backgroundColor: 'rgba(236, 72, 153, 0.05)',
                                    borderColor: '#ec4899'
                                }
                            }}
                        >
                            All Events
                        </Button>
                    </Box>
                </Box>

                {/* Category Filters */}
                <Box sx={{ display: 'flex', gap: 1.5, mb: 6, overflowX: 'auto', pb: 1, flexWrap: 'nowrap' }}>
                    {CATEGORY_FILTERS.map((category) => {
                        const IconComponent = category.icon;
                        const isSelected = selectedCategory === category.id;
                        return (
                            <Chip
                                key={category.id}
                                icon={<IconComponent />}
                                label={category.label}
                                onClick={() => setSelectedCategory(category.id)}
                                sx={{
                                    backgroundColor: isSelected ? '#ec4899' : '#f1f5f9',
                                    color: isSelected ? 'white' : '#64748b',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    border: isSelected ? '2px solid #ec4899' : 'none',
                                    px: 2,
                                    py: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: isSelected ? '#db2777' : '#e2e8f0'
                                    }
                                }}
                            />
                        );
                    })}
                </Box>

                {/* Events Grid */}
                {filteredEvents.length > 0 ? (
                    <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                        {filteredEvents.slice(0, 8).map((event) => (
                            <Grid item xs={12} sm={6} md={3} key={event.id || event._id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)'
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'relative', height: { xs: '150px', sm: '180px', md: '200px' } }}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                                            alt={event.title}
                                            sx={{ height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            pb: 1,
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: '#f8fafc' }
                                        }}
                                        onClick={() => handleViewEvent(event.id)}
                                    >
                                        <Typography
                                            gutterBottom
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: '#1e293b',
                                                mb: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {event.title}
                                        </Typography>

                                        <Stack spacing={0.8} sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                                                <LocationOn sx={{ fontSize: 14 }} />
                                                <Typography variant="body2" noWrap>
                                                    {event.location}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                                                <CalendarToday sx={{ fontSize: 14 }} />
                                                <Typography variant="body2">
                                                    {formatDate(event.date)}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#667eea',
                                                    fontSize: '1.1rem'
                                                }}
                                            >
                                                ₹{event.price || 'Free'}
                                            </Typography>
                                            <Chip
                                                label="Paid"
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Paper
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            backgroundColor: '#f1f5f9',
                            borderRadius: 2
                        }}
                    >
                        <Typography color="text.secondary">
                            No events found in this category. Try another one!
                        </Typography>
                    </Paper>
                )}
            </Container>

            {/* Recently Viewed / Trending Events Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Box sx={{ mb: 6 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            mb: 1,
                            color: '#1e293b',
                            fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                    >
                        🔥 Trending Events
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#64748b',
                            fontSize: '1.05rem'
                        }}
                    >
                        Check out the most popular events happening right now
                    </Typography>
                </Box>

                {trendingEvents.length > 0 ? (
                    <Grid container spacing={3}>
                        {trendingEvents.map((event) => (
                            <Grid item xs={12} sm={6} md={3} key={event.id || event._id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)'
                                        }
                                    }}
                                    onClick={() => handleViewEvent(event._id || event.id)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                                        alt={event.title}
                                    />
                                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                        <Typography
                                            gutterBottom
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: '#1e293b',
                                                mb: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {event.title}
                                        </Typography>

                                        <Stack spacing={1} sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                                                <CalendarToday sx={{ fontSize: 14 }} />
                                                <Typography variant="body2">
                                                    {formatDate(event.date)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                                                <LocationOn sx={{ fontSize: 14 }} />
                                                <Typography variant="body2" noWrap>
                                                    {event.location}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                                                <People sx={{ fontSize: 14 }} />
                                                <Typography variant="body2">
                                                    {event.attendees || 0} attending
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#667eea',
                                                    fontSize: '1.1rem'
                                                }}
                                            >
                                                ₹{event.price || 'Free'}
                                            </Typography>
                                            <Chip
                                                label={event.category}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Paper
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            backgroundColor: '#f1f5f9',
                            borderRadius: 2
                        }}
                    >
                        <Typography color="text.secondary">
                            No trending events at the moment. Check back soon!
                        </Typography>
                    </Paper>
                )}

                {/* Call to Action Section */}
                <Box
                    sx={{
                        mt: 8,
                        p: 4,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 3,
                        textAlign: 'center',
                        color: 'white'
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                        Discover More Events
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                        Browse our complete collection of events and find the perfect one for you
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleBrowseEvents}
                        sx={{
                            backgroundColor: 'white',
                            color: '#667eea',
                            fontWeight: 700,
                            fontSize: '1rem',
                            px: 4,
                            py: 1.5,
                            borderRadius: '50px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                            }
                        }}
                        endIcon={<East />}
                    >
                        Browse All Events
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;