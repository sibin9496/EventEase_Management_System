import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Button,
    Chip,
    Rating,
    IconButton
} from '@mui/material';
import {
    Bookmark,
    BookmarkBorder,
    Share
} from '@mui/icons-material';

const EventCard = ({ event, onBookmark, onRegister, index }) => {
    const navigate = useNavigate();
    
    // Ensure event has a valid ID
    const eventId = event?._id || event?.id;

    const handleViewDetails = (e) => {
        e.stopPropagation();
        if (eventId) {
            navigate(`/events/${eventId}`);
        }
    };

    const handleRegister = (e) => {
        e.stopPropagation();
        if (eventId) {
            navigate(`/events/${eventId}/register`);
        }
    };

    const handleBookmark = (e) => {
        e.stopPropagation();
        if (eventId) {
            onBookmark(eventId);
        }
    };

    const handleCardClick = () => {
        if (eventId) {
            navigate(`/events/${eventId}`);
        }
    };

    return (
        <Card 
            sx={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                },
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
            onClick={handleCardClick}
        >
            <CardMedia
                component="img"
                height="200"
                image={event?.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                alt={event?.title || 'Event'}
                sx={{ 
                    objectFit: 'cover',
                    position: 'relative'
                }}
            />
            
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip 
                        label={event?.category || 'Event'} 
                        color="primary" 
                        size="small" 
                        variant="outlined"
                    />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton 
                            size="small" 
                            onClick={handleBookmark}
                            color={event?.isBookmarked ? 'primary' : 'default'}
                        >
                            {event?.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                        </IconButton>
                    </Box>
                </Box>

                <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 600,
                        height: '48px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {event?.title || 'Untitled Event'}
                </Typography>

                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                        mb: 2,
                        height: '40px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {event?.description || 'No description available'}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={event?.rating || 4.5} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({event?.reviews || 0})
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        📍 {event?.location || 'Location TBA'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        👥 {event?.attendees?.toLocaleString?.() || 0}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {event?.tags?.slice(0, 2)?.map((tag, tagIndex) => (
                        <Chip 
                            key={tagIndex} 
                            label={tag} 
                            size="small" 
                            variant="outlined"
                            color="default"
                        />
                    ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                        {event?.price === 0 || event?.price === null ? 'Free' : `₹${event?.price?.toLocaleString?.() || 0}`}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                            variant="outlined" 
                            size="small"
                            onClick={handleViewDetails}
                        >
                            View
                        </Button>
                        <Button 
                            variant="contained" 
                            size="small"
                            onClick={handleRegister}
                        >
                            Register
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default EventCard;