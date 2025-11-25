// Get auth headers with token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const API_URL = '/api/subscriptions';

export const subscriptionService = {
    // Subscribe to newsletter
    subscribe: async (email, preferences = {}) => {
        try {
            const response = await fetch(`${API_URL}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    source: 'footer',
                    preferences: {
                        eventUpdates: preferences.eventUpdates !== false,
                        newEvents: preferences.newEvents !== false,
                        promotions: preferences.promotions !== false
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to subscribe');
            }

            return data;
        } catch (error) {
            console.error('Subscription error:', error);
            throw error;
        }
    },

    // Unsubscribe from newsletter
    unsubscribe: async (email) => {
        try {
            const response = await fetch(`${API_URL}/unsubscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to unsubscribe');
            }

            return data;
        } catch (error) {
            console.error('Unsubscription error:', error);
            throw error;
        }
    },

    // Get all subscribers (Admin only)
    getSubscribers: async (page = 1, limit = 20, search = '', filter = 'all') => {
        try {
            const params = new URLSearchParams({
                page,
                limit,
                search,
                filter
            });

            const response = await fetch(`${API_URL}?${params}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch subscribers');
            }

            return data;
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            throw error;
        }
    },

    // Get subscriber statistics (Admin only)
    getStats: async () => {
        try {
            const response = await fetch(`${API_URL}/stats`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch stats');
            }

            return data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    },

    // Delete a subscriber (Admin only)
    deleteSubscriber: async (subscriberId) => {
        try {
            const response = await fetch(`${API_URL}/${subscriberId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete subscriber');
            }

            return data;
        } catch (error) {
            console.error('Error deleting subscriber:', error);
            throw error;
        }
    },

    // Update subscriber (Admin only)
    updateSubscriber: async (subscriberId, updateData) => {
        try {
            const response = await fetch(`${API_URL}/${subscriberId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update subscriber');
            }

            return data;
        } catch (error) {
            console.error('Error updating subscriber:', error);
            throw error;
        }
    },

    // Export subscribers as CSV (Admin only)
    exportSubscribers: async () => {
        try {
            const response = await fetch(`${API_URL}/export/csv`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to export subscribers');
            }

            return response.blob();
        } catch (error) {
            console.error('Error exporting subscribers:', error);
            throw error;
        }
    }
};
