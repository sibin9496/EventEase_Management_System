import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  Tooltip
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import { useLocationContext } from '../../context/LocationContext';

const CurrentLocationButton = ({ variant = 'contained', size = 'medium', fullWidth = false }) => {
  const { getCurrentLocation, setLocation } = useLocationContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const handleGetLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use browser geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = {
              id: Date.now(),
              name: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
              state: 'Current',
              latitude,
              longitude
            };
            setCurrentLocation(location);
            setLocation(location);
            setLoading(false);
          },
          (err) => {
            setError(err.message);
            setLoading(false);
          }
        );
      } else {
        setError('Geolocation not supported by your browser');
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error('Location error:', error);
    }
  };

  const isLocationDenied = error && error.includes('denied');

  return (
    <Tooltip title={error ? error : 'Get your current location'}>
      <span>
        <Button
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          onClick={handleGetLocation}
          disabled={loading || isLocationDenied}
          startIcon={loading ? <CircularProgress size={20} /> : <MyLocationIcon />}
          color={currentLocation ? 'success' : 'primary'}
        >
          {loading ? 'Detecting...' : currentLocation ? 'Location Found' : 'Use Current Location'}
        </Button>
      </span>
    </Tooltip>
  );
};

export default CurrentLocationButton;