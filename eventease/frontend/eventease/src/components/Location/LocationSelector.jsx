import React, { createContext, useState, useContext, useEffect } from 'react';
import { geolocationService } from '../services/geolocation';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [popularLocations, setPopularLocations] = useState([]);
  const [recentLocations, setRecentLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [permission, setPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'

  // Check geolocation permission on mount
  useEffect(() => {
    checkGeolocationPermission();
    loadSavedData();
  }, []);

  const checkGeolocationPermission = async () => {
    if (!navigator.permissions) {
      return; // Permissions API not supported
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermission(result.state);
      
      result.onchange = () => {
        setPermission(result.state);
      };
    } catch (error) {
      console.warn('Permission API not supported:', error);
    }
  };

  const loadSavedData = () => {
    // Load selected location
    try {
      const saved = localStorage.getItem('selectedLocation');
      if (saved) {
        setSelectedLocation(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load saved location:', error);
    }

    // Load recent locations
    try {
      const saved = localStorage.getItem('recentLocations');
      if (saved) {
        setRecentLocations(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load recent locations:', error);
    }

    // Load popular locations
    loadPopularLocations();
  };

  const loadPopularLocations = () => {
    const popular = [
      { id: 1, name: 'Mumbai', city: 'Mumbai', state: 'Maharashtra', country: 'India', type: 'city' },
      { id: 2, name: 'Delhi', city: 'Delhi', state: 'Delhi', country: 'India', type: 'city' },
      { id: 3, name: 'Bangalore', city: 'Bangalore', state: 'Karnataka', country: 'India', type: 'city' },
      { id: 4, name: 'Hyderabad', city: 'Hyderabad', state: 'Telangana', country: 'India', type: 'city' },
      { id: 5, name: 'Chennai', city: 'Chennai', state: 'Tamil Nadu', country: 'India', type: 'city' },
      { id: 6, name: 'Kolkata', city: 'Kolkata', state: 'West Bengal', country: 'India', type: 'city' },
    ];
    setPopularLocations(popular);
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError('');

    try {
      // Get coordinates
      const position = await geolocationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // Reverse geocode to get location details
      const locationDetails = await geolocationService.reverseGeocode(latitude, longitude);

      const location = {
        id: `current-${Date.now()}`,
        ...locationDetails,
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      };

      setCurrentLocation(location);
      setSelectedLocation(location);
      
      // Add to recent locations
      addToRecentLocations(location);
      
      // Save to localStorage
      localStorage.setItem('selectedLocation', JSON.stringify(location));

      return location;
    } catch (error) {
      let errorMessage = 'Failed to get current location';
      
      if (error.code === 1) {
        errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
        setPermission('denied');
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable. Please check your connection and try again.';
      } else if (error.code === 3) {
        errorMessage = 'Location request timed out. Please try again.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const setLocation = (location) => {
    setSelectedLocation(location);
    localStorage.setItem('selectedLocation', JSON.stringify(location));
    addToRecentLocations(location);
  };

  const addToRecentLocations = (location) => {
    setRecentLocations(prev => {
      const filtered = prev.filter(loc => loc.id !== location.id);
      const updated = [location, ...filtered].slice(0, 5);
      localStorage.setItem('recentLocations', JSON.stringify(updated));
      return updated;
    });
  };

  const clearError = () => setError('');
  const clearCurrentLocation = () => setCurrentLocation(null);

  const value = {
    // State
    selectedLocation,
    currentLocation,
    popularLocations,
    recentLocations,
    loading,
    error,
    permission,
    
    // Actions
    setLocation,
    getCurrentLocation,
    clearError,
    clearCurrentLocation,
    
    // Utilities
    hasLocationAccess: permission === 'granted',
    isLocationDenied: permission === 'denied'
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;