import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
    Alert,
    CircularProgress,
    Avatar,
    IconButton,
    Dialog,
    Slider
} from '@mui/material';
import {
    PhotoCamera,
    Close
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const AccountSettings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [showPhotoEditor, setShowPhotoEditor] = useState(false);
    const [photoCrop, setPhotoCrop] = useState({ scale: 1 });
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

    // Fetch settings on mount
    useEffect(() => {
        fetchProfilePhoto();
        setLoading(false);
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setErrorMessage('Please login to access settings');
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/users/settings`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setErrorMessage('Session expired. Please login again.');
                }
                setLoading(false);
                return;
            }

            const data = await response.json();
            if (data.settings) {
                if (data.settings.emailNotifications) {
                    setEmailNotifications(data.settings.emailNotifications);
                }
                if (data.settings.privacy) {
                    setPrivacySettings(data.settings.privacy);
                }
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProfilePhoto = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !user?.id) return;

            const response = await fetch(`/api/users/photo/${user.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.profilePhoto) {
                    setProfilePhoto(data.profilePhoto);
                }
            }
        } catch (err) {
            console.error('Error fetching profile photo:', err);
        }
    };

    // Handle photo selection
    const handlePhotoSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setPhotoPreview(event.target.result);
            setShowPhotoEditor(true);
        };
        reader.readAsDataURL(file);
    };

    // Handle photo upload with crop
    const handlePhotoUpload = async () => {
        try {
            setUploadingPhoto(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setErrorMessage('Please login to upload photo');
                return;
            }

            // Create canvas for cropped image
            if (canvasRef.current && photoPreview) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                img.onload = async () => {
                    const size = Math.min(img.width, img.height);
                    const x = (img.width - size) / 2;
                    const y = (img.height - size) / 2;
                    
                    canvas.width = 400;
                    canvas.height = 400;
                    ctx.drawImage(img, x, y, size, size, 0, 0, 400, 400);
                    
                    canvas.toBlob(async (blob) => {
                        const formData = new FormData();
                        formData.append('photo', blob, 'profile-photo.jpg');

                        const response = await fetch(`${API_BASE_URL}/users/upload-photo`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            body: formData
                        });

                        if (response.ok) {
                            const data = await response.json();
                            setProfilePhoto(data.profilePhoto);
                            setSuccessMessage('✅ Profile photo updated successfully!');
                            setShowPhotoEditor(false);
                            setPhotoPreview(null);
                            setTimeout(() => setSuccessMessage(''), 3000);
                        } else {
                            const error = await response.json();
                            setErrorMessage(error.message || 'Failed to upload photo');
                        }
                    }, 'image/jpeg', 0.9);
                };
                img.src = photoPreview;
            }
        } catch (error) {
            console.error('Photo upload error:', error);
            setErrorMessage('Error uploading photo: ' + error.message);
        } finally {
            setUploadingPhoto(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Alerts */}
            {successMessage && (
                <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ mb: 3 }}>
                    {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ mb: 3 }}>
                    {errorMessage}
                </Alert>
            )}

            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Account Settings
            </Typography>

            {/* Profile Photo Section */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhotoCamera /> Profile Photo
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar
                            src={profilePhoto || user?.avatar}
                            sx={{
                                width: 120,
                                height: 120,
                                fontSize: '3rem'
                            }}
                        >
                            {user?.name?.charAt(0)}
                        </Avatar>

                        <Box>
                            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                Upload a profile photo (JPG, PNG, GIF up to 5MB)
                            </Typography>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoSelect}
                                style={{ display: 'none' }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<PhotoCamera />}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingPhoto}
                            >
                                {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Photo Editor Dialog */}
            <Dialog
                open={showPhotoEditor}
                onClose={() => setShowPhotoEditor(false)}
                maxWidth="sm"
                fullWidth
                disableEnforceFocus
            >
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Adjust Profile Photo</Typography>
                        <IconButton onClick={() => setShowPhotoEditor(false)}>
                            <Close />
                        </IconButton>
                    </Box>

                    {photoPreview && (
                        <Box sx={{ mb: 2 }}>
                            <img
                                src={photoPreview}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    maxHeight: '300px',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                    transform: `scale(${photoCrop.scale})`
                                }}
                            />
                        </Box>
                    )}

                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Zoom
                    </Typography>
                    <Slider
                        min={1}
                        max={3}
                        step={0.1}
                        value={photoCrop.scale}
                        onChange={(e, value) => setPhotoCrop({ scale: value })}
                        sx={{ mb: 3 }}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setShowPhotoEditor(false)}
                            fullWidth
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handlePhotoUpload}
                            disabled={uploadingPhoto}
                            fullWidth
                        >
                            {uploadingPhoto ? 'Uploading...' : 'Save Photo'}
                        </Button>
                    </Box>
                </Box>
            </Dialog>

            {/* Hidden Canvas for Image Processing */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Container>
    );
};

export default AccountSettings;
