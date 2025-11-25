import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [admins, setAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    // Forms
    const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
    const [eventForm, setEventForm] = useState({
        title: '',
        description: '',
        category: '',
        type: 'Conference',
        date: '',
        time: '',
        location: '',
        capacity: '',
        price: '',
        image: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isEditingEvent, setIsEditingEvent] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    
    // Notification form state
    const [notificationForm, setNotificationForm] = useState({
        userId: '',
        subject: '',
        message: '',
        type: 'general'
    });

    // Redirect if not admin
    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    // Fetch all data
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            console.log('📡 AdminPanel: Starting data fetch...');
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('❌ AdminPanel: No authentication token found');
                setError('❌ No authentication token found');
                setLoading(false);
                return;
            }
            
            const headers = { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            const API_BASE = '/api';

            // Fetch users
            console.log('📡 AdminPanel: Fetching users...');
            const usersRes = await fetch(`${API_BASE}/admin/users`, { headers });
            if (usersRes.ok) {
                const data = await usersRes.json();
                setUsers(data.users || data.data || []);
                setAdmins((data.users || data.data || []).filter(u => u.role === 'admin'));
                console.log('✅ AdminPanel: Users fetched -', (data.users || data.data || []).length, 'total');
            } else {
                console.error('❌ AdminPanel: Users fetch failed -', usersRes.status, usersRes.statusText);
            }

            // Fetch ALL events (including trending)
            console.log('📡 AdminPanel: Fetching events with limit=500...');
            const eventsRes = await fetch(`${API_BASE}/events?limit=500`, { headers });
            if (eventsRes.ok) {
                const data = await eventsRes.json();
                console.log('✅ AdminPanel: Events fetched -', data.data?.length || 0, 'total:', data.total);
                setEvents(data.data || data.events || []);
                setError('');
            } else {
                const errorData = await eventsRes.json();
                console.error('❌ AdminPanel: Events fetch failed -', eventsRes.status, errorData);
                setError('❌ Failed to fetch events: ' + (errorData.message || eventsRes.statusText));
            }

            // Fetch registrations
            console.log('📡 AdminPanel: Fetching registrations...');
            const registrationsRes = await fetch(`${API_BASE}/registrations`, { headers });
            if (registrationsRes.ok) {
                const data = await registrationsRes.json();
                setRegistrations(data.registrations || data.data || []);
                console.log('✅ AdminPanel: Registrations fetched -', (data.registrations || data.data || []).length);
            } else {
                console.error('❌ AdminPanel: Registrations fetch failed:', registrationsRes.status, registrationsRes.statusText);
            }

            console.log('✅ AdminPanel: All data fetched successfully');
            setLoading(false);
        } catch (err) {
            console.error('❌ AdminPanel: Fetch error:', err);
            setError('❌ Error fetching data: ' + err.message);
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        const API_BASE = '/api';

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/admin/create-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(adminForm)
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMsg('✅ Admin created successfully!');
                setAdminForm({ name: '', email: '', password: '' });
                fetchAllData();
            } else {
                setError('❌ ' + (data.message || 'Failed to create admin'));
            }
        } catch (err) {
            setError('❌ Error: ' + err.message);
        }
    };

    const handleDeleteAdmin = async (adminId) => {
        if (!window.confirm('Remove this admin?')) return;
        const API_BASE = '/api';
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/admin/users/${adminId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setSuccessMsg('✅ Admin removed!');
                fetchAllData();
            }
        } catch (err) {
            setError('❌ Error: ' + err.message);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        const API_BASE = '/api';

        try {
            const token = localStorage.getItem('token');
            
            if (isEditingEvent) {
                // Update event
                console.log('📡 AdminPanel: Updating event', editingEventId);
                const response = await fetch(`${API_BASE}/admin/events/${editingEventId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...eventForm,
                        capacity: parseInt(eventForm.capacity),
                        price: parseInt(eventForm.price)
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    console.log('✅ AdminPanel: Event updated successfully');
                    setSuccessMsg('✅ Event updated successfully!');
                    setEventForm({
                        title: '',
                        description: '',
                        category: '',
                        type: 'Conference',
                        date: '',
                        time: '',
                        location: '',
                        capacity: '',
                        price: '',
                        image: ''
                    });
                    setImageFile(null);
                    setImagePreview('');
                    setImageUrl('');
                    setIsEditingEvent(false);
                    setEditingEventId(null);
                    console.log('📡 AdminPanel: Refreshing all data after update...');
                    await fetchAllData();
                } else {
                    const errorMsg = data.message || data.error || 'Failed to update event';
                    console.error('❌ AdminPanel: Update failed:', errorMsg);
                    setError('❌ ' + errorMsg);
                }
            } else {
                // Create new event
                console.log('📡 AdminPanel: Creating new event');
                const response = await fetch(`${API_BASE}/admin/events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...eventForm,
                        capacity: parseInt(eventForm.capacity),
                        price: parseInt(eventForm.price)
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    console.log('✅ AdminPanel: Event created successfully');
                    setSuccessMsg('✅ Event created successfully!');
                    setEventForm({
                        title: '',
                        description: '',
                        category: '',
                        type: 'Conference',
                        date: '',
                        time: '',
                        location: '',
                        capacity: '',
                        price: '',
                        image: ''
                    });
                    setImageFile(null);
                    setImagePreview('');
                    setImageUrl('');
                    console.log('📡 AdminPanel: Refreshing all data after create...');
                    await fetchAllData();
                } else {
                    const errorMsg = data.message || data.error || 'Failed to create event';
                    console.error('❌ AdminPanel: Create failed:', errorMsg);
                    setError('❌ ' + errorMsg);
                }
            }
        } catch (err) {
            console.error('❌ AdminPanel: Error in handleCreateEvent:', err);
            setError('❌ Error: ' + err.message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setEventForm({...eventForm, image: reader.result});
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUrlChange = (url) => {
        setImageUrl(url);
        if (url.trim()) {
            setImagePreview(url);
            setEventForm({...eventForm, image: url});
        }
    };

    const handleEditEvent = (event) => {
        // Convert time format from "07:00 AM" to "07:00" if needed
        let timeValue = event.time || '';
        if (timeValue && (timeValue.includes(' AM') || timeValue.includes(' PM'))) {
            // Convert 12-hour format to 24-hour format
            const [time, period] = timeValue.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            timeValue = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }
        
        setEventForm({
            title: event.title,
            description: event.description,
            category: event.category,
            type: event.type,
            date: event.date ? event.date.split('T')[0] : '',
            time: timeValue,
            location: event.location,
            capacity: event.capacity.toString(),
            price: event.price.toString(),
            image: event.image || ''
        });
        setImagePreview(event.image || '');
        setImageUrl(event.image || '');
        setImageFile(null);
        setIsEditingEvent(true);
        setEditingEventId(event._id);
        setError('');
        setSuccessMsg('');
        
        // Scroll to form section
        setTimeout(() => {
            const formElement = document.querySelector('[data-form="event-form"]');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const handleCancelEdit = () => {
        setIsEditingEvent(false);
        setEditingEventId(null);
        setEventForm({
            title: '',
            description: '',
            category: '',
            type: 'Conference',
            date: '',
            time: '',
            location: '',
            capacity: '',
            price: '',
            image: ''
        });
        setImageFile(null);
        setImagePreview('');
        setImageUrl('');
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        const API_BASE = '/api';
        try {
            console.log('📡 AdminPanel: Deleting event', eventId);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/admin/events/${eventId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                console.log('✅ AdminPanel: Event deleted successfully');
                setSuccessMsg('✅ Event deleted successfully!');
                console.log('📡 AdminPanel: Refreshing all data after delete...');
                await fetchAllData();
            } else {
                const data = await response.json();
                const errorMsg = data.message || data.error || 'Failed to delete event';
                console.error('❌ AdminPanel: Delete failed:', errorMsg);
                setError('❌ ' + errorMsg);
            }
        } catch (err) {
            console.error('❌ AdminPanel: Error in handleDeleteEvent:', err);
            setError('❌ Error: ' + err.message);
        }
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        const API_BASE = '/api';

        if (!notificationForm.userId || !notificationForm.subject || !notificationForm.message) {
            setError('❌ Please fill in all fields');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/notifications/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(notificationForm)
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMsg('✅ Notification sent successfully!');
                setNotificationForm({ userId: '', subject: '', message: '', type: 'general' });
            } else {
                setError('❌ ' + (data.message || 'Failed to send notification'));
            }
        } catch (err) {
            setError('❌ Error: ' + err.message);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login-choice');
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>👑 ADMIN PANEL</h1>
                    <p style={styles.subtitle}>Logged as: {user?.name} ({user?.email})</p>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>

            {/* Alerts */}
            {error && <div style={{...styles.alert, backgroundColor: '#fee2e2', color: '#dc2626'}}>{error}</div>}
            {successMsg && <div style={{...styles.alert, backgroundColor: '#dcfce7', color: '#15803d'}}>{successMsg}</div>}

            {/* Sidebar Navigation */}
            <div style={styles.layout}>
                <div style={styles.sidebar}>
                    <button
                        onClick={() => setActiveSection('dashboard')}
                        style={{...styles.navBtn, backgroundColor: activeSection === 'dashboard' ? '#2563eb' : '#e2e8f0'}}
                    >
                        📊 Dashboard
                    </button>
                    <button
                        onClick={() => setActiveSection('admins')}
                        style={{...styles.navBtn, backgroundColor: activeSection === 'admins' ? '#2563eb' : '#e2e8f0'}}
                    >
                        👑 Manage Admins
                    </button>
                    <button
                        onClick={() => setActiveSection('users')}
                        style={{...styles.navBtn, backgroundColor: activeSection === 'users' ? '#2563eb' : '#e2e8f0'}}
                    >
                        👥 All Users
                    </button>
                    <button
                        onClick={() => setActiveSection('events')}
                        style={{...styles.navBtn, backgroundColor: activeSection === 'events' ? '#2563eb' : '#e2e8f0'}}
                    >
                        📅 Manage Events
                    </button>
                    <button
                        onClick={() => setActiveSection('registrations')}
                        style={{...styles.navBtn, backgroundColor: activeSection === 'registrations' ? '#2563eb' : '#e2e8f0'}}
                    >
                        📝 Registrations
                    </button>
                    <button
                        onClick={() => setActiveSection('notifications')}
                        style={{...styles.navBtn, backgroundColor: activeSection === 'notifications' ? '#2563eb' : '#e2e8f0'}}
                    >
                        🔔 Notifications
                    </button>

                </div>

                {/* Main Content */}
                <div style={styles.content}>
                    {/* Dashboard Section */}
                    {activeSection === 'dashboard' && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>📊 Dashboard Overview</h2>
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <div style={styles.statsGrid}>
                                    <div style={{...styles.stat, borderLeft: '4px solid #2563eb'}}>
                                        <div style={styles.statNumber}>{users.length}</div>
                                        <div style={styles.statLabel}>Total Users</div>
                                    </div>
                                    <div style={{...styles.stat, borderLeft: '4px solid #7c3aed'}}>
                                        <div style={styles.statNumber}>{admins.length}</div>
                                        <div style={styles.statLabel}>Admins</div>
                                    </div>
                                    <div style={{...styles.stat, borderLeft: '4px solid #10b981'}}>
                                        <div style={styles.statNumber}>{users.filter(u => u.role === 'organizer').length}</div>
                                        <div style={styles.statLabel}>Organizers</div>
                                    </div>
                                    <div style={{...styles.stat, borderLeft: '4px solid #f59e0b'}}>
                                        <div style={styles.statNumber}>{events.length}</div>
                                        <div style={styles.statLabel}>Total Events</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Manage Admins */}
                    {activeSection === 'admins' && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>👑 Manage Admins</h2>
                            
                            <div style={styles.formCard}>
                                <h3>➕ Add New Admin</h3>
                                <form onSubmit={handleAddAdmin} style={styles.form}>
                                    <input
                                        type="text"
                                        placeholder="Admin Name"
                                        value={adminForm.name}
                                        onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                                        style={styles.input}
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Admin Email"
                                        value={adminForm.email}
                                        onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                                        style={styles.input}
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={adminForm.password}
                                        onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                                        style={styles.input}
                                        required
                                    />
                                    <button type="submit" style={styles.submitBtn}>Create Admin</button>
                                </form>
                            </div>

                            <div style={styles.listCard}>
                                <h3>👑 Current Admins ({admins.length})</h3>
                                {admins.length === 0 ? (
                                    <p>No admins found</p>
                                ) : (
                                    <div style={styles.itemsList}>
                                        {admins.map(admin => (
                                            <div key={admin._id} style={styles.item}>
                                                <div>
                                                    <strong>{admin.name}</strong>
                                                    <p style={styles.itemEmail}>{admin.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteAdmin(admin._id)}
                                                    style={styles.deleteBtn}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* All Users */}
                    {activeSection === 'users' && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>👥 All Users ({users.length})</h2>
                            <div style={styles.tableContainer}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Photo</th>
                                            <th style={styles.th}>Name</th>
                                            <th style={styles.th}>Email</th>
                                            <th style={styles.th}>Role</th>
                                            <th style={styles.th}>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u._id} style={styles.tr}>
                                                <td style={styles.td}>
                                                    <img
                                                        src={u.profilePhoto || u.avatar}
                                                        alt={u.name}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            border: '2px solid #2563eb'
                                                        }}
                                                    />
                                                </td>
                                                <td style={styles.td}>{u.name}</td>
                                                <td style={styles.td}>{u.email}</td>
                                                <td style={styles.td}>
                                                    <span style={{...styles.badge, backgroundColor: u.role === 'admin' ? '#7c3aed' : '#2563eb'}}>
                                                        {(u.role || 'user').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Manage Events */}
                    {activeSection === 'events' && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>📅 Manage Events</h2>
                            
                            <div style={styles.formCard} data-form="event-form">
                                <h3>{isEditingEvent ? '✏️ Edit Event' : '➕ Create New Event'}</h3>
                                <form onSubmit={handleCreateEvent} style={styles.formGrid}>
                                    <input
                                        type="text"
                                        placeholder="Event Title"
                                        value={eventForm.title}
                                        onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                                        style={styles.input}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Category"
                                        value={eventForm.category}
                                        onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                                        style={styles.input}
                                        required
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={eventForm.description}
                                        onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                                        style={{...styles.input, minHeight: '100px'}}
                                        required
                                    />
                                    <input
                                        type="date"
                                        value={eventForm.date}
                                        onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                                        style={styles.input}
                                        required
                                    />
                                    <input
                                        type="time"
                                        value={eventForm.time}
                                        onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                                        style={styles.input}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        value={eventForm.location}
                                        onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                                        style={styles.input}
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Capacity"
                                        value={eventForm.capacity}
                                        onChange={(e) => setEventForm({...eventForm, capacity: e.target.value})}
                                        style={styles.input}
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={eventForm.price}
                                        onChange={(e) => setEventForm({...eventForm, price: e.target.value})}
                                        style={styles.input}
                                        required
                                    />
                                    <div style={{gridColumn: 'span 2'}}>
                                        <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333'}}>
                                            🖼️ Upload Event Image
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{...styles.input, padding: '10px'}}
                                        />
                                        {imagePreview && (
                                            <div style={{marginTop: '10px', textAlign: 'center'}}>
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Event preview" 
                                                    style={{maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', marginTop: '10px'}}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {isEditingEvent && (
                                        <div style={{gridColumn: 'span 2'}}>
                                            <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333'}}>
                                                🔗 Or Update Image URL
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="https://example.com/image.jpg"
                                                value={imageUrl}
                                                onChange={(e) => handleImageUrlChange(e.target.value)}
                                                style={styles.input}
                                            />
                                            <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                                                💡 Tip: Paste a direct image URL to update the event image
                                            </p>
                                        </div>
                                    )}
                                    {!isEditingEvent && (
                                        <div style={{gridColumn: 'span 2'}}>
                                            <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333'}}>
                                                🔗 Or Add Image URL
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="https://example.com/image.jpg"
                                                value={imageUrl}
                                                onChange={(e) => handleImageUrlChange(e.target.value)}
                                                style={styles.input}
                                            />
                                            <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                                                💡 Tip: Paste a direct image URL or upload a file above
                                            </p>
                                        </div>
                                    )}
                                    <div style={{gridColumn: 'span 2', display: 'flex', gap: '10px'}}>
                                        <button type="submit" style={{...styles.submitBtn, flex: 1}}>
                                            {isEditingEvent ? '💾 Update Event' : '➕ Create Event'}
                                        </button>
                                        {isEditingEvent && (
                                            <button 
                                                type="button" 
                                                onClick={handleCancelEdit}
                                                style={{...styles.cancelBtn, flex: 1}}
                                            >
                                                ✕ Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div style={styles.listCard}>
                                <h3>📅 All Events ({events.length})</h3>
                                {events.length === 0 ? (
                                    <p>No events found</p>
                                ) : (
                                    <div style={styles.eventsList}>
                                        {events.map(event => (
                                            <div key={event._id} style={styles.eventItem}>
                                                <div>
                                                    <strong>{event.title}</strong>
                                                    <p style={styles.itemEmail}>{event.category} - {event.location}</p>
                                                    <p style={styles.itemEmail}>📅 {new Date(event.date).toLocaleDateString()}</p>
                                                </div>
                                                <div style={{display: 'flex', gap: '10px'}}>
                                                    <button
                                                        onClick={() => handleEditEvent(event)}
                                                        style={{...styles.editBtn}}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(event._id)}
                                                        style={styles.deleteBtn}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}





                    {/* Registrations */}
                    {activeSection === 'registrations' && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>📝 Event Registrations</h2>
                            {loading ? (
                                <p>Loading registrations...</p>
                            ) : registrations.length === 0 ? (
                                <p style={{color: '#94a3b8', textAlign: 'center', padding: '40px'}}>No registrations yet</p>
                            ) : (
                                <div style={styles.tableContainer}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>User Name</th>
                                                <th style={styles.th}>Email</th>
                                                <th style={styles.th}>Phone</th>
                                                <th style={styles.th}>Event</th>
                                                <th style={styles.th}>Registration Date</th>
                                                <th style={styles.th}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registrations.map((reg, idx) => (
                                                <tr key={idx} style={styles.tr}>
                                                    <td style={styles.td}>{reg.fullName}</td>
                                                    <td style={styles.td}>{reg.email}</td>
                                                    <td style={styles.td}>{reg.phone}</td>
                                                    <td style={styles.td}>{reg.eventTitle || 'Event'}</td>
                                                    <td style={styles.td}>{new Date(reg.registrationDate).toLocaleDateString()}</td>
                                                    <td style={styles.td}>
                                                        <span style={{...styles.badge, backgroundColor: reg.status === 'active' ? '#10b981' : '#ef4444'}}>
                                                            {reg.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            
                        </div>
                    )}

                    {/* Notifications */}
                    {activeSection === 'notifications' && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>🔔 Send Notifications to Users</h2>
                            
                            <div style={styles.formCard}>
                                <h3>📢 Send Update Notification</h3>
                                <form onSubmit={handleSendNotification} style={styles.form}>
                                    <div style={{marginBottom: '15px'}}>
                                        <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Select User</label>
                                        <select 
                                            value={notificationForm.userId}
                                            onChange={(e) => setNotificationForm({...notificationForm, userId: e.target.value})}
                                            style={styles.input}
                                            required
                                        >
                                            <option value="">-- Choose a user --</option>
                                            {users.map(u => (
                                                <option key={u._id} value={u._id}>
                                                    {u.name} ({u.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{marginBottom: '15px'}}>
                                        <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Notification Type</label>
                                        <select 
                                            value={notificationForm.type}
                                            onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value})}
                                            style={styles.input}
                                        >
                                            <option value="general">General</option>
                                            <option value="event_update">Event Update</option>
                                            <option value="registration_confirm">Registration Confirmation</option>
                                            <option value="event_reminder">Event Reminder</option>
                                            <option value="promotional">Promotional</option>
                                        </select>
                                    </div>

                                    <div style={{marginBottom: '15px'}}>
                                        <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Subject</label>
                                        <input 
                                            type="text"
                                            placeholder="Notification subject"
                                            value={notificationForm.subject}
                                            onChange={(e) => setNotificationForm({...notificationForm, subject: e.target.value})}
                                            style={styles.input}
                                            required
                                        />
                                    </div>

                                    <div style={{marginBottom: '15px'}}>
                                        <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Message</label>
                                        <textarea 
                                            placeholder="Notification message"
                                            value={notificationForm.message}
                                            onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                                            style={{...styles.input, minHeight: '120px', resize: 'vertical'}}
                                            required
                                        />
                                    </div>

                                    <button type="submit" style={styles.submitBtn}>
                                        📤 Send Notification
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
    },
    header: {
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        margin: '0',
        fontSize: '32px'
    },
    subtitle: {
        margin: '5px 0 0 0',
        fontSize: '14px',
        opacity: 0.9
    },
    logoutBtn: {
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    alert: {
        margin: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        fontSize: '14px'
    },
    layout: {
        display: 'flex',
        minHeight: 'calc(100vh - 120px)'
    },
    sidebar: {
        width: '250px',
        backgroundColor: 'white',
        padding: '20px',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    navBtn: {
        padding: '12px 16px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        color: 'white',
        transition: 'all 0.2s'
    },
    content: {
        flex: 1,
        padding: '30px',
        overflowY: 'auto'
    },
    section: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    sectionTitle: {
        fontSize: '28px',
        marginBottom: '30px',
        color: '#1e293b'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
    },
    stat: {
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px'
    },
    statNumber: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#1e293b'
    },
    statLabel: {
        fontSize: '14px',
        color: '#64748b',
        marginTop: '8px'
    },
    formCard: {
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '15px'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginTop: '15px'
    },
    input: {
        padding: '12px 16px',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        fontFamily: 'inherit',
        fontSize: '14px'
    },
    submitBtn: {
        backgroundColor: '#10b981',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    listCard: {
        marginTop: '30px'
    },
    itemsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '15px'
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        borderLeft: '4px solid #2563eb'
    },
    itemEmail: {
        fontSize: '12px',
        color: '#64748b',
        margin: '5px 0 0 0'
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
    editBtn: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    cancelBtn: {
        backgroundColor: '#6b7280',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    tableContainer: {
        overflowX: 'auto',
        marginTop: '20px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        padding: '12px 16px',
        textAlign: 'left',
        backgroundColor: '#f8fafc',
        borderBottom: '2px solid #e2e8f0',
        fontWeight: '600'
    },
    tr: {
        borderBottom: '1px solid #e2e8f0'
    },
    td: {
        padding: '12px 16px'
    },
    badge: {
        padding: '4px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '12px',
        fontWeight: '600'
    },
    eventsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '15px'
    },
    eventItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        borderLeft: '4px solid #f59e0b'
    },
    premiumGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    },
    premiumCard: {
        backgroundColor: '#f8fafc',
        padding: '25px',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        textAlign: 'center'
    },
    premiumIcon: {
        fontSize: '48px',
        marginBottom: '15px'
    },
    premiumList: {
        listStyle: 'none',
        padding: 0,
        marginTop: '15px',
        textAlign: 'left'
    },
    premiumPrice: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#2563eb',
        marginTop: '15px'
    },
    reportGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    },
    reportCard: {
        backgroundColor: '#f0f9ff',
        padding: '20px',
        borderRadius: '12px',
        borderLeft: '4px solid #2563eb',
        textAlign: 'center'
    },
    reportStat: {
        fontSize: '40px',
        fontWeight: 'bold',
        color: '#2563eb',
        marginTop: '10px'
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    }
};

export default AdminPanel;
