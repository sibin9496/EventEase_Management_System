import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/events';
import { Icon } from '@mui/material';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const isClickingButton = useRef(false);

    // Handle responsive width changes
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSearch = async (value) => {
        console.log('🔍 SearchBar.handleSearch: Called with value:', value);
        setSearchQuery(value);

        if (value.trim().length === 0) {
            
            console.log(' SearchBar.handleSearch: Empty query, clearing suggestions');
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setLoading(true);
        try {
            console.log('🔍 SearchBar.handleSearch: Calling eventService.searchEvents...');
            // Pass search query parameter to backend API
            const response = await eventService.searchEvents(value);
            console.log('🔍 SearchBar.handleSearch: Response received:', response);
            
            if (!response) {
                console.error('❌ SearchBar.handleSearch: No response from API');
                setSuggestions([]);
                setShowSuggestions(true);
                setLoading(false);
                return;
            }
            
            // Handle different response formats
            const allEvents = response?.data || response?.events || response || [];
            console.log('🔍 SearchBar.handleSearch: Extracted events:', allEvents);
            console.log('🔍 SearchBar.handleSearch: Events count:', allEvents.length);
            
            // Use the search results directly from backend (already filtered)
            const suggestions = Array.isArray(allEvents) ? allEvents.slice(0, 5) : [];
            console.log('🔍 SearchBar.handleSearch: Sliced to 5 suggestions:', suggestions.length);
            
            // Ensure events have proper ID field for click handling
            suggestions.forEach((event, index) => {
                console.log(`🔍 SearchBar.handleSearch: Processing suggestion ${index}:`, {
                    title: event.title,
                    _id: event._id,
                    id: event.id
                });
                if (!event.id && event._id) {
                    event.id = event._id;
                    console.log(`🔍 SearchBar.handleSearch: Mapped _id to id for suggestion ${index}`);
                }
            });

            console.log('🔍 SearchBar.handleSearch: Final suggestions count:', suggestions.length);
            console.log('🔍 SearchBar.handleSearch: Event IDs:', suggestions.map(e => e._id || e.id).join(', '));
            setSuggestions(suggestions);
            setShowSuggestions(suggestions.length > 0 || value.trim().length > 0);
            console.log('🔍 SearchBar.handleSearch: Showing suggestions:', suggestions.length > 0);
        } catch (error) {
            console.error('❌ SearchBar.handleSearch: Error fetching events:', error);
            console.error('❌ SearchBar.handleSearch: Error message:', error.message);
            console.error('❌ SearchBar.handleSearch: Error stack:', error.stack);
            setSuggestions([]);
            setShowSuggestions(true);
        } finally {
            setLoading(false);
            console.log('🔍 SearchBar.handleSearch: Completed');
        }
    };

    const handleSelectSuggestion = (eventId) => {
        if (!eventId || eventId === 'undefined') {
            console.warn('❌ SearchBar: Cannot navigate - event ID is missing or invalid');
            console.warn('SearchBar: Event ID value:', eventId);
            return;
        }
        
        console.log('✅ SearchBar: Navigating to event detail');
        console.log('   Event ID:', eventId);
        console.log('   Navigation path: /events/' + eventId);
        
        // Clear state IMMEDIATELY before any navigation
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        
        // Small delay to ensure state is cleared before navigation
        setTimeout(() => {
            navigate(`/events/${eventId}`);
        }, 50);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        if (query) {
            console.log('🔍 SearchBar: Submitting search:', query);
            // Navigate to events page with search query
            const searchState = { 
                searchQuery: query,
                performSearch: true
            };
            console.log('🔍 SearchBar: Navigation state:', searchState);
            // Clear state IMMEDIATELY before navigation
            setSearchQuery('');
            setSuggestions([]);
            setShowSuggestions(false);
            // Navigate with state
            navigate('/events', { state: searchState });
        }
    };

    return (
        <div style={styles.container} ref={containerRef}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.searchWrapper}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search events by name, category, location..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => searchQuery && setShowSuggestions(true)}
                        onBlur={() => {
                            // Don't hide suggestions if a button is being clicked
                            if (!isClickingButton.current) {
                                setTimeout(() => setShowSuggestions(false), 150);
                            }
                            isClickingButton.current = false;
                        }}
                        style={styles.input}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                setSuggestions([]);
                                setShowSuggestions(false);
                            }}
                            style={styles.clearBtn}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && searchQuery && (
                    <div style={styles.suggestionsDropdown}>
                        {loading ? (
                            <div style={styles.suggestionItem}>⏳ Searching...</div>
                        ) : suggestions.length > 0 ? (
                            <>
                                {suggestions.map((event) => (
                                    <button
                                        key={event._id || event.id}
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            isClickingButton.current = true;
                                            const eventId = event._id || event.id;
                                            console.log('🖱️ Suggestion clicked, event:', eventId);
                                            if (!eventId) {
                                                console.warn('⚠️ Event ID missing in suggestion');
                                                isClickingButton.current = false;
                                                return;
                                            }
                                            handleSelectSuggestion(eventId);
                                        }}
                                        style={styles.suggestionItem}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <span style={styles.suggestionIcon}>📍</span>
                                        <div style={styles.suggestionContent}>
                                            <div style={styles.suggestionTitle}>{event.title}</div>
                                            <div style={styles.suggestionCategory}>
                                                {event.category} • {event.location}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                                <button
                                    type="submit"
                                    style={styles.viewAllBtn}
                                >
                                    View all results →
                                </button>
                            </>
                        ) : (
                            <div style={styles.suggestionItem}>
                                No events found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
        '@media (maxWidth: 768px)': {
            maxWidth: '100%'
        }
    },
    form: {
        width: '100%'
    },
    searchWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '25px',
        padding: '0 15px',
        border: '2px solid transparent',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    },
    searchIcon: {
        fontSize: '18px',
        marginRight: '10px',
        color: '#666'
    },
    input: {
        flex: 1,
        border: 'none',
        backgroundColor: 'transparent',
        padding: '12px 0',
        fontSize: '14px',
        outline: 'none',
        color: '#333',
        fontFamily: 'inherit'
    },
    clearBtn: {
        background: 'none',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        color: '#999',
        padding: '0 5px',
        transition: 'color 0.2s ease'
    },
    suggestionsDropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: '12px',
        marginTop: '8px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        maxHeight: '400px',
        overflowY: 'auto'
    },
    suggestionItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'background-color 0.2s ease',
        borderBottom: '1px solid #f0f0f0',
        pointerEvents: 'auto',
        userSelect: 'none'
    },
    suggestionIcon: {
        fontSize: '16px',
        marginRight: '12px'
    },
    suggestionContent: {
        flex: 1,
        minWidth: 0
    },
    suggestionTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#333',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    suggestionCategory: {
        fontSize: '12px',
        color: '#999',
        marginTop: '4px'
    },
    viewAllBtn: {
        width: '100%',
        padding: '12px 16px',
        border: 'none',
        backgroundColor: '#f8f9fa',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        color: '#2563eb',
        transition: 'background-color 0.2s ease'
    }
};

export default SearchBar;
