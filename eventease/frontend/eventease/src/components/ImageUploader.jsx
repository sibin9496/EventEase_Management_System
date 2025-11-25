import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    CircularProgress,
    Alert,
    Tab,
    Tabs,
    Paper,
    Grid,
    Card,
    CardMedia,
    Typography
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkIcon from '@mui/icons-material/Link';

const ImageUploader = ({ open, onClose, onSave, currentImage, eventTitle }) => {
    const [imageUrl, setImageUrl] = useState(currentImage || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [imagePreview, setImagePreview] = useState(currentImage || '');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setError('');
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setImageUrl(url);
        if (url) {
            setImagePreview(url);
        }
    };

    const validateImageUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSave = async () => {
        if (!imageUrl.trim()) {
            setError('Please provide an image URL');
            return;
        }

        if (!validateImageUrl(imageUrl)) {
            setError('Please enter a valid image URL');
            return;
        }

        setLoading(true);
        try {
            await onSave(imageUrl);
            setImageUrl('');
            setImagePreview('');
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to update image');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setImageUrl('');
        setImagePreview('');
        setError('');
        setTabValue(0);
        onClose();
    };

    const suggestedImages = [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop'
    ];

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle>
                Update Event Image
                {eventTitle && <Typography variant="body2" color="textSecondary">{eventTitle}</Typography>}
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                    <Tab label="URL" icon={<LinkIcon />} iconPosition="start" />
                    <Tab label="Suggestions" icon={<CloudUploadIcon />} iconPosition="start" />
                </Tabs>

                {tabValue === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Image URL"
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl}
                            onChange={handleUrlChange}
                            disabled={loading}
                            variant="outlined"
                        />
                        
                        {imagePreview && (
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Preview:
                                </Typography>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="250"
                                        image={imagePreview}
                                        alt="Preview"
                                        sx={{ objectFit: 'cover' }}
                                        onError={() => {
                                            setError('Image URL is not accessible or invalid');
                                            setImagePreview('');
                                        }}
                                    />
                                </Card>
                            </Box>
                        )}
                    </Box>
                )}

                {tabValue === 1 && (
                    <Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            Select from suggested images:
                        </Typography>
                        <Grid container spacing={1}>
                            {suggestedImages.map((img, index) => (
                                <Grid item xs={6} key={index}>
                                    <Card
                                        onClick={() => {
                                            setImageUrl(img);
                                            setImagePreview(img);
                                            setTabValue(0);
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            border: imageUrl === img ? '3px solid #1976d2' : '1px solid #ddd',
                                            '&:hover': {
                                                boxShadow: 3,
                                                transform: 'scale(1.02)'
                                            }
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="120"
                                            image={img}
                                            alt={`Suggestion ${index + 1}`}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={handleCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading || !imageUrl.trim()}
                    startIcon={loading ? <CircularProgress size={20} /> : undefined}
                >
                    {loading ? 'Updating...' : 'Update Image'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImageUploader;
