import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginChoice = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Welcome to EventEase</h1>
                <p style={styles.subtitle}>Choose your authentication method</p>
                
                {/* Password Login Section */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>🔑 Password Login</h3>
                    <p style={styles.sectionDescription}>Use email & password to access your account</p>
                    <div style={styles.buttonsContainer}>
                        <button 
                            style={styles.secondaryButton}
                            onClick={() => navigate('/login')}
                        >
                            <div style={styles.buttonIcon}>🔐</div>
                            <div style={styles.buttonText}>Unified Login</div>
                            <div style={styles.buttonDescription}>Auto-redirect</div>
                        </button>

                        <button 
                            style={styles.adminButton}
                            onClick={() => navigate('/login-admin')}
                        >
                            <div style={styles.buttonIcon}>👑</div>
                            <div style={styles.buttonText}>Admin</div>
                            <div style={styles.buttonDescription}>Login</div>
                        </button>

                        <button 
                            style={styles.userButton}
                            onClick={() => navigate('/login-user')}
                        >
                            <div style={styles.buttonIcon}>👤</div>
                            <div style={styles.buttonText}>User</div>
                            <div style={styles.buttonDescription}>Login</div>
                        </button>
                    </div>
                </div>

                <div style={styles.divider}>
                    <span style={styles.dividerText}>OR</span>
                </div>

                {/* Sign Up Section */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>✨ Create New Account</h3>
                    <p style={styles.sectionDescription}>Join EventEase and discover amazing events</p>
                    <div style={styles.buttonsContainer}>
                        <button 
                            style={styles.primaryButton}
                            onClick={() => navigate('/register')}
                        >
                            <div style={styles.buttonIcon}>📝</div>
                            <div style={styles.buttonText}>Sign Up</div>
                            <div style={styles.buttonDescription}>Create Account</div>
                        </button>
                    </div>
                </div>

                <p style={styles.footer}>
                    By continuing, you agree to our Terms & Conditions
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
        minHeight: '90vh',
        padding: '20px',
        backgroundColor: '#f8fafc'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px 35px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '650px'
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: '8px',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: '16px',
        color: '#64748b',
        marginBottom: '35px',
        textAlign: 'center'
    },
    section: {
        marginBottom: '30px'
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: '8px'
    },
    sectionDescription: {
        fontSize: '13px',
        color: '#64748b',
        marginBottom: '18px'
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        margin: '35px 0',
        position: 'relative'
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        backgroundColor: '#e2e8f0'
    },
    dividerText: {
        paddingX: '15px',
        color: '#94a3b8',
        fontSize: '12px',
        fontWeight: '600'
    },
    buttonsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px'
    },
    primaryButton: {
        padding: '22px 16px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '600',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)'
        }
    },
    secondaryButton: {
        padding: '22px 16px',
        backgroundColor: '#059669',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(5, 150, 105, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: '600'
    },
    adminButton: {
        padding: '22px 16px',
        backgroundColor: '#7c3aed',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(124, 58, 237, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: '600'
    },
    userButton: {
        padding: '22px 16px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: '600'
    },
    buttonIcon: {
        fontSize: '28px',
        marginBottom: '6px'
    },
    buttonText: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '2px'
    },
    buttonDescription: {
        fontSize: '11px',
        opacity: 0.85,
        fontWeight: '500'
    },
    link: {
        color: '#64748b',
        fontSize: '14px',
        textAlign: 'center'
    },
    linkText: {
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: 'bold'
    },
    footer: {
        color: '#94a3b8',
        fontSize: '12px',
        textAlign: 'center',
        marginTop: '25px',
        paddingTop: '20px',
        borderTop: '1px solid #e2e8f0'
    }
};

export default LoginChoice;