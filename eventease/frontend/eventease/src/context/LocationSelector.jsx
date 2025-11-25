// src/contexts/LocationContext.jsx
import React, { createContext, useState, useContext } from 'react';

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

    const value = {
        selectedLocation,
        setSelectedLocation
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};

export default LocationContext;