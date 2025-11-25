import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setIsLoading(true);
        
        try {
            const result = await login(email, password);
            if (result.success) {
                // Verify admin role in AuthContext
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                if (userData.role === 'admin') {
                    navigate('/admin-panel');
                } else {
                    setLocalError('Only admins can access this page');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } else {
                setLocalError(result.error || 'Login failed');
            }
        } catch (err) {
            setLocalError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.icon}>👑</div>
                    <h2 style={styles.title}>Admin Login</h2>
                </div>
                
                {localError && <div style={styles.error}>{localError}</div>}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            placeholder="Enter admin email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Admin Sign In'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <Link to="/login-choice" style={styles.backLink}>← Back to Login Choice</Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        padding: '20px',
        backgroundColor: '#f8fafc'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    icon: {
        fontSize: '48px',
        marginBottom: '15px'
    },
    title: {
        color: '#7c3aed',
        fontSize: '28px',
        margin: '0'
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #fecaca',
        fontSize: '14px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        color: '#334155',
        fontSize: '14px',
        fontWeight: '600'
    },
    input: {
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '16px',
        transition: 'border-color 0.3s',
        fontFamily: 'inherit'
    },
    button: {
        backgroundColor: '#7c3aed',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginTop: '10px'
    },
    footer: {
        textAlign: 'center',
        marginTop: '20px'
    },
    backLink: {
        color: '#7c3aed',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500'
    }
};

export default AdminLogin;
