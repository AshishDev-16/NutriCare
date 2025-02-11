"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
    role: 'manager' | 'pantry_staff';
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, role: 'manager' | 'pantry_staff') => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = () => {
            try {
                const token = localStorage.getItem('token');
                const role = localStorage.getItem('userRole');

                console.log('AuthContext: Initial load', {
                    token: token ? 'present' : 'missing',
                    role,
                    localStorage: {
                        token: !!localStorage.getItem('token'),
                        userRole: localStorage.getItem('userRole')
                    }
                });

                if (token && role) {
                    const email = role === 'manager' 
                        ? 'hospital_manager@xyz.com' 
                        : 'hospital_pantry@xyz.com';

                    const userData = {
                        role: role as 'manager' | 'pantry_staff',
                        email
                    };
                    console.log('AuthContext: Setting user data', userData);
                    setUser(userData);
                } else {
                    console.log('AuthContext: Missing token or role');
                    setUser(null);
                }
            } catch (error) {
                console.error('AuthContext: Error loading user', error);
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = (token: string, role: 'manager' | 'pantry_staff') => {
        console.log('AuthContext: Login called with', {
            token: token ? 'present' : 'missing',
            role,
            currentLocalStorage: {
                token: !!localStorage.getItem('token'),
                userRole: localStorage.getItem('userRole')
            }
        });
        
        // Store both token and role
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);

        console.log('AuthContext: After storage', {
            storedToken: !!localStorage.getItem('token'),
            storedRole: localStorage.getItem('userRole')
        });

        const email = role === 'manager' 
            ? 'hospital_manager@xyz.com' 
            : 'hospital_pantry@xyz.com';
            
        const userData = { role, email };
        console.log('AuthContext: Setting user state to', userData);
        setUser(userData);
    };

    const logout = () => {
        console.log('AuthContext: Logout called');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setUser(null);
    };

    if (isLoading) {
        return null; // or a loading spinner
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 