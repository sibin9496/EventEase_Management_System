import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, unread, read

    useEffect(() => {
        fetchNotifications();
        // Refresh notifications every 10 seconds
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch('/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setError('');
            } else {
                setError('Failed to load notifications');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Error loading notifications');
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                fetchNotifications();
            }
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                fetchNotifications();
            }
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    const getFilteredNotifications = () => {
        switch (filter) {
            case 'unread':
                return notifications.filter(n => !n.read);
            case 'read':
                return notifications.filter(n => n.read);
            default:
                return notifications;
        }
    };

    const filteredNotifications = getFilteredNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>🔔 Notifications</h1>
                <p style={styles.subtitle}>You have {unreadCount} unread notifications</p>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{...styles.alert, backgroundColor: '#fee2e2', color: '#dc2626'}}>
                    {error}
                </div>
            )}

            {/* Filters */}
            <div style={styles.filterContainer}>
                <button
                    onClick={() => setFilter('all')}
                    style={{...styles.filterBtn, backgroundColor: filter === 'all' ? '#2563eb' : '#e2e8f0', color: filter === 'all' ? 'white' : '#1e293b'}}
                >
                    All ({notifications.length})
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    style={{...styles.filterBtn, backgroundColor: filter === 'unread' ? '#2563eb' : '#e2e8f0', color: filter === 'unread' ? 'white' : '#1e293b'}}
                >
                    Unread ({unreadCount})
                </button>
                <button
                    onClick={() => setFilter('read')}
                    style={{...styles.filterBtn, backgroundColor: filter === 'read' ? '#2563eb' : '#e2e8f0', color: filter === 'read' ? 'white' : '#1e293b'}}
                >
                    Read ({notifications.length - unreadCount})
                </button>
            </div>

            {/* Notifications List */}
            <div style={styles.notificationsContainer}>
                {loading ? (
                    <div style={styles.loadingContainer}>
                        <p>Loading notifications...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <p style={styles.emptyText}>No notifications yet</p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            style={{
                                ...styles.notificationCard,
                                backgroundColor: notification.read ? '#f8fafc' : '#eff6ff',
                                borderLeft: `4px solid ${notification.read ? '#cbd5e1' : '#2563eb'}`
                            }}
                        >
                            <div style={styles.notificationContent}>
                                <div style={styles.notificationHeader}>
                                    <h3 style={styles.notificationTitle}>
                                        {!notification.read && <span style={styles.unreadDot}>●</span>}
                                        {notification.subject}
                                    </h3>
                                    <span style={{...styles.badge, backgroundColor: getTypeColor(notification.type)}}>
                                        {notification.type}
                                    </span>
                                </div>
                                <p style={styles.notificationMessage}>{notification.message}</p>
                                <div style={styles.notificationMeta}>
                                    <small style={styles.senderInfo}>
                                        From: {notification.sender || 'System'}
                                    </small>
                                    <small style={styles.timeInfo}>
                                        {formatDate(notification.createdAt)}
                                    </small>
                                </div>
                            </div>

                            <div style={styles.notificationActions}>
                                {!notification.read && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        style={styles.actionBtn}
                                        title="Mark as read"
                                    >
                                        ✓
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteNotification(notification.id)}
                                    style={{...styles.actionBtn, color: '#ef4444'}}
                                    title="Delete"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const getTypeColor = (type) => {
    const colors = {
        general: '#3b82f6',
        event_update: '#10b981',
        registration_confirm: '#8b5cf6',
        event_reminder: '#f59e0b',
        promotional: '#ec4899'
    };
    return colors[type] || '#3b82f6';
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '30px 20px'
    },
    header: {
        marginBottom: '30px'
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1e293b',
        margin: '0 0 10px 0'
    },
    subtitle: {
        fontSize: '14px',
        color: '#64748b',
        margin: 0
    },
    alert: {
        padding: '15px 20px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px'
    },
    filterContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap'
    },
    filterBtn: {
        padding: '10px 16px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.2s'
    },
    notificationsContainer: {
        maxWidth: '900px',
        margin: '0 auto'
    },
    loadingContainer: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#64748b'
    },
    emptyContainer: {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: 'white',
        borderRadius: '12px'
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: '16px',
        margin: 0
    },
    notificationCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        marginBottom: '15px',
        transition: 'all 0.2s'
    },
    notificationContent: {
        flex: 1,
        marginRight: '15px'
    },
    notificationHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    notificationTitle: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '600',
        color: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    unreadDot: {
        color: '#2563eb',
        fontSize: '10px'
    },
    badge: {
        padding: '4px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'nowrap'
    },
    notificationMessage: {
        margin: '10px 0',
        fontSize: '14px',
        color: '#475569',
        lineHeight: '1.5'
    },
    notificationMeta: {
        display: 'flex',
        gap: '15px',
        marginTop: '12px'
    },
    senderInfo: {
        color: '#94a3b8',
        fontSize: '12px'
    },
    timeInfo: {
        color: '#94a3b8',
        fontSize: '12px'
    },
    notificationActions: {
        display: 'flex',
        gap: '8px',
        flexShrink: 0
    },
    actionBtn: {
        padding: '8px 12px',
        backgroundColor: '#e2e8f0',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        color: '#64748b',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.2s'
    }
};

export default Notifications;
