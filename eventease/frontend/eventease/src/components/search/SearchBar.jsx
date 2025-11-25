import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    InputBase,
    IconButton,
    Paper,
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
} from '@mui/material';
import {
    Search,
    Close,
    Event,
    LocationOn,
} from '@mui/icons-material';

const SearchBar = ({ onSearch, placeholder = "Search events, categories...", initialValue = '', availableEvents = [] }) => {
    const [searchQuery, setSearchQuery] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            onSearch(searchQuery);
            setIsFocused(false);
        }
    };

    const handleSelectSuggestion = (event) => {
        console.log('🔍 Search/SearchBar: Suggestion clicked:', event);
        
        // Validate event ID
        const eventId = event._id || event.id;
        if (!eventId || eventId === 'undefined') {
            console.warn('❌ Search/SearchBar: Cannot navigate - event ID is missing');
            return;
        }

        console.log('✅ Search/SearchBar: Navigating to event detail:', eventId);
        
        // Clear state before navigation
        setSearchQuery('');
        setIsFocused(false);
        
        // Small delay to ensure state is cleared
        setTimeout(() => {
            navigate(`/events/${eventId}`);
        }, 50);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setIsFocused(false);
    };

    // Generate search results from available events
    const searchResults = useMemo(() => {
        if (!searchQuery.trim() || !availableEvents.length) {
            return [];
        }
        
        const query = searchQuery.toLowerCase();
        return availableEvents
            .filter(event =>
                event.title?.toLowerCase().includes(query) ||
                event.category?.toLowerCase().includes(query) ||
                event.location?.toLowerCase().includes(query) ||
                event.description?.toLowerCase().includes(query)
            )
            .slice(0, 5)
            .map(event => {
                const eventId = event._id || event.id;
                return {
                    _id: eventId,
                    id: eventId,
                    title: event.title,
                    category: event.category,
                    location: event.location
                };
            });
    }, [searchQuery, availableEvents]);

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            <Paper
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'grey.50',
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    border: '1px solid',
                    borderColor: isFocused ? 'primary.main' : 'grey.200',
                    boxShadow: isFocused ? '0 0 0 2px rgba(124, 58, 237, 0.1)' : 'none',
                    transition: 'all 0.2s ease-in-out',
                }}
            >
                <Search sx={{ color: 'grey.500', mr: 1, fontSize: 20 }} />
                <InputBase
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    sx={{
                        color: 'grey.900',
                        flex: 1,
                        '& .MuiInputBase-input': {
                            color: 'grey.900',
                            '&::placeholder': {
                                color: 'grey.500',
                            },
                        },
                    }}
                />
                {searchQuery && (
                    <IconButton
                        size="small"
                        onClick={clearSearch}
                        sx={{ color: 'grey.500' }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                )}
            </Paper>

            {/* Search Results Dropdown */}
            {isFocused && searchQuery && (
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        mt: 1,
                        backgroundColor: 'white',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        borderRadius: 2,
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        maxHeight: 400,
                        overflow: 'auto',
                    }}
                >
                    <List>
                        {searchResults.length > 0 ? (
                            <>
                                <ListItem>
                                    <Typography variant="subtitle2" color="grey.600" sx={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 700 }}>
                                        Suggested Events
                                    </Typography>
                                </ListItem>
                                <Divider />
                                {searchResults.map((result) => (
                                    <ListItem
                                        key={result.id}
                                        button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSelectSuggestion(result);
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'grey.50',
                                            },
                                        }}
                                    >
                                        <Event sx={{ color: 'primary.main', mr: 2, fontSize: 20 }} />
                                        <ListItemText
                                            primary={result.title}
                                            secondary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '12px' }}>
                                                    <span>{result.category}</span>
                                                    {result.location && (
                                                        <>
                                                            <span>•</span>
                                                            <LocationOn sx={{ fontSize: '12px' }} />
                                                            <span>{result.location}</span>
                                                        </>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </>
                        ) : (
                            <ListItem>
                                <ListItemText
                                    primary={`No events found matching "${searchQuery}"`}
                                    sx={{ color: 'grey.500', textAlign: 'center', py: 2 }}
                                />
                            </ListItem>
                        )}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default SearchBar;