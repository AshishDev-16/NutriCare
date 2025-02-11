import { useEffect, useState } from 'react';

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

    const login = (userData: User) => {
        console.log('Login called with:', userData);
        
        // Store token and user data separately
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify({
            _id: userData._id,
            role: userData.role,
            name: userData.name,
            email: userData.email
        }));
        
        setUser(userData);
    };

    const logout = () => {
        console.log('Logout called');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return { 
        user,
        login,
        logout,
        isAuthenticated: !!user
    };
};

export default useAuth; 