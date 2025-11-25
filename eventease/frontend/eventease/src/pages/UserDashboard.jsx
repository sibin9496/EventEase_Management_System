import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/events';
import { registrationService } from '../services/registration';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalRegistrations: 0,
        upcomingEvents: 0,
        totalEvents: 0,
        myRegistrations: [],
        recentEvents: []
    });
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            console.log('📡 UserDashboard: Fetching dashboard data...');
            
            const eventsResponse = await eventService.getEvents();
            console.log('📊 UserDashboard: Events response:', eventsResponse);
            const allEvents = eventsResponse?.data || eventsResponse?.events || [];
            console.log('📋 UserDashboard: All events count:', allEvents.length);

            const registrationsResponse = await registrationService.getUserRegistrations();
            console.log('📊 UserDashboard: Registrations response:', registrationsResponse);
            const userRegistrations = registrationsResponse?.data || registrationsResponse?.registrations || [];
            console.log('📋 UserDashboard: User registrations count:', userRegistrations.length);

            const upcomingCount = allEvents.filter(e => new Date(e.date) > new Date()).length;
            console.log('📅 UserDashboard: Upcoming events:', upcomingCount);

            setDashboardData({
                totalRegistrations: userRegistrations.length,
                upcomingEvents: upcomingCount,
                totalEvents: allEvents.length,
                myRegistrations: userRegistrations.slice(0, 5),
                recentEvents: allEvents.slice(0, 8)
            });
            
            console.log('✅ UserDashboard: Dashboard data loaded successfully');
        } catch (err) {
            console.error('❌ UserDashboard: Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login-choice');
    };

    if (loading) {
        return <LoadingSpinner message="Loading your dashboard..." />;
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <div>
                        <h1 style={styles.title}>Welcome, {user?.name}! 👋</h1>
                        <p style={styles.subtitle}>Manage your event registrations</p>
                    </div>
                    <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
                </div>
            </div>

            {/* Stats */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{dashboardData.totalRegistrations}</div>
                    <div style={styles.statLabel}>Registrations</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{dashboardData.upcomingEvents}</div>
                    <div style={styles.statLabel}>Upcoming Events</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{dashboardData.totalEvents}</div>
                    <div style={styles.statLabel}>Total Events</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
                <button style={{...styles.tab, ...(activeTab === 'overview' && styles.tabActive)}} onClick={() => setActiveTab('overview')}>📊 Overview</button>
                <button style={{...styles.tab, ...(activeTab === 'registrations' && styles.tabActive)}} onClick={() => setActiveTab('registrations')}>🎫 My Registrations</button>
                <button style={{...styles.tab, ...(activeTab === 'events' && styles.tabActive)}} onClick={() => setActiveTab('events')}>📅 Browse Events</button>
            </div>

            {/* Content */}
            <div style={styles.content}>
                {activeTab === 'overview' && (
                    <div>
                        <div style={styles.actionButtons}>
                            <button onClick={() => navigate('/events')} style={styles.actionBtn}>🔍 Discover Events</button>
                            <button onClick={() => navigate('/my-registrations')} style={styles.actionBtn}>🎫 View Registrations</button>
                            <button onClick={() => navigate('/profile')} style={styles.actionBtn}>👤 Profile Settings</button>
                        </div>

                        {dashboardData.recentEvents.length > 0 && (
                            <div style={styles.section}>
                                <h2 style={styles.sectionTitle}>Recent Events</h2>
                                <div style={styles.eventsList}>
                                    {dashboardData.recentEvents.slice(0, 4).map((event) => (
                                        <div key={event._id} style={styles.eventCard} onClick={() => navigate(`/events/${event._id}`)}>
                                            <h3>{event.title}</h3>
                                            <p>{event.category} • ₹{event.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'registrations' && (
                    <div>
                        {dashboardData.myRegistrations.length > 0 ? (
                            <div style={styles.registrationsList}>
                                {dashboardData.myRegistrations.map((reg) => (
                                    <div key={reg._id} style={styles.regCard}>
                                        <h3>{reg.eventTitle}</h3>
                                        <p><strong>Email:</strong> {reg.email}</p>
                                        <p><strong>Tickets:</strong> {reg.numberOfTickets} • <strong>Price:</strong> ₹{reg.totalPrice}</p>
                                        <button onClick={() => reg.eventId && navigate(`/events/${reg.eventId}`)} style={styles.viewBtn}>View Event</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={styles.empty}>No registrations yet. <button onClick={() => navigate('/events')} style={styles.emptyBtn}>Browse Events</button></div>
                        )}
                    </div>
                )}

                {activeTab === 'events' && (
                    <div style={styles.section}>
                        <button onClick={() => navigate('/events')} style={styles.browseBtn}>Go to Events Page →</button>
                    </div>
                )}
            </div>

            {/* User Card */}
            <div style={styles.userCard}>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
                <p style={{fontSize: '12px', color: '#999'}}>Role: <span style={{backgroundColor: '#e0e7ff', padding: '2px 8px', borderRadius: '4px'}}>{user?.role}</span></p>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' },
    header: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px' },
    headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
    subtitle: { fontSize: '14px', opacity: 0.9, margin: '5px 0 0 0' },
    logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' },
    statCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' },
    statValue: { fontSize: '28px', fontWeight: 'bold', color: '#2563eb' },
    statLabel: { fontSize: '12px', color: '#666', marginTop: '5px' },
    tabs: { display: 'flex', gap: '10px', borderBottom: '2px solid #e2e8f0', marginBottom: '20px' },
    tab: { padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#666', borderBottom: '3px solid transparent' },
    tabActive: { color: '#2563eb', borderBottom: '3px solid #2563eb' },
    content: { marginBottom: '20px' },
    actionButtons: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '20px' },
    actionBtn: { padding: '10px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
    section: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '20px' },
    sectionTitle: { fontSize: '18px', fontWeight: 'bold', margin: '0 0 15px 0' },
    eventsList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' },
    eventCard: { backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e2e8f0' },
    registrationsList: { display: 'grid', gap: '15px' },
    regCard: { backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' },
    viewBtn: { marginTop: '10px', padding: '8px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
    empty: { textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '10px', border: '1px solid #e2e8f0' },
    emptyBtn: { marginLeft: '10px', padding: '8px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    browseBtn: { padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    userCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }
};

export default UserDashboard;
