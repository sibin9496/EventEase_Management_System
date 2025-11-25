import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Get API Base URL - use /api proxy for development
const API_BASE_URL = '/api';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [backendConnected, setBackendConnected] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (userData && token) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            console.log('🔐 Attempting login for:', email);
            
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            console.log('📡 Login response status:', response.status);
            const data = await response.json();
            console.log('📦 Login response data:', data);

            if (!response.ok) {
                const errorMsg = data.message || data.error || 'Login failed';
                console.error('❌ Login error:', errorMsg);
                setError(errorMsg);
                return { success: false, error: errorMsg };
            }

            // Handle different response formats
            const token = data.token;
            const user = data.user || data.data || { id: data.id, email, name: email.split('@')[0], role: 'user' };

            console.log('✅ Login successful! User:', user);

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            setBackendConnected(true);
            
            return { success: true, user };
        } catch (err) {
            const message = err.message || 'Network error during login';
            console.error('❌ Login catch error:', message);
            setError(message);
            setBackendConnected(false);
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            console.log('📝 Attempting registration for:', userData.email);
            
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    password: userData.password
                })
            });

            console.log('📡 Register response status:', response.status);
            const data = await response.json();
            console.log('📦 Register response data:', data);

            if (!response.ok) {
                const errorMsg = data.message || data.errors?.[0]?.msg || data.error || 'Registration failed';
                console.error('❌ Registration error:', errorMsg);
                setError(errorMsg);
                return { success: false, error: errorMsg };
            }

            // Handle different response formats
            const token = data.token;
            const user = data.user || data.data || { id: data.id, email: userData.email, name: userData.name, role: 'user' };

            console.log('✅ Registration successful! User:', user);

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            
            return { success: true, user };
        } catch (err) {
            const message = err.message || 'Network error during registration';
            console.error('❌ Register catch error:', message);
            setError(message);
            return { success: false, error: message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setError(null);
    };

    const value = {
        user,
        loading,
        error,
        setError,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        backendConnected
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};