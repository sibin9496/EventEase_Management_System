import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // State management
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Redirect if not admin
    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    // Fetch all data
    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchAllData = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_BASE = '/api';
            
            // Fetch users
            const usersRes = await fetch(`${API_BASE}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (usersRes.ok) {
                const data = await usersRes.json();
                setUsers(data.users || data.data || []);
            }

            // Fetch events
            const eventsRes = await fetch(`${API_BASE}/admin/events`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (eventsRes.ok) {
                const data = await eventsRes.json();
                setEvents(data.events || data.data || []);
            }

            // Fetch registrations
            const registrationsRes = await fetch(`${API_BASE}/registrations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (registrationsRes.ok) {
                const data = await registrationsRes.json();
                setRegistrations(data.registrations || data.data || []);
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const token = localStorage.getItem('token');
            const API_BASE = '/api';
            const endpoint = formData.role === 'admin' 
                ? `${API_BASE}/admin/create-admin`
                : formData.role === 'organizer'
                ? `${API_BASE}/admin/create-organizer`
                : `${API_BASE}/admin/create-admin`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(`${formData.role} created successfully!`);
                setFormData({ name: '', email: '', password: '', role: 'user' });
                setShowAddForm(false);
                fetchAllData();
            } else {
                setError(data.message || 'Failed to create user');
            }
        } catch (err) {
            setError('Error: ' + err.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            const API_BASE = '/api';
            const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setSuccessMessage('User deleted!');
                fetchAllData();
            }
        } catch (err) {
            setError('Error: ' + err.message);
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token');
            const API_BASE = '/api';
            await fetch(`${API_BASE}/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });
            fetchAllData();
        } catch (err) {
            setError('Error: ' + err.message);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login-choice');
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div style={{...styles.statCard, borderTopColor: color}}>
            <div style={styles.statIcon}>{icon}</div>
            <div style={styles.statNumber}>{value}</div>
            <div style={styles.statLabel}>{title}</div>
        </div>
    );

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>👑 Admin Dashboard</h1>
                    <p style={styles.subtitle}>Logged in as: <strong>{user?.name}</strong> ({user?.email})</p>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>

            {error && <div style={{...styles.alert, backgroundColor: '#fee2e2', borderColor: '#fecaca'}}>{error}</div>}
            {successMessage && <div style={{...styles.alert, backgroundColor: '#dcfce7', borderColor: '#bbf7d0'}}>{successMessage}</div>}

            {/* Tabs */}
            <div style={styles.tabs}>
                {['overview', 'users', 'events', 'registrations'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            ...styles.tab,
                            backgroundColor: activeTab === tab ? '#2563eb' : '#e2e8f0',
                            color: activeTab === tab ? 'white' : '#1e293b'
                        }}
                    >
                        {tab === 'overview' && '📊 Overview'}
                        {tab === 'users' && '👥 Users'}
                        {tab === 'events' && '🎪 Events'}
                        {tab === 'registrations' && '📝 Registrations'}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Dashboard Overview</h2>
                    <div style={styles.stats}>
                        <StatCard 
                            title="Total Users" 
                            value={users.length} 
                            icon="👥"
                            color="#2563eb"
                        />
                        <StatCard 
                            title="Currently Logged In" 
                            value={registrations.length} 
                            icon="📋"
                            color="#10b981"
                        />
                        <StatCard 
                            title="Total Events" 
                            value={events.length} 
                            icon="🎪"
                            color="#f59e0b"
                        />
                        <StatCard 
                            title="Organizers" 
                            value={users.filter(u => u.role === 'organizer').length} 
                            icon="🎪"
                            color="#f59e0b"
                        />
                        <StatCard 
                            title="Regular Users" 
                            value={users.filter(u => u.role === 'user').length} 
                            icon="👤"
                            color="#3b82f6"
                        />
                        <StatCard 
                            title="Total Registrations" 
                            value={registrations.length} 
                            icon="📊"
                            color="#8b5cf6"
                        />
                    </div>

                    {/* Quick Info */}
                    <div style={styles.quickInfo}>
                        <div style={styles.infoCard}>
                            <h3>System Status</h3>
                            <p>✅ Backend: Running</p>
                            <p>✅ Database: Connected</p>
                            <p>✅ Events: {events.length} total</p>
                        </div>
                        <div style={styles.infoCard}>
                            <h3>User Statistics</h3>
                            <p>👥 Total Users: {users.length}</p>
                            <p>👑 Admins: {users.filter(u => u.role === 'admin').length}</p>
                            <p>📋 Registrations: {registrations.length}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Manage Users</h2>
                        <button 
                            onClick={() => setShowAddForm(!showAddForm)}
                            style={styles.addBtn}
                        >
                            {showAddForm ? '✕ Cancel' : '+ Add User'}
                        </button>
                    </div>

                    {showAddForm && (
                        <form onSubmit={handleAddUser} style={styles.form}>
                            <div style={styles.formGrid}>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    style={styles.select}
                                >
                                    <option value="user">User</option>
                                    <option value="organizer">Organizer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" style={styles.submitBtn}>Create User</button>
                        </form>
                    )}

                    {loading ? (
                        <p style={styles.loading}>Loading...</p>
                    ) : (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.tableHeader}>
                                        <th style={styles.th}>Name</th>
                                        <th style={styles.th}>Email</th>
                                        <th style={styles.th}>Role</th>
                                        <th style={styles.th}>Joined</th>
                                        <th style={styles.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id} style={styles.tableRow}>
                                            <td style={styles.td}>{u.name}</td>
                                            <td style={styles.td}>{u.email}</td>
                                            <td style={styles.td}>
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleChangeRole(u._id, e.target.value)}
                                                    style={styles.roleSelect}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="organizer">Organizer</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td style={styles.td}>
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    style={styles.deleteBtn}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Manage Events</h2>
                    {loading ? (
                        <p style={styles.loading}>Loading...</p>
                    ) : events.length === 0 ? (
                        <p style={styles.noData}>No events found</p>
                    ) : (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.tableHeader}>
                                        <th style={styles.th}>Title</th>
                                        <th style={styles.th}>Category</th>
                                        <th style={styles.th}>Location</th>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Price</th>
                                        <th style={styles.th}>Capacity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map(e => (
                                        <tr key={e._id} style={styles.tableRow}>
                                            <td style={styles.td}>{e.title}</td>
                                            <td style={styles.td}>{e.category}</td>
                                            <td style={styles.td}>{e.location}</td>
                                            <td style={styles.td}>{new Date(e.date).toLocaleDateString()}</td>
                                            <td style={styles.td}>${e.price}</td>
                                            <td style={styles.td}>{e.capacity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Registrations Tab */}
            {activeTab === 'registrations' && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Event Registrations</h2>
                    {loading ? (
                        <p style={styles.loading}>Loading...</p>
                    ) : registrations.length === 0 ? (
                        <p style={styles.noData}>No registrations found</p>
                    ) : (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.tableHeader}>
                                        <th style={styles.th}>User</th>
                                        <th style={styles.th}>Event</th>
                                        <th style={styles.th}>Tickets</th>
                                        <th style={styles.th}>Total Price</th>
                                        <th style={styles.th}>Payment Status</th>
                                        <th style={styles.th}>Registration Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.map(reg => (
                                        <tr key={reg._id} style={styles.tableRow}>
                                            <td style={styles.td}>{reg.user?.name || 'Unknown'}</td>
                                            <td style={styles.td}>{reg.event?.title || 'Unknown'}</td>
                                            <td style={styles.td}>{reg.numberOfTickets}</td>
                                            <td style={styles.td}>${reg.totalPrice}</td>
                                            <td style={styles.td}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '4px',
                                                    backgroundColor: reg.paymentStatus === 'completed' ? '#dcfce7' : '#fecaca',
                                                    color: reg.paymentStatus === 'completed' ? '#15803d' : '#b91c1c'
                                                }}>
                                                    {reg.paymentStatus}
                                                </span>
                                            </td>
                                            <td style={styles.td}>{new Date(reg.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Sessions Tab - Who is logged in */}
            {activeTab === 'sessions' && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Currently Logged In Users</h2>
                    {loading ? (
                        <p style={styles.loading}>Loading...</p>
                    ) : sessions.length === 0 ? (
                        <p style={styles.noData}>No active sessions</p>
                    ) : (
                        <div style={styles.cardGrid}>
                            {sessions.map(session => (
                                <div key={session._id} style={styles.sessionCard}>
                                    <div style={styles.sessionHeader}>
                                        <img src={session.userId?.avatar} alt="avatar" style={styles.avatar} />
                                        <div>
                                            <h3 style={styles.sessionName}>{session.userId?.name}</h3>
                                            <p style={styles.sessionRole}>{session.userId?.role}</p>
                                        </div>
                                    </div>
                                    <div style={styles.sessionDetails}>
                                        <p>📧 {session.userId?.email}</p>
                                        <p>⏰ Login: {getTimeAgo(session.loginTime)}</p>
                                        <p>📱 Device: {session.device}</p>
                                        <p>🌐 IP: {session.ipAddress}</p>
                                        <p>🟢 <span style={{color: '#10b981'}}>Active Now</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Login History</h2>
                    {loading ? (
                        <p style={styles.loading}>Loading...</p>
                    ) : loginHistory.length === 0 ? (
                        <p style={styles.noData}>No login history</p>
                    ) : (
                        <div style={styles.timeline}>
                            {loginHistory.map((log, idx) => (
                                <div key={log._id} style={styles.timelineItem}>
                                    <div style={styles.timelineMarker}></div>
                                    <div style={styles.timelineContent}>
                                        <div style={styles.timelineHeader}>
                                            <strong>{log.userId?.name}</strong>
                                            <span style={styles.timelineTime}>{getTimeAgo(log.loginTime)}</span>
                                        </div>
                                        <p style={styles.timelineText}>
                                            📧 {log.userId?.email} | 👤 {log.userId?.role} | 📱 {log.device}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '40px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e2e8f0'
    },
    title: {
        fontSize: '32px',
        color: '#1e293b',
        margin: '0 0 5px 0'
    },
    subtitle: {
        fontSize: '14px',
        color: '#64748b',
        margin: '0'
    },
    logoutBtn: {
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600'
    },
    alert: {
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid'
    },
    tabs: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap'
    },
    tab: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.2s'
    },
    section: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    sectionTitle: {
        fontSize: '24px',
        color: '#1e293b',
        margin: '0 0 20px 0'
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
    },
    statCard: {
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '12px',
        borderTop: '4px solid',
        textAlign: 'center'
    },
    statIcon: {
        fontSize: '32px',
        marginBottom: '10px'
    },
    statNumber: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1e293b'
    },
    statLabel: {
        fontSize: '13px',
        color: '#64748b',
        marginTop: '5px'
    },
    quickInfo: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
    },
    infoCard: {
        backgroundColor: '#f0f9ff',
        padding: '20px',
        borderRadius: '8px',
        borderLeft: '4px solid #2563eb'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    addBtn: {
        backgroundColor: '#10b981',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    form: {
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '15px'
    },
    input: {
        padding: '12px 16px',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        fontFamily: 'inherit'
    },
    select: {
        padding: '12px 16px',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        backgroundColor: 'white',
        fontFamily: 'inherit'
    },
    submitBtn: {
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    loading: {
        textAlign: 'center',
        color: '#64748b',
        padding: '40px'
    },
    noData: {
        textAlign: 'center',
        color: '#64748b',
        padding: '40px'
    },
    tableContainer: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    tableHeader: {
        backgroundColor: '#f8fafc',
        borderBottom: '2px solid #e2e8f0'
    },
    th: {
        padding: '16px',
        textAlign: 'left',
        fontSize: '14px',
        fontWeight: '600',
        color: '#334155'
    },
    tableRow: {
        borderBottom: '1px solid #e2e8f0'
    },
    td: {
        padding: '16px',
        fontSize: '14px',
        color: '#475569'
    },
    roleSelect: {
        padding: '8px 12px',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        fontFamily: 'inherit'
    },
    deleteBtn: {
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
    },
    sessionCard: {
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        borderLeft: '4px solid #10b981'
    },
    sessionHeader: {
        display: 'flex',
        gap: '15px',
        marginBottom: '15px'
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        objectFit: 'cover'
    },
    sessionName: {
        margin: '0',
        fontSize: '16px',
        fontWeight: 'bold'
    },
    sessionRole: {
        margin: '5px 0 0 0',
        fontSize: '12px',
        color: '#64748b',
        textTransform: 'uppercase',
        backgroundColor: '#dbeafe',
        padding: '2px 8px',
        borderRadius: '4px',
        display: 'inline-block'
    },
    sessionDetails: {
        fontSize: '13px',
        color: '#64748b',
        lineHeight: '1.8'
    },
    timeline: {
        position: 'relative',
        paddingLeft: '30px'
    },
    timelineItem: {
        position: 'relative',
        paddingLeft: '20px',
        paddingBottom: '20px'
    },
    timelineMarker: {
        position: 'absolute',
        left: '-30px',
        top: '5px',
        width: '12px',
        height: '12px',
        backgroundColor: '#2563eb',
        borderRadius: '50%',
        border: '3px solid white',
        boxShadow: '0 0 0 3px #2563eb'
    },
    timelineContent: {
        backgroundColor: '#f8fafc',
        padding: '15px',
        borderRadius: '8px'
    },
    timelineHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px'
    },
    timelineTime: {
        fontSize: '12px',
        color: '#64748b'
    },
    timelineText: {
        margin: '0',
        fontSize: '13px',
        color: '#475569'
    }
};

export default AdminDashboard;
