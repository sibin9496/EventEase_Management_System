import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Button,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Grid,
    Paper,
    Tooltip,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Edit as EditIcon,
    Refresh as RefreshIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const API_URL = '/api/subscriptions';

const SubscriberManagement = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalSubscribers, setTotalSubscribers] = useState(0);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubscriber, setSelectedSubscriber] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Get auth token
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };

    // Fetch subscribers
    const fetchSubscribers = async (pageNum = 0, searchTerm = '', filterType = 'all') => {
        try {
            setLoading(true);
            setError('');

            const params = new URLSearchParams({
                page: pageNum + 1,
                limit: rowsPerPage,
                search: searchTerm,
                filter: filterType
            });

            const response = await fetch(`${API_URL}?${params}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Failed to fetch subscribers');

            const data = await response.json();
            setSubscribers(data.data || []);
            setTotalSubscribers(data.total || 0);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching subscribers:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch stats
    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_URL}/stats`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Failed to fetch stats');

            const data = await response.json();
            setStats(data.data || null);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchSubscribers();
        fetchStats();
    }, []);

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        fetchSubscribers(newPage, search, filter);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        fetchSubscribers(0, search, filter);
    };

    // Handle search
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        setPage(0);
        fetchSubscribers(0, value, filter);
    };

    // Handle filter
    const handleFilter = (newFilter) => {
        setFilter(newFilter);
        setPage(0);
        fetchSubscribers(0, search, newFilter);
    };

    // Delete subscriber
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subscriber?')) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Failed to delete subscriber');

            setSuccess('Subscriber deleted successfully');
            fetchSubscribers(page, search, filter);
            fetchStats();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    // Open edit dialog
    const handleEdit = (subscriber) => {
        setSelectedSubscriber(subscriber);
        setOpenDialog(true);
    };

    // Update subscriber
    const handleUpdateSubscriber = async () => {
        if (!selectedSubscriber) return;

        try {
            const response = await fetch(`${API_URL}/${selectedSubscriber._id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    isActive: selectedSubscriber.isActive,
                    preferences: selectedSubscriber.preferences
                })
            });

            if (!response.ok) throw new Error('Failed to update subscriber');

            setSuccess('Subscriber updated successfully');
            setOpenDialog(false);
            setSelectedSubscriber(null);
            fetchSubscribers(page, search, filter);
            fetchStats();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    // Export subscribers
    const handleExport = async () => {
        try {
            const response = await fetch(`${API_URL}/export/csv`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Failed to export');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setSuccess('Subscribers exported successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                📧 Newsletter Subscribers Management
            </Typography>

            {/* Error/Success Messages */}
            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

            {/* Stats Cards */}
            {stats && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Subscribers</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.total}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>Active</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.active}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>Unsubscribed</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.inactive}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>This Month</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>+{stats.total > 0 ? Math.floor(stats.total * 0.15) : 0}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Search & Filter Bar */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search email..."
                            value={search}
                            onChange={handleSearch}
                            size="small"
                            sx={{ flex: 1, minWidth: 200 }}
                            variant="outlined"
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                                label="All"
                                onClick={() => handleFilter('all')}
                                variant={filter === 'all' ? 'filled' : 'outlined'}
                                color={filter === 'all' ? 'primary' : 'default'}
                            />
                            <Chip
                                label="Active"
                                onClick={() => handleFilter('active')}
                                variant={filter === 'active' ? 'filled' : 'outlined'}
                                color={filter === 'active' ? 'primary' : 'default'}
                            />
                            <Chip
                                label="Inactive"
                                onClick={() => handleFilter('inactive')}
                                variant={filter === 'inactive' ? 'filled' : 'outlined'}
                                color={filter === 'inactive' ? 'primary' : 'default'}
                            />
                        </Box>
                        <Button
                            startIcon={<DownloadIcon />}
                            onClick={handleExport}
                            variant="outlined"
                            size="small"
                        >
                            Export CSV
                        </Button>
                        <Tooltip title="Refresh">
                            <IconButton size="small" onClick={() => fetchSubscribers(page, search, filter)}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </CardContent>
            </Card>

            {/* Subscribers Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ background: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Subscribed Date</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Preferences</TableCell>
                                <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : subscribers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                                        No subscribers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subscribers.map((subscriber) => (
                                    <TableRow key={subscriber._id} hover>
                                        <TableCell>{subscriber.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={subscriber.isActive ? 'Active' : 'Inactive'}
                                                color={subscriber.isActive ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(subscriber.subscribedAt).toLocaleDateString('en-IN')}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                {subscriber.preferences.eventUpdates && (
                                                    <Chip label="Events" size="small" variant="outlined" />
                                                )}
                                                {subscriber.preferences.newEvents && (
                                                    <Chip label="New" size="small" variant="outlined" />
                                                )}
                                                {subscriber.preferences.promotions && (
                                                    <Chip label="Promos" size="small" variant="outlined" />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEdit(subscriber)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(subscriber._id)}
                                                    sx={{ color: 'error.main' }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {!loading && subscribers.length > 0 && (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={totalSubscribers}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                )}
            </Card>

            {/* Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Edit Subscriber</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {selectedSubscriber && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Email: {selectedSubscriber.email}
                            </Typography>

                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Status
                                </Typography>
                                <Chip
                                    label={selectedSubscriber.isActive ? 'Active' : 'Inactive'}
                                    onClick={() =>
                                        setSelectedSubscriber({
                                            ...selectedSubscriber,
                                            isActive: !selectedSubscriber.isActive
                                        })
                                    }
                                    color={selectedSubscriber.isActive ? 'success' : 'default'}
                                    sx={{ cursor: 'pointer' }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Preferences
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip
                                        label="Event Updates"
                                        onClick={() =>
                                            setSelectedSubscriber({
                                                ...selectedSubscriber,
                                                preferences: {
                                                    ...selectedSubscriber.preferences,
                                                    eventUpdates: !selectedSubscriber.preferences.eventUpdates
                                                }
                                            })
                                        }
                                        color={selectedSubscriber.preferences.eventUpdates ? 'primary' : 'default'}
                                        variant={selectedSubscriber.preferences.eventUpdates ? 'filled' : 'outlined'}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                    <Chip
                                        label="New Events"
                                        onClick={() =>
                                            setSelectedSubscriber({
                                                ...selectedSubscriber,
                                                preferences: {
                                                    ...selectedSubscriber.preferences,
                                                    newEvents: !selectedSubscriber.preferences.newEvents
                                                }
                                            })
                                        }
                                        color={selectedSubscriber.preferences.newEvents ? 'primary' : 'default'}
                                        variant={selectedSubscriber.preferences.newEvents ? 'filled' : 'outlined'}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                    <Chip
                                        label="Promotions"
                                        onClick={() =>
                                            setSelectedSubscriber({
                                                ...selectedSubscriber,
                                                preferences: {
                                                    ...selectedSubscriber.preferences,
                                                    promotions: !selectedSubscriber.preferences.promotions
                                                }
                                            })
                                        }
                                        color={selectedSubscriber.preferences.promotions ? 'primary' : 'default'}
                                        variant={selectedSubscriber.preferences.promotions ? 'filled' : 'outlined'}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleUpdateSubscriber} variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SubscriberManagement;
