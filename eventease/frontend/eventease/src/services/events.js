// Get auth headers with token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// API Base URL - use /api proxy for development
const API_URL = '/api';

// Events service - all methods properly exported
export const eventService = {
    // Get all events
    getEvents: async () => {
        try {
            console.log('📡 Fetching events from:', `${API_URL}/events`);
            const response = await fetch(`${API_URL}/events`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            console.log('📊 Events response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Events error response:', errorData);
                throw new Error('Failed to fetch events');
            }

            const data = await response.json();
            console.log('✅ Events fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Error fetching events:', error);
            throw error;
        }
    },

    // Search events by query parameter
    searchEvents: async (searchQuery) => {
        try {
            const encodedQuery = encodeURIComponent(searchQuery);
            console.log('📡 EventService: Searching events with query:', searchQuery);
            const response = await fetch(`${API_URL}/events?search=${encodedQuery}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            console.log('📊 EventService: Search response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ EventService: Search error response:', errorData);
                throw new Error('Failed to search events');
            }

            const data = await response.json();
            console.log('✅ EventService: Search results fetched successfully');
            console.log('   - Response format keys:', Object.keys(data || {}));
            console.log('   - Data array:', Array.isArray(data?.data) ? `${data.data.length} items` : 'Not an array');
            console.log('   - Raw response:', data);
            return data;
        } catch (error) {
            console.error('❌ EventService: Error searching events:', error);
            throw error;
        }
    },
    
    // Get single event
    getEvent: async (id) => {
        try {
            // Don't fetch if ID is undefined
            if (!id || id === 'undefined') {
                throw new Error('Event ID is required');
            }

            console.log('📡 Fetching event:', id);
            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            console.log('📊 Event response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Event error response:', errorData);
                throw new Error('Failed to fetch event');
            }

            const data = await response.json();
            console.log('✅ Event fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Error fetching event:', error);
            throw error;
        }
    },
    
    // Create new event
    createEvent: async (eventData) => {
        try {
            const response = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create event');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    },
    
    // Get user's events
    getMyEvents: async () => {
        try {
            const response = await fetch(`${API_URL}/events/user/my-events`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch your events');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },

    // Update event
    updateEvent: async (id, eventData) => {
        try {
            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update event');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    },

    // Delete event
    deleteEvent: async (id) => {
        try {
            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    },

    // Register for event
    registerForEvent: async (id) => {
        try {
            const response = await fetch(`${API_URL}/events/${id}/register`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to register for event');
            }

            return await response.json();
        } catch (error) {
            console.error('Error registering for event:', error);
            throw error;
        }
    },

    // Unregister from event
    unregisterFromEvent: async (id) => {
        try {
            const response = await fetch(`${API_URL}/events/${id}/unregister`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to unregister from event');
            }

            return await response.json();
        } catch (error) {
            console.error('Error unregistering from event:', error);
            throw error;
        }
    },

    // Check if user is registered
    isUserRegistered: async (id) => {
        try {
            const response = await fetch(`${API_URL}/events/${id}/is-registered`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to check registration');
            }

            return await response.json();
        } catch (error) {
            console.error('Error checking registration:', error);
            throw error;
        }
    },

    // Get user's registered events
    getRegisteredEvents: async () => {
        try {
            const response = await fetch(`${API_URL}/events/user/registered-events`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch registered events');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching registered events:', error);
            throw error;
        }
    },

    // Add event to favorites
    favoriteEvent: async (eventId) => {
        try {
            console.log('📡 Adding event to favorites:', eventId);
            const response = await fetch(`${API_URL}/events/${eventId}/favorite`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const data = await response.json();
                console.error('❌ Favorite error:', data);
                throw new Error(data.message || 'Failed to add to favorites');
            }

            const data = await response.json();
            console.log('✅ Event added to favorites:', data);
            return data;
        } catch (error) {
            console.error('❌ Error adding to favorites:', error);
            throw error;
        }
    },

    // Remove event from favorites
    unfavoriteEvent: async (eventId) => {
        try {
            console.log('📡 Removing event from favorites:', eventId);
            const response = await fetch(`${API_URL}/events/${eventId}/favorite`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const data = await response.json();
                console.error('❌ Unfavorite error:', data);
                throw new Error(data.message || 'Failed to remove from favorites');
            }

            const data = await response.json();
            console.log('✅ Event removed from favorites:', data);
            return data;
        } catch (error) {
            console.error('❌ Error removing from favorites:', error);
            throw error;
        }
    },

    // Get user's favorite events
    getUserFavorites: async () => {
        try {
            console.log('📡 Fetching user favorites...');
            const response = await fetch(`${API_URL}/events/user/favorites`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to fetch favorites');
            }

            const data = await response.json();
            console.log('✅ Favorites fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Error fetching favorites:', error);
            throw error;
        }
    },

    // Check if event is favorited by current user
    isFavorite: async (eventId) => {
        try {
            const response = await fetch(`${API_URL}/events/${eventId}/is-favorite`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to check favorite status');
            }

            return await response.json();
        } catch (error) {
            console.error('Error checking favorite status:', error);
            throw error;
        }
    }
};