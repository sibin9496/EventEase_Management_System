import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Grid,
    Link as MuiLink,
    Divider,
    TextField,
    Button,
    IconButton,
    Tooltip,
    Stack
} from '@mui/material';
import {
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    YouTube,
    Mail,
    Phone,
    LocationOn,
    ArrowUpward,
    Brightness4,
    Brightness7
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const [email, setEmail] = useState('');
    const [subscribeMessage, setSubscribeMessage] = useState('');

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribeMessage('✅ Thanks for subscribing!');
            setEmail('');
            setTimeout(() => setSubscribeMessage(''), 3000);
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f8fafc',
            borderTop: `1px solid ${isDarkMode ? '#333' : '#e2e8f0'}`,
            marginTop: '60px'
        }}>
            <Container maxWidth="lg">
                {/* Main Footer Content */}
                <Box sx={{ py: 6 }}>
                    <Grid container spacing={4}>
                        {/* About Section */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Box>
                                <Typography variant="h6" sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    color: isDarkMode ? '#fff' : '#1a1a1a',
                                    fontSize: '1.1rem'
                                }}>
                                    🎭 EventEase
                                </Typography>
                                <Typography variant="body2" sx={{
                                    color: isDarkMode ? '#aaa' : '#64748b',
                                    lineHeight: 1.8,
                                    mb: 2
                                }}>
                                    Your ultimate platform for discovering, creating, and managing amazing events. Join thousands of event enthusiasts today!
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <Tooltip title="Facebook">
                                        <IconButton size="small" sx={{ color: '#667eea' }}>
                                            <Facebook fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Twitter">
                                        <IconButton size="small" sx={{ color: '#667eea' }}>
                                            <Twitter fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Instagram">
                                        <IconButton size="small" sx={{ color: '#667eea' }}>
                                            <Instagram fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="LinkedIn">
                                        <IconButton size="small" sx={{ color: '#667eea' }}>
                                            <LinkedIn fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="YouTube">
                                        <IconButton size="small" sx={{ color: '#667eea' }}>
                                            <YouTube fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Box>
                        </Grid>

                        {/* Quick Links */}
                        <Grid item xs={12} sm={6} md={2}>
                            <Box>
                                <Typography variant="h6" sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    color: isDarkMode ? '#fff' : '#1a1a1a',
                                    fontSize: '0.95rem'
                                }}>
                                    Quick Links
                                </Typography>
                                <Stack spacing={1.2}>
                                    <MuiLink
                                        component={Link}
                                        to="/"
                                        sx={{
                                            color: isDarkMode ? '#aaa' : '#64748b',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            '&:hover': { color: '#667eea', fontWeight: 500 },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Home
                                    </MuiLink>
                                    <MuiLink
                                        component={Link}
                                        to="/events"
                                        sx={{
                                            color: isDarkMode ? '#aaa' : '#64748b',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            '&:hover': { color: '#667eea', fontWeight: 500 },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Explore Events
                                    </MuiLink>
                                    <MuiLink
                                        component={Link}
                                        to="/create-event"
                                        sx={{
                                            color: isDarkMode ? '#aaa' : '#64748b',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            '&:hover': { color: '#667eea', fontWeight: 500 },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Create Event
                                    </MuiLink>
                                    <MuiLink
                                        component={Link}
                                        to="/my-registrations"
                                        sx={{
                                            color: isDarkMode ? '#aaa' : '#64748b',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            '&:hover': { color: '#667eea', fontWeight: 500 },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        My Registrations
                                    </MuiLink>
                                </Stack>
                            </Box>
                        </Grid>

                        {/* User Account */}
                        <Grid item xs={12} sm={6} md={2}>
                            <Box>
                                <Typography variant="h6" sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    color: isDarkMode ? '#fff' : '#1a1a1a',
                                    fontSize: '0.95rem'
                                }}>
                                    Account
                                </Typography>
                                <Stack spacing={1.2}>
                                    <MuiLink
                                        component={Link}
                                        to="/profile"
                                        sx={{
                                            color: isDarkMode ? '#aaa' : '#64748b',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            '&:hover': { color: '#667eea', fontWeight: 500 },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Profile
                                    </MuiLink>
                                    <MuiLink
                                        component={Link}
                                        to="/notifications"
                                        sx={{
                                            color: isDarkMode ? '#aaa' : '#64748b',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            '&:hover': { color: '#667eea', fontWeight: 500 },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Notifications
                                    </MuiLink>
                                    <MuiLink
                                        href="#"
                                        sx={{
                                            color: isDarkMode ? '#aaa' : '#64748b',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            '&:hover': { color: '#667eea', fontWeight: 500 },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Help Center
                                    </MuiLink>
                                </Stack>
                            </Box>
                        </Grid>

                        {/* Newsletter */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Box>
                                <Typography variant="h6" sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    color: isDarkMode ? '#fff' : '#1a1a1a',
                                    fontSize: '0.95rem'
                                }}>
                                    Newsletter
                                </Typography>
                                <Typography variant="body2" sx={{
                                    color: isDarkMode ? '#aaa' : '#64748b',
                                    mb: 1.5,
                                    fontSize: '0.85rem'
                                }}>
                                    Subscribe to get updates about new events and special offers
                                </Typography>
                                <Box component="form" onSubmit={handleSubscribe}>
                                    <TextField
                                        size="small"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        sx={{
                                            mb: 1,
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
                                                color: isDarkMode ? '#fff' : '#000',
                                                fontSize: '0.9rem'
                                            }
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="small"
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            fontWeight: 600,
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        Subscribe
                                    </Button>
                                </Box>
                                {subscribeMessage && (
                                    <Typography variant="caption" sx={{
                                        color: '#10b981',
                                        display: 'block',
                                        mt: 1
                                    }}>
                                        {subscribeMessage}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Divider */}
                    <Divider sx={{
                        my: 4,
                        borderColor: isDarkMode ? '#333' : '#e2e8f0'
                    }} />

                    {/* Contact Info */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Mail sx={{ color: '#667eea', mt: 0.5 }} />
                                <Box>
                                    <Typography variant="subtitle2" sx={{
                                        color: isDarkMode ? '#fff' : '#1a1a1a',
                                        fontWeight: 600,
                                        mb: 0.3
                                    }}>
                                        Email
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: isDarkMode ? '#aaa' : '#64748b'
                                    }}>
                                        contact@eventease.com
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Phone sx={{ color: '#667eea', mt: 0.5 }} />
                                <Box>
                                    <Typography variant="subtitle2" sx={{
                                        color: isDarkMode ? '#fff' : '#1a1a1a',
                                        fontWeight: 600,
                                        mb: 0.3
                                    }}>
                                        Phone
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: isDarkMode ? '#aaa' : '#64748b'
                                    }}>
                                        +91 94 96 70 34 23
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <LocationOn sx={{ color: '#667eea', mt: 0.5 }} />
                                <Box>
                                    <Typography variant="subtitle2" sx={{
                                        color: isDarkMode ? '#fff' : '#1a1a1a',
                                        fontWeight: 600,
                                        mb: 0.3
                                    }}>
                                        Location
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: isDarkMode ? '#aaa' : '#64748b'
                                    }}>
                                        Trivandrum Kerala , India
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Divider */}
                    <Divider sx={{
                        my: 3,
                        borderColor: isDarkMode ? '#333' : '#e2e8f0'
                    }} />

                    {/* Bottom Footer */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Typography variant="body2" sx={{
                            color: isDarkMode ? '#aaa' : '#64748b',
                            fontSize: '0.85rem'
                        }}>
                            © {currentYear} EventEase. All rights reserved. | 
                            <MuiLink
                                href="#"
                                sx={{
                                    color: isDarkMode ? '#aaa' : '#64748b',
                                    textDecoration: 'none',
                                    ml: 1,
                                    '&:hover': { color: '#667eea' }
                                }}
                            >
                                Privacy Policy
                            </MuiLink>
                            {' '} | {' '}
                            <MuiLink
                                href="#"
                                sx={{
                                    color: isDarkMode ? '#aaa' : '#64748b',
                                    textDecoration: 'none',
                                    '&:hover': { color: '#667eea' }
                                }}
                            >
                                Terms of Service
                            </MuiLink>
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
                                <IconButton
                                    onClick={toggleTheme}
                                    size="small"
                                    sx={{
                                        color: '#667eea',
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? '#333' : '#f0f0f0'
                                        }
                                    }}
                                >
                                    {isDarkMode ? <Brightness7 /> : <Brightness4 />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Scroll to Top">
                                <IconButton
                                    onClick={handleScrollToTop}
                                    size="small"
                                    sx={{
                                        color: '#667eea',
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? '#333' : '#f0f0f0'
                                        }
                                    }}
                                >
                                    <ArrowUpward />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </footer>
    );
};

export default Footer;