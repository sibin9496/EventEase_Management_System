import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CardActionArea,
    Grid,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip
} from '@mui/material';
import {
    LocationOn,
    MyLocation,
    Search as SearchIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { useLocationContext } from '../context/LocationContext';
import CurrentLocationButton from '../components/Location/CurrentLocationButton';

const LocationPage = () => {
    const { selectedLocation, popularLocations, setLocation } = useLocationContext();
    const [openDialog, setOpenDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [customLocation, setCustomLocation] = useState('');

    const handleLocationSelect = (location) => {
        setLocation(location);
    };

    const handleCustomLocation = () => {
        if (customLocation.trim()) {
            setLocation({ id: Date.now(), name: customLocation, state: 'Custom' });
            setCustomLocation('');
            setOpenDialog(false);
        }
    };

    const filteredLocations = popularLocations.filter(loc =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                    Select Your Location
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Find and manage events based on your location preferences
                </Typography>
            </Box>

            {/* Current Location Card */}
            <Card sx={{ mb: 4, bgcolor: 'primary.50', border: '2px solid', borderColor: 'primary.light' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Current Location
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {selectedLocation?.name || 'Not Selected'}
                            </Typography>
                        </Box>
                        <CurrentLocationButton />
                    </Box>
                </CardContent>
            </Card>

            {/* Popular Locations Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Popular Locations
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Add Custom Location
                    </Button>
                </Box>

                {/* Search Filter */}
                <TextField
                    fullWidth
                    placeholder="Search locations..."
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 3 }}
                />

                {/* Locations Grid */}
                <Grid container spacing={3}>
                    {filteredLocations.map((location) => (
                        <Grid item xs={12} sm={6} md={4} key={location.id}>
                            <Card
                                sx={{
                                    transition: 'all 0.3s',
                                    cursor: 'pointer',
                                    border: selectedLocation?.id === location.id ? '2px solid' : '1px solid',
                                    borderColor: selectedLocation?.id === location.id ? 'primary.main' : 'grey.200',
                                    bgcolor: selectedLocation?.id === location.id ? 'primary.50' : 'white',
                                    '&:hover': {
                                        boxShadow: 3,
                                        transform: 'translateY(-4px)'
                                    }
                                }}
                            >
                                <CardActionArea
                                    onClick={() => handleLocationSelect(location)}
                                    sx={{ p: 3, minHeight: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <LocationOn color="primary" sx={{ fontSize: 32 }} />
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {location.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {location.state}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {selectedLocation?.id === location.id && (
                                        <Chip
                                            label="Selected"
                                            color="primary"
                                            size="small"
                                            sx={{ alignSelf: 'flex-start', mt: 1 }}
                                        />
                                    )}
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {filteredLocations.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">
                            No locations found matching your search
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Custom Location Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Add Custom Location
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Location Name"
                        placeholder="Enter location name"
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCustomLocation}
                        disabled={!customLocation.trim()}
                    >
                        Add Location
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default LocationPage;