import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

export const useLocationContext = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocationContext must be used within a LocationProvider');
    }
    return context;
};

export const LocationProvider = ({ children }) => {
    const [selectedLocation, setSelectedLocationState] = useState(null);
    const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);
    
    const popularLocations = [
        { id: 1, name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
        { id: 2, name: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
        { id: 3, name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
        { id: 4, name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
        { id: 5, name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
        { id: 6, name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
        { id: 7, name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
        { id: 8, name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 }
    ];

    // Save to localStorage
    useEffect(() => {
        if (selectedLocation) {
            localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
        }
    }, [selectedLocation]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedLocation = localStorage.getItem('selectedLocation');
        if (savedLocation) {
            try {
                setSelectedLocationState(JSON.parse(savedLocation));
            } catch (error) {
                console.error('Error loading saved location:', error);
            }
        }
    }, []);

    const setLocation = (location) => {
        setSelectedLocationState(location);
        localStorage.setItem('selectedLocation', JSON.stringify(location));
        return Promise.resolve();
    };

    const getCurrentLocation = async () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not available'));
                return;
            }

            setIsLoadingCurrentLocation(true);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        
                        // Find nearest city from popularLocations
                        let nearestCity = popularLocations[0];
                        let minDistance = Infinity;

                        popularLocations.forEach(location => {
                            const distance = Math.sqrt(
                                Math.pow(location.lat - latitude, 2) + 
                                Math.pow(location.lng - longitude, 2)
                            );
                            if (distance < minDistance) {
                                minDistance = distance;
                                nearestCity = location;
                            }
                        });

                        const currentLocation = {
                            id: 'current',
                            name: nearestCity.name,
                            state: nearestCity.state,
                            lat: latitude,
                            lng: longitude,
                            isCurrentLocation: true
                        };

                        setSelectedLocationState(currentLocation);
                        setIsLoadingCurrentLocation(false);
                        resolve(currentLocation);
                    } catch (error) {
                        setIsLoadingCurrentLocation(false);
                        reject(error);
                    }
                },
                (error) => {
                    setIsLoadingCurrentLocation(false);
                    reject(new Error(`Geolocation error: ${error.message}`));
                }
            );
        });
    };

    const value = {
        selectedLocation,
        popularLocations,
        setLocation,
        getCurrentLocation,
        isLoadingCurrentLocation
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};
