import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/events';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const suggestionsRef = useRef(null);
    const hideTimeoutRef = useRef(null);

    // Clear hide timeout on component unmount
    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

    const handleSearch = async (value) => {
        console.log('🔍 SearchBar: Search input changed:', value);
        setSearchQuery(value);

        // Clear any pending hide timeout
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }

        if (value.trim().length === 0) {
            console.log('🔍 SearchBar: Empty query, clearing suggestions');
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setLoading(true);
        try {
            console.log('🔍 SearchBar: Fetching events for query:', value);
            const response = await eventService.searchEvents(value);
            console.log('🔍 SearchBar: Response received:', response);
            
            if (!response) {
                console.warn('⚠️ SearchBar: No response from API');
                setSuggestions([]);
                setShowSuggestions(false);
                setLoading(false);
                return;
            }
            
            // Extract events from response
            const allEvents = response?.data || response?.events || response || [];
            console.log('🔍 SearchBar: Found events:', allEvents.length);
            
            if (!Array.isArray(allEvents)) {
                console.warn('⚠️ SearchBar: Response data is not an array:', allEvents);
                setSuggestions([]);
                setShowSuggestions(false);
                setLoading(false);
                return;
            }
            
            // Limit to top 5 results
            const topResults = allEvents.slice(0, 5);
            console.log('🔍 SearchBar: Showing top', topResults.length, 'results');
            
            setSuggestions(topResults);
            setShowSuggestions(true);
        } catch (error) {
            console.error('❌ SearchBar: Error searching events:', error);
            setSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSuggestion = (event) => {
        if (!event) {
            console.warn('⚠️ SearchBar: Event object is missing');
            return;
        }

        const eventId = event._id || event.id;
        console.log('🖱️ SearchBar: Suggestion clicked');
        console.log('   Event:', event.title);
        console.log('   Event ID (_id):', event._id);
        console.log('   Event ID (id):', event.id);
        console.log('   Using ID:', eventId);

        if (!eventId) {
            console.error('❌ SearchBar: No event ID found');
            return;
        }

        // Clear suggestions and search
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);

        console.log('✅ SearchBar: Navigating to /events/' + eventId);
        // Navigate to event details
        navigate(`/events/${eventId}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        
        if (query) {
            console.log('🔍 SearchBar: Form submitted with query:', query);
            
            // Clear suggestions
            setSuggestions([]);
            setShowSuggestions(false);
            
            // Navigate to events page with search
            navigate('/events', { state: { searchQuery: query } });
        }
    };

    return (
        <div style={styles.container} ref={suggestionsRef}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.searchWrapper}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => {
                            console.log('🔍 SearchBar: Input focused');
                            if (suggestions.length > 0) {
                                setShowSuggestions(true);
                            }
                        }}
                        onBlur={() => {
                            console.log('🔍 SearchBar: Input blurred');
                            // Delay hiding suggestions to allow click to register
                            hideTimeoutRef.current = setTimeout(() => {
                                console.log('🔍 SearchBar: Hiding suggestions after blur');
                                setShowSuggestions(false);
                            }, 300);
                        }}
                        style={styles.input}
                        autoComplete="off"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => {
                                console.log('🔍 SearchBar: Clear button clicked');
                                setSearchQuery('');
                                setSuggestions([]);
                                setShowSuggestions(false);
                            }}
                            style={styles.clearBtn}
                            onMouseDown={(e) => e.preventDefault()}
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
                                        key={event._id || event.id || event.title}
                                        type="button"
                                        onClick={(e) => {
                                            console.log('🖱️ SearchBar: Suggestion button clicked:', event.title);
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSelectSuggestion(event);
                                        }}
                                        onMouseDown={(e) => {
                                            console.log('🖱️ SearchBar: Suggestion mouse down');
                                            e.preventDefault();
                                        }}
                                        style={styles.suggestionItem}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
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
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    View all results →
                                </button>
                            </>
                        ) : (
                            <div style={styles.suggestionItem}>
                                No events found for "{searchQuery}"
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
