import { useEffect, useState, useCallback } from 'react';

interface User {
    _id: string;
    token: string;
    role: 'manager' | 'pantry_staff';
    name: string;
    email: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            console.log('Loading user data from localStorage:', { 
                hasToken: !!token, 
                hasStoredUser: !!storedUser 
            });

            if (token && storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    console.log('Parsed stored user:', userData);
                    
                    // Combine token with user data
                    const fullUserData = {
                        ...userData,
                        token
                    };
                    
                    console.log('Setting user state with:', fullUserData);
                    setUser(fullUserData);
                } catch (error) {
                    console.error('Error parsing stored user data:', error);
                    // Clear invalid data
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } else {
                console.log('No valid user data found in localStorage');
                setUser(null);
            }
        };

        loadUser();
    }, []);

    const logout = useCallback(() => {
        console.log('Logout called');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivity');
        setUser(null);
    }, []);

    // Activity tracking for auto-logout (30 mins)
    useEffect(() => {
        if (!user) return;

        const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
        
        const checkSession = () => {
            const isEnabled = localStorage.getItem('autoLogoutEnabled') !== 'false';
            if (!isEnabled) return;

            const lastActivity = localStorage.getItem('lastActivity');
            if (lastActivity) {
                const now = Date.now();
                if (now - parseInt(lastActivity) > TIMEOUT_MS) {
                    console.log('Session expired due to inactivity');
                    logout();
                }
            } else {
                localStorage.setItem('lastActivity', Date.now().toString());
            }
        };

        const updateActivity = () => {
            localStorage.setItem('lastActivity', Date.now().toString());
        };

        // Check every minute
        const interval = setInterval(checkSession, 60000);
        
        // Listen for user activity
        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('click', updateActivity);
        window.addEventListener('scroll', updateActivity);

        return () => {
            clearInterval(interval);
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('click', updateActivity);
            window.removeEventListener('scroll', updateActivity);
        };
    }, [user, logout]);

    const login = (userData: User) => {
        console.log('Login called with:', userData);
        
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify({
            _id: userData._id,
            role: userData.role,
            name: userData.name,
            email: userData.email
        }));
        localStorage.setItem('lastActivity', Date.now().toString());
        
        setUser(userData);
    };

    return { 
        user,
        login,
        logout,
        isAuthenticated: !!user
    };
};

export default useAuth; 