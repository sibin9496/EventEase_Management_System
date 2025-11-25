// Simple and reliable auth service
const authService = {
    register: async (userData) => {
        console.log('Registering user:', userData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create consistent response
        const response = {
            data: {
                success: true,
                token: 'mock-token-' + Date.now(),
                user: {
                    id: '1',
                    name: userData.name,
                    email: userData.email,
                    role: userData.role || 'user',
                    phone: userData.phone || ''
                }
            }
        };
        
        return response;
    },
    
    login: async (credentials) => {
        console.log('Logging in:', credentials.email);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create consistent response
        const response = {
            data: {
                success: true,
                token: 'mock-token-' + Date.now(),
                user: {
                    id: '1',
                    name: credentials.email.split('@')[0] || 'User',
                    email: credentials.email,
                    role: 'user'
                }
            }
        };
        
        return response;
    },
    
    getMe: async () => {
        console.log('Getting user data');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check localStorage first
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                return {
                    data: {
                        success: true,
                        data: userData
                    }
                };
            }
        } catch (error) {
            console.log('Error parsing saved user:', error);
        }
        
        // Return default user
        return {
            data: {
                success: true,
                data: {
                    id: '1',
                    name: 'Demo User',
                    email: 'demo@eventease.com',
                    role: 'user'
                }
            }
        };
    },
    
    updateProfile: async (userData) => {
        console.log('Updating profile:', userData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { 
            data: { 
                success: true, 
                data: userData 
            } 
        };
    },
    
    updatePassword: async () => {
        console.log('Updating password');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { 
            data: { 
                success: true 
            } 
        };
    }
};

export { authService };