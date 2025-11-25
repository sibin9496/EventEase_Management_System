import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocationContext } from '../../context/LocationContext';
import SearchBar from '../SearchBar';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { selectedLocation, setLocation, popularLocations, getCurrentLocation } = useLocationContext();
    const navigate = useNavigate();
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [currentLocationStatus, setCurrentLocationStatus] = useState('');
    const dropdownRef = useRef(null);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setShowMobileMenu(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLocationDropdown(false);
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initialize location status
    useEffect(() => {
        if (selectedLocation) {
            setCurrentLocationStatus('✅ Location set');
        } else {
            setCurrentLocationStatus('📌 Select a location');
        }
    }, [selectedLocation]);

    const handleLocationSelect = (location) => {
        setLocation(location);
        setShowLocationDropdown(false);
        setTimeout(() => {
            navigate('/events', { state: { filterByLocation: location.name } });
        }, 100);
    };

    const handleUseCurrentLocation = async () => {
        setIsLoadingLocation(true);
        setCurrentLocationStatus('📍 Fetching current location...');
        try {
            const location = await getCurrentLocation();
            setLocation(location);
            setCurrentLocationStatus('✅ Using current location');
            navigate('/events', { state: { filterByLocation: location.name } });
        } catch (error) {
            setCurrentLocationStatus('❌ Could not get location');
        } finally {
            setIsLoadingLocation(false);
            setShowLocationDropdown(false);
        }
    };

    const handleLogout = () => {
        logout();
        setShowUserDropdown(false);
        setShowMobileMenu(false);
        navigate('/');
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                {/* Logo */}
                <div style={styles.logoSection}>
                    <div style={styles.logoIcon}>🎭</div>
                    <Link to="/" style={styles.logoText}>EventEase</Link>
                </div>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <>
                        <div style={styles.navCenter}>
                            <SearchBar />
                            <Link to="/events" style={styles.navLink}>🔍 Discover</Link>
                            <Link to="/my-registrations" style={styles.navLink}>🎫 Registrations</Link>
                        </div>

                        <div style={styles.navRight} ref={dropdownRef}>
                            {/* Location Selector */}
                            <div style={styles.locationContainer}>
                                <button
                                    style={{...styles.locationBtn, ...(showLocationDropdown && styles.locationBtnActive)}}
                                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                                >
                                    📍 {selectedLocation?.name || 'Location'}
                                    <span style={styles.dropdownArrow}>▼</span>
                                </button>

                                {showLocationDropdown && (
                                    <div style={styles.locationDropdown}>
                                        <button style={styles.locationOption} onClick={handleUseCurrentLocation} disabled={isLoadingLocation}>
                                            {isLoadingLocation ? '⏳ Detecting...' : '📍 Current Location'}
                                        </button>
                                        <div style={styles.divider} />
                                        {popularLocations.map(loc => (
                                            <button
                                                key={loc.id}
                                                style={{...styles.locationOption, ...(selectedLocation?.id === loc.id && styles.locationOptionSelected)}}
                                                onClick={() => handleLocationSelect(loc)}
                                            >
                                                📌 {loc.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* User Section */}
                            {isAuthenticated ? (
                                <div style={styles.userSection}>
                                    {user?.role === 'admin' && (
                                        <>
                                            <Link to="/create-event" style={styles.adminBtn}>➕ Create</Link>
                                            <Link to="/admin-panel" style={styles.adminBtn}>👑 Admin</Link>
                                        </>
                                    )}
                                    <div style={styles.userDropdownContainer}>
                                        <button 
                                            style={styles.userTrigger}
                                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                                        >
                                            <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
                                            <span style={{...styles.dropdownArrow, transform: showUserDropdown ? 'rotate(180deg)' : 'none'}}>▼</span>
                                        </button>

                                        {showUserDropdown && (
                                            <div style={styles.userDropdown}>
                                                <div style={styles.userInfo}>
                                                    <div style={styles.userAvatar}>{user?.name?.charAt(0).toUpperCase()}</div>
                                                    <div>
                                                        <div style={styles.userNameDropdown}>{user?.name}</div>
                                                        <div style={styles.userEmail}>{user?.email}</div>
                                                    </div>
                                                </div>
                                                <div style={styles.dropdownDivider} />
                                                <Link to="/my-registrations" style={styles.dropdownLink} onClick={() => setShowUserDropdown(false)}>🎫 Registrations</Link>
                                                <Link to="/profile" style={styles.dropdownLink} onClick={() => setShowUserDropdown(false)}>👤 Profile</Link>
                                                <Link to="/notifications" style={styles.dropdownLink} onClick={() => setShowUserDropdown(false)}>🔔 Notifications</Link>
                                                {user?.role === 'user' && <Link to="/user-dashboard" style={styles.dropdownLink} onClick={() => setShowUserDropdown(false)}>📊 Dashboard</Link>}
                                                <div style={styles.dropdownDivider} />
                                                <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={styles.authButtons}>
                                    <Link to="/login" style={styles.loginBtn}>🔑 Login</Link>
                                    <Link to="/register" style={styles.signupBtn}>✨ Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Mobile Hamburger */}
                {isMobile && (
                    <button
                        style={{...styles.hamburgerBtn, ...(showMobileMenu && styles.hamburgerActive)}}
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        <span style={{...styles.hamburgerLine, ...(showMobileMenu && {transform: 'rotate(45deg) translate(8px, 8px)'})}}></span>
                        <span style={{...styles.hamburgerLine, ...(showMobileMenu && {opacity: 0})}}></span>
                        <span style={{...styles.hamburgerLine, ...(showMobileMenu && {transform: 'rotate(-45deg) translate(7px, -7px)'})}}></span>
                    </button>
                )}
            </div>

            {/* Mobile Menu */}
            {isMobile && showMobileMenu && (
                <div style={styles.mobileMenuContainer}>
                    <div style={styles.mobileSearchWrapper}>
                        <SearchBar />
                    </div>

                    {/* Mobile Location */}
                    <div style={styles.mobileMenuSection}>
                        <div style={styles.mobileMenuTitle}>📍 Location</div>
                        <button style={styles.mobileMenuBtn} onClick={() => setShowLocationDropdown(!showLocationDropdown)}>
                            {selectedLocation?.name || 'Select Location'}
                        </button>
                        {showLocationDropdown && (
                            <div style={styles.mobileDropdown}>
                                <button style={styles.mobileDropdownItem} onClick={handleUseCurrentLocation} disabled={isLoadingLocation}>
                                    {isLoadingLocation ? '⏳ Detecting...' : '📍 Current Location'}
                                </button>
                                {popularLocations.map(loc => (
                                    <button
                                        key={loc.id}
                                        style={{...styles.mobileDropdownItem, ...(selectedLocation?.id === loc.id && styles.mobileDropdownItemSelected)}}
                                        onClick={() => handleLocationSelect(loc)}
                                    >
                                        📌 {loc.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mobile Links */}
                    <div style={styles.mobileMenuSection}>
                        <Link to="/events" style={styles.mobileMenuLink} onClick={() => setShowMobileMenu(false)}>🔍 Discover Events</Link>
                        <Link to="/my-registrations" style={styles.mobileMenuLink} onClick={() => setShowMobileMenu(false)}>🎫 My Registrations</Link>
                    </div>

                    {/* Mobile Auth */}
                    {isAuthenticated ? (
                        <div style={styles.mobileMenuSection}>
                            <div style={styles.mobileMenuTitle}>👤 Account</div>
                            {user?.role === 'admin' && (
                                <>
                                    <Link to="/create-event" style={styles.mobileMenuLink} onClick={() => setShowMobileMenu(false)}>➕ Create Event</Link>
                                    <Link to="/admin-panel" style={styles.mobileMenuLink} onClick={() => setShowMobileMenu(false)}>👑 Admin Panel</Link>
                                </>
                            )}
                            <Link to="/profile" style={styles.mobileMenuLink} onClick={() => setShowMobileMenu(false)}>👤 Profile</Link>
                            <Link to="/notifications" style={styles.mobileMenuLink} onClick={() => setShowMobileMenu(false)}>🔔 Notifications</Link>
                            {user?.role === 'user' && <Link to="/user-dashboard" style={styles.mobileMenuLink} onClick={() => setShowMobileMenu(false)}>📊 Dashboard</Link>}
                            <button onClick={() => {handleLogout(); setShowMobileMenu(false);}} style={styles.mobileMenuLogoutBtn}>🚪 Logout</button>
                        </div>
                    ) : (
                        <div style={styles.mobileMenuSection}>
                            <Link to="/login" style={styles.mobileMenuLink} onClick={() => setShowMobileMenu(false)}>🔑 Login</Link>
                            <Link to="/register" style={styles.mobileMenuLink} onClick={() => setShowMobileMenu(false)}>✨ Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: '#ffffff',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 15px',
        height: '75px'
    },
    logoSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0
    },
    logoIcon: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '6px',
        borderRadius: '8px',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center'
    },
    logoText: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#1e293b',
        textDecoration: 'none'
    },
    navCenter: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flex: 1,
        margin: '0 20px'
    },
    navLink: {
        color: '#64748b',
        textDecoration: 'none',
        padding: '8px 14px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    },
    navRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexShrink: 0
    },
    locationContainer: {
        position: 'relative'
    },
    locationBtn: {
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        padding: '8px 12px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap'
    },
    locationBtnActive: {
        background: '#f8fafc',
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    dropdownArrow: {
        fontSize: '10px',
        opacity: 0.6,
        transition: 'transform 0.3s'
    },
    locationDropdown: {
        position: 'absolute',
        top: '100%',
        left: '0',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        minWidth: '220px',
        zIndex: 1001,
        marginTop: '4px',
        maxHeight: '300px',
        overflowY: 'auto'
    },
    locationOption: {
        width: '100%',
        padding: '10px 12px',
        border: 'none',
        background: 'transparent',
        color: '#475569',
        cursor: 'pointer',
        fontSize: '13px',
        borderBottom: '1px solid #f1f5f9',
        textAlign: 'left'
    },
    locationOptionSelected: {
        background: '#f0f9ff',
        color: '#0369a1'
    },
    divider: {
        height: '1px',
        background: '#e2e8f0'
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    adminBtn: {
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        color: 'white',
        textDecoration: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '11px',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    },
    userDropdownContainer: {
        position: 'relative'
    },
    userTrigger: {
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        padding: '4px 8px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    avatar: {
        width: '28px',
        height: '28px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '12px'
    },
    userAvatar: {
        width: '36px',
        height: '36px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    userDropdown: {
        position: 'absolute',
        top: '100%',
        right: '0',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        minWidth: '240px',
        zIndex: 1001,
        marginTop: '4px',
        overflow: 'hidden'
    },
    userInfo: {
        padding: '12px',
        display: 'flex',
        gap: '8px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0'
    },
    userNameDropdown: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#1e293b'
    },
    userEmail: {
        fontSize: '11px',
        color: '#64748b'
    },
    dropdownDivider: {
        height: '1px',
        background: '#e2e8f0'
    },
    dropdownLink: {
        display: 'block',
        padding: '8px 12px',
        color: '#475569',
        textDecoration: 'none',
        fontSize: '12px',
        fontWeight: '500',
        borderBottom: '1px solid #f1f5f9',
        cursor: 'pointer'
    },
    logoutBtn: {
        width: '100%',
        padding: '8px 12px',
        color: '#ef4444',
        fontSize: '12px',
        fontWeight: '500',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left'
    },
    authButtons: {
        display: 'flex',
        gap: '6px'
    },
    loginBtn: {
        color: '#475569',
        textDecoration: 'none',
        border: '1px solid #e2e8f0',
        padding: '8px 14px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        background: '#ffffff',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    },
    signupBtn: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        color: 'white',
        textDecoration: 'none',
        padding: '8px 14px',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '12px',
        cursor: 'pointer',
        border: 'none',
        whiteSpace: 'nowrap'
    },
    hamburgerBtn: {
        display: 'none',
        flexDirection: 'column',
        gap: '4px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '6px'
    },
    hamburgerLine: {
        width: '20px',
        height: '2px',
        backgroundColor: '#1e293b',
        transition: 'all 0.3s'
    },
    mobileMenuContainer: {
        display: 'none',
        position: 'absolute',
        top: '75px',
        left: '0',
        right: '0',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        maxHeight: 'calc(100vh - 75px)',
        overflowY: 'auto'
    },
    mobileSearchWrapper: {
        padding: '10px',
        borderBottom: '1px solid #f1f5f9'
    },
    mobileMenuSection: {
        padding: '8px 0',
        borderBottom: '1px solid #f1f5f9'
    },
    mobileMenuTitle: {
        padding: '8px 16px',
        fontSize: '11px',
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase'
    },
    mobileMenuBtn: {
        width: '100%',
        padding: '10px 16px',
        border: 'none',
        background: 'transparent',
        color: '#1e293b',
        fontSize: '13px',
        fontWeight: '500',
        textAlign: 'left',
        cursor: 'pointer'
    },
    mobileDropdown: {
        background: '#f8fafc'
    },
    mobileDropdownItem: {
        width: '100%',
        padding: '10px 32px',
        border: 'none',
        background: 'transparent',
        color: '#475569',
        fontSize: '13px',
        textAlign: 'left',
        cursor: 'pointer'
    },
    mobileDropdownItemSelected: {
        background: '#f0f9ff',
        color: '#0369a1'
    },
    mobileMenuLink: {
        display: 'block',
        padding: '10px 16px',
        color: '#475569',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: '500',
        borderBottom: '1px solid #f1f5f9'
    },
    mobileMenuLogoutBtn: {
        display: 'block',
        width: '100%',
        padding: '10px 16px',
        color: '#ef4444',
        fontSize: '13px',
        fontWeight: '500',
        border: 'none',
        background: 'transparent',
        textAlign: 'left',
        cursor: 'pointer'
    },

    // Media queries handled via JS state
    '@media (max-width: 768px)': {
        hamburgerBtn: {display: 'flex'},
        mobileMenuContainer: {display: 'block'},
        navCenter: {display: 'none'},
        navRight: {display: 'none'}
    }
};

export default Navbar;
