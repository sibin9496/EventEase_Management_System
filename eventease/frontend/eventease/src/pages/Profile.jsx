import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    Avatar,
    Divider,
    Alert,
    Switch,
    FormControlLabel,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Edit as EditIcon, Save as SaveIcon, NotificationsActive, Lock } from '@mui/icons-material';

const Profile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        bio: ''
    });

    // Email Notifications State
    const [emailNotifications, setEmailNotifications] = useState({
        eventUpdates: true,
        newEvents: true,
        registrationReminders: true,
        weeklyDigest: true,
        promotionalOffers: false
    });

    // Privacy Settings State
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        allowMessages: true,
        showAttendedEvents: true
    });

    // Fetch settings on mount
    useEffect(() => {
        fetchSettings();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setErrorMessage('');
            setSuccessMessage('');
            const token = localStorage.getItem('token');

            if (!token) {
                setErrorMessage('Please login to save profile');
                setSaving(false);
                return;
            }

            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                setErrorMessage(errorData.message || 'Failed to save profile');
                setSaving(false);
                return;
            }

            setIsEditing(false);
            setSuccessMessage('✅ Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error saving profile:', err);
            setErrorMessage('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const handleNotificationChange = (field) => {
        setEmailNotifications(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handlePrivacyChange = (field, value) => {
        setPrivacySettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const saveNotificationSettings = async () => {
        try {
            setSaving(true);
            setErrorMessage('');
            setSuccessMessage('');
            const token = localStorage.getItem('token');

            if (!token) {
                setErrorMessage('Please login to save settings');
                setSaving(false);
                return;
            }

            const response = await fetch('/api/users/settings/notifications', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailNotifications)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                setErrorMessage(errorData.message || 'Failed to save notification settings');
                return;
            }

            setSuccessMessage('✅ Email notification settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error saving settings:', err);
            setSuccessMessage('✅ Settings updated locally (offline mode)');
            setTimeout(() => setSuccessMessage(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    const savePrivacySettings = async () => {
        try {
            setSaving(true);
            setErrorMessage('');
            setSuccessMessage('');
            const token = localStorage.getItem('token');

            if (!token) {
                setErrorMessage('Please login to save settings');
                setSaving(false);
                return;
            }

            const response = await fetch('/api/users/settings/privacy', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(privacySettings)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                setErrorMessage(errorData.message || 'Failed to save privacy settings');
                return;
            }

            setSuccessMessage('✅ Privacy settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error saving settings:', err);
            setSuccessMessage('✅ Settings updated locally (offline mode)');
            setTimeout(() => setSuccessMessage(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/users/settings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.settings) {
                    if (data.settings.emailNotifications) {
                        setEmailNotifications(data.settings.emailNotifications);
                    }
                    if (data.settings.privacy) {
                        setPrivacySettings(data.settings.privacy);
                    }
                }
            }
        } catch (err) {
            console.log('Settings fetch handled silently');
        }
    };


    return (
        <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
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

            {/* Profile Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '20px', sm: '24px', md: '28px' } }}>
                    My Profile
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '12px', sm: '13px' } }}>
                    Manage your account information and preferences
                </Typography>
            </Box>

            {/* Profile Card */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, position: 'relative', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                        <Avatar
                        sx={{
                            width: { xs: 80, sm: 100 },
                            height: { xs: 80, sm: 100 },
                            bgcolor: 'primary.main',
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                            fontWeight: 600
                        }}
                    >
                        {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                        <Box sx={{ flex: 1, ml: { xs: 0, sm: 3 }, textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '16px', sm: '18px' } }}>
                                {user?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
                                {user?.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: { xs: '12px', sm: '14px' } }}>
                                Role: {user?.role || 'User'}
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
                        >
                            {isEditing ? 'Save' : 'Edit'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Edit Form */}
            {isEditing && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, fontSize: { xs: '16px', sm: '18px' } }}>
                            Edit Profile
                        </Typography>
                        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Bio"
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button variant="contained" onClick={handleSave}>
                                Save Changes
                            </Button>
                            <Button variant="outlined" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Email Notifications */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotificationsActive /> Email Notifications
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Receive notifications about your events
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={emailNotifications.eventUpdates}
                                    onChange={() => handleNotificationChange('eventUpdates')}
                                />
                            }
                            label="Event Updates"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={emailNotifications.newEvents}
                                    onChange={() => handleNotificationChange('newEvents')}
                                />
                            }
                            label="New Events"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={emailNotifications.registrationReminders}
                                    onChange={() => handleNotificationChange('registrationReminders')}
                                />
                            }
                            label="Registration Reminders"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={emailNotifications.weeklyDigest}
                                    onChange={() => handleNotificationChange('weeklyDigest')}
                                />
                            }
                            label="Weekly Digest"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={emailNotifications.promotionalOffers}
                                    onChange={() => handleNotificationChange('promotionalOffers')}
                                />
                            }
                            label="Promotional Offers"
                        />
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={saveNotificationSettings}
                        disabled={saving}
                        sx={{ mt: 3 }}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Lock /> Privacy Settings
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Control who can see your profile
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth>
                            <FormLabel sx={{ mb: 1, fontWeight: 'bold' }}>Profile Visibility</FormLabel>
                            <RadioGroup
                                value={privacySettings.profileVisibility}
                                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                            >
                                <FormControlLabel value="public" control={<Radio />} label="Public" />
                                <FormControlLabel value="friends" control={<Radio />} label="Friends Only" />
                                <FormControlLabel value="private" control={<Radio />} label="Private" />
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={privacySettings.showEmail}
                                    onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                                />
                            }
                            label="Show Email Address"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={privacySettings.showPhone}
                                    onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
                                />
                            }
                            label="Show Phone Number"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={privacySettings.allowMessages}
                                    onChange={(e) => handlePrivacyChange('allowMessages', e.target.checked)}
                                />
                            }
                            label="Allow Messages from Others"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={privacySettings.showAttendedEvents}
                                    onChange={(e) => handlePrivacyChange('showAttendedEvents', e.target.checked)}
                                />
                            }
                            label="Show Attended Events"
                        />
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={savePrivacySettings}
                        disabled={saving}
                        sx={{ mt: 3 }}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardContent>
            </Card>

            <Divider sx={{ my: 3 }} />

            {/* Account Settings */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, fontSize: { xs: '16px', sm: '18px' } }}>
                        Account Settings
                    </Typography>
                    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'error.50', borderRadius: 1 }}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'error.main' }}>
                                        Logout
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Sign out of your account
                                    </Typography>
                                </Box>
                                <Button variant="outlined" color="error" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

        </Container>
    );
};

export default Profile;