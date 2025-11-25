import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    Radio,
    FormControlLabel,
    FormControl,
    FormLabel
} from '@mui/material';
import {
    LocationOn,
    CalendarToday,
    AccessTime,
    CheckCircle,
    ArrowBack,
    CreditCard,
    LocalAtm
} from '@mui/icons-material';
import { eventService } from '../services/events';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

// API Base URL - use /api proxy for development
const API_BASE_URL = '/api';

// Simple registration component with payment options
const SimpleEventRegistration = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1); // 1: User Details, 2: Payment Method, 3: Confirmation
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        phone: '',
        numberOfTickets: 1
    });
    const [paymentMethod, setPaymentMethod] = useState('stripe'); // stripe or card
    const [cardData, setCardData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
    const [registrationCheckComplete, setRegistrationCheckComplete] = useState(false);

    useEffect(() => {
        if (id && id !== 'undefined') {
            setRegistrationCheckComplete(false);
            fetchEventDetails();
            checkRegistrationStatus();
        }
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            
            // Validate ID
            if (!id) {
                setLoading(false);
                return;
            }

            const response = await eventService.getEvents();
            const eventsList = response?.data || response?.events || [];
            const foundEvent = eventsList.find(e => e.id === id || e._id === id);
            if (foundEvent) {
                setEvent(foundEvent);
            }
        } catch (err) {
            console.error('Error fetching event:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkRegistrationStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !id) {
                setRegistrationCheckComplete(true);
                return;
            }

            // Use the event ID from the URL parameter
            const eventId = id;
            
            const response = await fetch(`${API_BASE_URL}/registrations/check/${eventId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.isRegistered) {
                    setIsAlreadyRegistered(true);
                    setPaymentError('You are already registered for this event');
                }
            } else if (response.status === 401) {
                // User not logged in, skip check
                setRegistrationCheckComplete(true);
                return;
            }
        } catch (err) {
            // Silently fail - if we can't check, let the registration attempt tell us
            console.error('Error checking registration status:', err);
        } finally {
            setRegistrationCheckComplete(true);
        }
    };

    const handleInputChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number must be 10 digits';
        }
        
        return newErrors;
    };

    const handleProceedToPayment = () => {
        // Check if already registered
        if (isAlreadyRegistered) {
            setPaymentError('You are already registered for this event');
            return;
        }

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setShowPaymentModal(true);
        setStep(2);
    };

    const handlePaymentSubmit = async () => {
        setIsSubmitting(true);
        setPaymentError('');

        try {
            // Double check - prevent duplicate registration
            if (isAlreadyRegistered) {
                setPaymentError('You are already registered for this event');
                setShowPaymentModal(false);
                setIsSubmitting(false);
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Triple check right before API call - verify registration status again
            try {
                const statusResponse = await fetch(`${API_BASE_URL}/registrations/check/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    if (statusData.isRegistered) {
                        setIsAlreadyRegistered(true);
                        setPaymentError('You are already registered for this event');
                        setShowPaymentModal(false);
                        setIsSubmitting(false);
                        return;
                    }
                }
            } catch (statusErr) {
                console.warn('Could not verify registration status:', statusErr);
                // Continue anyway if we can't check
            }

            // For demo: simulate payment processing
            // In production, integrate with real payment gateway
            if (paymentMethod === 'stripe') {
                // Validate card data
                if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv) {
                    setPaymentError('Please fill in all card details');
                    setIsSubmitting(false);
                    return;
                }
                
                // Simulate Stripe payment
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // Create registration after payment
            if (!event || !event._id && !event.id) {
                setPaymentError('Event information is missing. Please reload and try again.');
                setShowPaymentModal(false);
                setIsSubmitting(false);
                return;
            }

            const registrationData = {
                eventId: event._id || event.id,
                attendeeInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    fullName: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone
                },
                numberOfTickets: formData.numberOfTickets,
                totalPrice: totalPrice,
                paymentMethod: paymentMethod,
                ticketType: 'standard'
            };

            const response = await fetch(`${API_BASE_URL}/registrations/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(registrationData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const result = await response.json();
            setRegistrationSuccess(true);
            setShowPaymentModal(false);
            
            // Redirect to success page after 2 seconds
            setTimeout(() => {
                navigate('/my-registrations', { state: { newRegistration: true } });
            }, 2000);

        } catch (error) {
            console.error('Payment/Registration failed:', error);
            
            // Check if user is already registered
            if (error.message && error.message.includes('already registered')) {
                setIsAlreadyRegistered(true);
                setPaymentError('You are already registered for this event');
                setShowPaymentModal(false);
                // Redirect after 1.5 seconds
                setTimeout(() => {
                    navigate('/my-registrations');
                }, 1500);
            } else {
                setPaymentError(error.message || 'Payment processing failed');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const totalPrice = (event?.price || 0) * formData.numberOfTickets;

    if (loading || !registrationCheckComplete) {
        return <LoadingSpinner message="Loading event details..." />;
    }

    if (!event) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Event not found
                </Alert>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/events')}>
                    Back to Events
                </Button>
            </Container>
        );
    }

    if (isAlreadyRegistered) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                    You are already registered for this event!
                </Alert>
                <Typography variant="body1" sx={{ mb: 3, color: '#64748b' }}>
                    You have already completed the registration for <strong>{event.title}</strong>. 
                    You can view your registration details in your registrations page.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/my-registrations')}
                    >
                        View My Registrations
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate(`/events/${event._id || event.id}`)}
                    >
                        Back to Event
                    </Button>
                </Box>
            </Container>
        );
    }

    if (registrationSuccess) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <Box sx={{ mb: 3 }}>
                    <CheckCircle sx={{ fontSize: 80, color: '#10b981' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
                    Registration Successful! 🎉
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
                    Thank you for registering. A confirmation email has been sent to {formData.email}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
                    Redirecting to your registrations...
                </Typography>
                <Button variant="contained" onClick={() => navigate('/my-registrations')}>
                    View My Registrations
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => (event?.id || event?._id) && navigate(`/events/${event.id || event._id}`)}
                sx={{ mb: 3 }}
            >
                Back to Event
            </Button>

            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 4, color: '#1e293b' }}>
                Quick Registration - {event.title}
            </Typography>

            <Grid container spacing={4}>
                {/* Event Summary Card */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ position: 'sticky', top: 100 }}>
                        <CardContent>
                            <Box
                                component="img"
                                src={event.image}
                                alt={event.title}
                                sx={{ width: '100%', height: 200, borderRadius: 1, mb: 2, objectFit: 'cover' }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                {event.title}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <CalendarToday fontSize="small" color="primary" />
                                <Typography variant="body2">{formatDate(event.date)}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <AccessTime fontSize="small" color="primary" />
                                <Typography variant="body2">{event.time}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <LocationOn fontSize="small" color="primary" />
                                <Typography variant="body2">{event.location}</Typography>
                            </Box>

                            {/* Price Summary */}
                            <Box sx={{ background: '#f8fafc', p: 2, borderRadius: 1, mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">
                                        Ticket Price: ₹{event.price}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        x {formData.numberOfTickets}
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    pt: 1,
                                    borderTop: '1px solid #e2e8f0'
                                }}>
                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                        Total:
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                                        ₹{totalPrice}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Registration Form */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                Enter Your Details
                            </Typography>

                            {paymentError && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {paymentError}
                                </Alert>
                            )}

                            {isAlreadyRegistered && (
                                <Alert severity="warning" sx={{ mb: 3 }}>
                                    ✅ You are already registered for this event! <br />
                                    <Button size="small" onClick={() => navigate('/my-registrations')}>
                                        View Your Registration
                                    </Button>
                                </Alert>
                            )}

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        value={formData.firstName}
                                        onChange={handleInputChange('firstName')}
                                        error={!!errors.firstName}
                                        helperText={errors.firstName}
                                        placeholder="John"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        value={formData.lastName}
                                        onChange={handleInputChange('lastName')}
                                        error={!!errors.lastName}
                                        helperText={errors.lastName}
                                        placeholder="Doe"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange('email')}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        placeholder="john@example.com"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        value={formData.phone}
                                        onChange={handleInputChange('phone')}
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        placeholder="9876543210"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Number of Tickets"
                                        type="number"
                                        inputProps={{ min: 1, max: 10 }}
                                        value={formData.numberOfTickets}
                                        onChange={handleInputChange('numberOfTickets')}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={handleProceedToPayment}
                                        disabled={isAlreadyRegistered}
                                        sx={{
                                            background: isAlreadyRegistered ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                            py: 1.5,
                                            fontWeight: 600,
                                            cursor: isAlreadyRegistered ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        <CreditCard sx={{ mr: 1 }} />
                                        {isAlreadyRegistered ? 'Already Registered' : `Proceed to Payment - ₹${totalPrice}`}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Payment Modal */}
            <Dialog open={showPaymentModal} onClose={() => !isSubmitting && setShowPaymentModal(false)} maxWidth="sm" fullWidth disableEnforceFocus>
                <DialogTitle sx={{ fontWeight: 600 }}>Choose Payment Method</DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
                        Total Amount: <strong sx={{ color: '#3b82f6', fontSize: '18px' }}>₹{totalPrice}</strong>
                    </Typography>

                    <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                        <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>Select Payment Method</FormLabel>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    border: '2px solid',
                                    borderColor: paymentMethod === 'stripe' ? '#3b82f6' : '#e2e8f0',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onClick={() => setPaymentMethod('stripe')}
                            >
                                <FormControlLabel
                                    value="stripe"
                                    control={<Radio checked={paymentMethod === 'stripe'} />}
                                    label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CreditCard />
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Credit/Debit Card</Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Secure payment via Stripe</Typography>
                                        </Box>
                                    </Box>}
                                />
                            </Box>

                            <Box
                                sx={{
                                    p: 2,
                                    border: '2px solid',
                                    borderColor: paymentMethod === 'upi' ? '#3b82f6' : '#e2e8f0',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onClick={() => setPaymentMethod('upi')}
                            >
                                <FormControlLabel
                                    value="upi"
                                    control={<Radio checked={paymentMethod === 'upi'} />}
                                    label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalAtm />
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>UPI</Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Fast & Secure UPI Payment</Typography>
                                        </Box>
                                    </Box>}
                                />
                            </Box>
                        </Box>
                    </FormControl>

                    {paymentError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {paymentError}
                        </Alert>
                    )}

                    {paymentMethod === 'stripe' && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Card Details</Typography>
                            <TextField
                                fullWidth
                                label="Card Number"
                                placeholder="4242 4242 4242 4242"
                                value={cardData.cardNumber}
                                onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Expiry Date"
                                        placeholder="MM/YY"
                                        value={cardData.expiryDate}
                                        onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="CVV"
                                        placeholder="123"
                                        value={cardData.cvv}
                                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#94a3b8' }}>
                                Test Card: 4242 4242 4242 4242 | 12/25 | 123
                            </Typography>
                        </Box>
                    )}

                    {paymentMethod === 'upi' && (
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="UPI ID"
                                placeholder="yourname@upi"
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                You'll be redirected to your UPI app to complete the payment
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => setShowPaymentModal(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handlePaymentSubmit}
                            disabled={isSubmitting}
                            sx={{ position: 'relative' }}
                        >
                            {isSubmitting ? (
                                <>
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                    Processing...
                                </>
                            ) : (
                                `Pay ₹${totalPrice}`
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default SimpleEventRegistration;
