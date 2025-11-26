// Get auth headers with token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// API Base URL - use /api proxy for development
import { API_BASE_URL } from '../config/api.js';

// Build API URL
const getApiUrl = (endpoint) => {
    const baseUrl = API_BASE_URL || '/api';
    return `${baseUrl}${endpoint}`;
};

// Registration service for handling event registrations
export const registrationService = {
    // Register for event with ticket details
    registerForEventWithTicket: async (eventId, ticketData) => {
        try {
            const response = await fetch(getApiUrl('/registrations/register'), {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    eventId,
                    ...ticketData
                })
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

    // Get user registrations
    getUserRegistrations: async () => {
        try {
            const response = await fetch(getApiUrl('/registrations/my-registrations'), {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch registrations');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching registrations:', error);
            throw error;
        }
    },

    // Get registration by ID
    getRegistration: async (registrationId) => {
        try {
            const response = await fetch(getApiUrl(`/registrations/${registrationId}`), {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch registration');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching registration:', error);
            throw error;
        }
    },

    // Cancel registration
    cancelRegistration: async (registrationId) => {
        try {
            const response = await fetch(getApiUrl(`/registrations/${registrationId}`), {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to cancel registration');
            }

            return await response.json();
        } catch (error) {
            console.error('Error canceling registration:', error);
            throw error;
        }
    },

    // Update registration
    updateRegistration: async (registrationId, updateData) => {
        try {
            const response = await fetch(getApiUrl(`/registrations/${registrationId}`), {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update registration');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating registration:', error);
            throw error;
        }
    },

    // Check if user is already registered for event
    isUserRegisteredForEvent: async (eventId) => {
        try {
            const response = await fetch(getApiUrl(`/registrations/check/${eventId}`), {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to check registration status');
            }

            return await response.json();
        } catch (error) {
            console.error('Error checking registration status:', error);
            throw error;
        }
    },

    // Get event registrations count
    getEventRegistrationsCount: async (eventId) => {
        try {
            const response = await fetch(getApiUrl(`/registrations/event/${eventId}/count`), {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch registrations count');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching registrations count:', error);
            throw error;
        }
    }
};
