import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    // Password registration
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [localError, setLocalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Password Registration
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMessage('');
        
        if (formData.password !== formData.confirmPassword) {
            setLocalError("Passwords don't match!");
            return;
        }

        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        
        try {
            console.log('📝 Starting registration process...');
            const result = await register(formData);
            console.log('📊 Registration result:', result);
            
            if (result.success) {
                setSuccessMessage('✅ Registration successful! Redirecting to dashboard...');
                setTimeout(() => {
                    const userData = JSON.parse(localStorage.getItem('user') || '{}');
                    console.log('👤 User data from localStorage:', userData);
                    
                    if (userData.role === 'admin') {
                        navigate('/admin-panel', { replace: true });
                    } else {
                        navigate('/user-dashboard', { replace: true });
                    }
                }, 500);
            } else {
                const errorMessage = result.error || 'Registration failed. Please try again.';
                setLocalError(errorMessage);
                console.error('❌ Registration failed:', errorMessage);
            }
        } catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred during registration';
            setLocalError(errorMessage);
            console.error('❌ Registration exception:', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>👤 Sign Up</h2>
                
                {localError && <div style={styles.error}>{localError}</div>}
                {successMessage && <div style={styles.success}>{successMessage}</div>}

                <form onSubmit={handleSubmitPassword} style={styles.form}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        style={styles.input}
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password (minimum 6 characters)"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={styles.input}
                        required
                        disabled={isLoading}
                    />
                    <button type="submit" style={styles.button} disabled={isLoading}>
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                <p style={styles.link}>
                    Already have an account? <Link to="/login" style={styles.linkText}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '16px',
        '@media (min-width: 640px)': {
            padding: '20px'
        }
    },
    card: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        '@media (min-width: 640px)': {
            padding: '32px'
        },
        '@media (min-width: 768px)': {
            padding: '40px'
        }
    },
    title: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#1e293b',
        fontSize: '20px',
        '@media (min-width: 640px)': {
            fontSize: '24px'
        },
        '@media (min-width: 768px)': {
            fontSize: '28px'
        }
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #fecaca',
        fontSize: '12px',
        '@media (min-width: 640px)': {
            fontSize: '14px'
        }
    },
    success: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #bbf7d0',
        fontSize: '12px',
        '@media (min-width: 640px)': {
            fontSize: '14px'
        }
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    input: {
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'border-color 0.3s',
        '@media (min-width: 640px)': {
            padding: '12px 16px',
            fontSize: '16px'
        }
    },
    button: {
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '10px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        '@media (min-width: 640px)': {
            padding: '12px',
            fontSize: '16px'
        }
    },
    link: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#64748b',
        fontSize: '13px',
        '@media (min-width: 640px)': {
            fontSize: '14px'
        }
    },
    linkText: {
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: 'bold'
    }
};

export default Register;