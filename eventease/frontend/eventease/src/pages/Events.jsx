import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import EventCard from '../components/EventCard';
import SearchBar from '../components/search/SearchBar';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import EmptyState from '../components/UI/EmptyState';
import { eventService } from '../services/events';

const Events = () => {
    const routerLocation = useLocation();
    const locationFilter = routerLocation.state?.filterByLocation;
    const incomingSearchQuery = routerLocation.state?.searchQuery;
    const performSearch = routerLocation.state?.performSearch;
    
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(incomingSearchQuery || '');
    const [error, setError] = useState('');
    const [activeLocationFilter, setActiveLocationFilter] = useState(locationFilter || null);

    useEffect(() => {
        fetchEvents();
    }, []);

    // Handle incoming search query from navigation
    useEffect(() => {
        if (incomingSearchQuery && performSearch && events.length > 0) {
            console.log('📍 Events Page: Applying incoming search query:', incomingSearchQuery);
            handleSearch(incomingSearchQuery);
        }
    }, [incomingSearchQuery, performSearch, events.length]);

    // Handle filtering when activeLocationFilter changes
    useEffect(() => {
        if (events.length === 0) return;

        if (activeLocationFilter) {
            const filtered = events.filter(event =>
                event.location?.toLowerCase().includes(activeLocationFilter.toLowerCase())
            );
            setFilteredEvents(filtered);
            setSearchQuery('');
        } else {
            setFilteredEvents(events);
            // Don't clear search query here if it came from navigation
            if (!incomingSearchQuery) {
                setSearchQuery('');
            }
        }
    }, [activeLocationFilter, events.length]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            console.log('📡 Events Page: Fetching events from API...');
            // Fetch events from MongoDB via API
            const response = await eventService.getEvents();
            console.log('📊 Events Page: Raw API response:', response);
            console.log('📊 Events Page: Response type:', typeof response);
            console.log('📊 Events Page: Response keys:', Object.keys(response || {}));
            
            const eventsList = response?.data || response?.events || [];
            console.log('📋 Events Page: Extracted events list:', eventsList);
            console.log('📋 Events Page: Events count:', eventsList.length);
            
            if (!eventsList || eventsList.length === 0) {
                console.warn('⚠️ Events Page: No events found in response');
                setError('No events found in the database');
                setEvents([]);
                setFilteredEvents([]);
                return;
            }
            
            // Transform the data to match our component structure
            const eventsData = eventsList.map((event, index) => {
                console.log(`🔄 Events Page: Transforming event ${index}:`, event.title);
                const eventId = event._id || event.id || `event-${index}`;
                return {
                    ...event,
                    id: eventId,
                    _id: eventId,
                    image: event.image || `https://images.unsplash.com/photo-${1540575467063 + index}?w=400`,
                    isBookmarked: event.isBookmarked || false,
                    isTrending: event.isTrending !== undefined ? event.isTrending : index < 5,
                    tags: event.tags || ['featured'],
                    rating: event.rating || 4.5,
                    reviews: event.reviews || Math.floor(Math.random() * 1000),
                    attendees: event.attendees || Math.floor(Math.random() * 5000),
                    organizer: event.organizer || {
                        name: 'Event Organizer',
                        avatar: 'https://i.pravatar.cc/28'
                    },
                    time: event.time || '09:00 AM',
                    location: event.location || event.venue?.city || 'Location TBA'
                };
            });
            
            console.log('✅ Events Page: Transformation complete, total events:', eventsData.length);
            setEvents(eventsData);
            setFilteredEvents(eventsData);
            setError('');
            
        } catch (err) {
            console.error('❌ Events Page: Error in fetchEvents:', err);
            console.error('❌ Events Page: Error message:', err.message);
            console.error('❌ Events Page: Error stack:', err.stack);
            setError('Failed to fetch events from database. Please check browser console for details.');
            setEvents([]);
            setFilteredEvents([]);
        } finally {
            setLoading(false);
            console.log('✅ Events Page: fetchEvents completed');
        }
    };

    const handleSearch = (query) => {
        console.log('📍 Events Page: handleSearch called with query:', query);
        setSearchQuery(query);
        let filtered = events;
        
        // Apply location filter first if active
        if (activeLocationFilter) {
            filtered = filtered.filter(event =>
                event.location?.toLowerCase().includes(activeLocationFilter.toLowerCase())
            );
        }
        
        // Then apply search query
        if (query && query.trim()) {
            console.log('📍 Events Page: Applying search filter for query:', query);
            const searchTerm = query.toLowerCase();
            filtered = filtered.filter(event => {
                return (
                    event.title?.toLowerCase().includes(searchTerm) ||
                    event.category?.toLowerCase().includes(searchTerm) ||
                    event.location?.toLowerCase().includes(searchTerm) ||
                    event.description?.toLowerCase().includes(searchTerm) ||
                    event.tags?.some(tag => tag?.toLowerCase().includes(searchTerm))
                );
            });
            console.log('📍 Events Page: Search results found:', filtered.length);
        }
        
        setFilteredEvents(filtered);
    };

    const handleClearLocationFilter = () => {
        setActiveLocationFilter(null);
        setSearchQuery('');
        setFilteredEvents(events);
    };

    const handleBookmark = (eventId) => {
        setFilteredEvents(prev => prev.map(e =>
            e.id === eventId ? { ...e, isBookmarked: !e.isBookmarked } : e
        ));
        setEvents(prev => prev.map(e =>
            e.id === eventId ? { ...e, isBookmarked: !e.isBookmarked } : e
        ));
    };

    const handleRegister = (eventId) => {
        console.log('Registering for event:', eventId);
        // Add registration logic here
    };

    if (loading) {
        return <LoadingSpinner message="Loading events..." />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 2, px: { xs: 1.5, sm: 2, md: 3 } }}>
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 0, fontSize: { xs: '18px', sm: '24px', md: '28px' } }}>
                        Upcoming Events {activeLocationFilter && `in ${activeLocationFilter}`}
                    </Typography>
                    <button
                        onClick={fetchEvents}
                        style={{
                            padding: '8px 14px',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        🔄 Refresh
                    </button>
                </Box>
                {activeLocationFilter && (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: { xs: '12px', sm: '14px' } }}>
                            📍 Showing events from <strong>{activeLocationFilter}</strong>
                        </Typography>
                        <button
                            onClick={handleClearLocationFilter}
                            style={{
                                padding: '6px 10px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '600',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Clear Filter
                        </button>
                    </Box>
                )}
                <SearchBar 
                    onSearch={handleSearch} 
                    placeholder="Search events by name, category or location..." 
                    initialValue={searchQuery}
                    availableEvents={events}
                />
            </Box>

            {error && (
                <Box sx={{ 
                    mb: 2, 
                    p: 2, 
                    backgroundColor: '#fee2e2', 
                    color: '#dc2626', 
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography>{error}</Typography>
                    <button
                        onClick={fetchEvents}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}
                    >
                        Retry
                    </button>
                </Box>
            )}

            {filteredEvents.length === 0 ? (
                <EmptyState
                    title="No Events Found"
                    description={searchQuery ? `No events match '${searchQuery}'` : 'No events available at the moment'}
                    actionText="Browse Categories"
                />
            ) : (
                <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                    {filteredEvents.map((event, index) => (
                        <Grid item xs={12} sm={6} lg={4} key={event.id}>
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

export default Events;