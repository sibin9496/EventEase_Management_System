import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMessage('');
        setIsLoading(true);
        
        try {
            console.log('🔐 Starting login process...');
            const result = await login(email, password);
            console.log('📊 Login result:', result);
            
            if (result.success) {
                setSuccessMessage('✅ Login successful! Redirecting...');
                // Get the user data that was just set
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
                const errorMessage = result.error || 'Login failed. Please check your credentials.';
                setLocalError(errorMessage);
                console.error('❌ Login failed:', errorMessage);
            }
        } catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred during login';
            setLocalError(errorMessage);
            console.error('❌ Login exception:', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>🔑 Login</h2>
                
                {localError && <div style={styles.error}>{localError}</div>}
                {successMessage && <div style={styles.success}>{successMessage}</div>}

                <form onSubmit={handlePasswordLogin} style={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                        disabled={isLoading}
                    />
                    <button type="submit" style={styles.button} disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p style={styles.link}>
                    Don't have an account? <Link to="/register" style={styles.linkText}>Sign up</Link>
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

export default Login;