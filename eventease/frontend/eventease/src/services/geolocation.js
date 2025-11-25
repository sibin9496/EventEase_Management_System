// Geolocation service with multiple fallback options
export const geolocationService = {
    // Get current position with timeout and error handling
    getCurrentPosition: (options = {}) => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            const defaultOptions = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 600000, // 10 minutes
                ...options
            };

            navigator.geolocation.getCurrentPosition(resolve, reject, defaultOptions);
        });
    },

    // Reverse geocoding with multiple fallback services
    reverseGeocode: async (latitude, longitude) => {
        try {
            // Try BigDataCloud first
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );

            if (!response.ok) throw new Error('BigDataCloud API failed');

            const data = await response.json();

            return {
                name: data.city || data.locality || data.principalSubdivision || 'Unknown Location',
                city: data.city,
                state: data.principalSubdivision,
                country: data.countryName,
                countryCode: data.countryCode,
                latitude,
                longitude,
                type: 'current'
            };
        } catch (error) {
            console.warn('BigDataCloud failed, trying OpenStreetMap...', error);

            // Fallback to OpenStreetMap Nominatim
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
                );

                if (!response.ok) throw new Error('OpenStreetMap API failed');

                const data = await response.json();

                return {
                    name: data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown Location',
                    city: data.address.city || data.address.town || data.address.village,
                    state: data.address.state,
                    country: data.address.country,
                    countryCode: data.address.country_code,
                    latitude,
                    longitude,
                    type: 'current'
                };
            } catch (fallbackError) {
                console.error('All reverse geocoding services failed:', fallbackError);

                // Final fallback - return coordinates
                return {
                    name: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                    city: 'Unknown',
                    state: 'Unknown',
                    country: 'Unknown',
                    latitude,
                    longitude,
                    type: 'current'
                };
            }
        }
    },

    // Calculate distance between two coordinates (Haversine formula)
    calculateDistance: (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    }
};