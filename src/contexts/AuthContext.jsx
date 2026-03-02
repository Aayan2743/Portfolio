import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/utils';
const AuthContext = createContext(undefined);
// Mock user database
const MOCK_USERS_KEY = 'portfolio_users';
const ADMIN_SESSION_KEY = 'portfolio_admin_session';
const USER_SESSION_KEY = 'portfolio_user_session';
const TOKEN_KEY = 'token';
const TOKEN_TYPE_KEY = 'token_type';
export const AuthProvider = ({ children }) => {
    const [adminUser, setAdminUser] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const clearAdminAuth = () => {
        setAdminUser(null);
        localStorage.removeItem(ADMIN_SESSION_KEY);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_TYPE_KEY);
    };
    useEffect(() => {
        // Check for existing sessions on mount
        const adminSession = localStorage.getItem(ADMIN_SESSION_KEY);
        if (adminSession) {
            try {
                const token = localStorage.getItem(TOKEN_KEY);
                if (!token) {
                    localStorage.removeItem(ADMIN_SESSION_KEY);
                }
                else {
                    setAdminUser(JSON.parse(adminSession));
                }
            }
            catch {
                localStorage.removeItem(ADMIN_SESSION_KEY);
            }
        }

        // Check for OTP-authenticated user
        const userToken = localStorage.getItem('portfolio_user_token');
        const userData = localStorage.getItem('portfolio_user_data');
        
        if (userToken && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                // Also set in USER_SESSION_KEY for compatibility
                localStorage.setItem(USER_SESSION_KEY, userData);
                // Dispatch event to notify other components
                window.dispatchEvent(new Event('user-auth-updated'));
            }
            catch {
                localStorage.removeItem('portfolio_user_token');
                localStorage.removeItem('portfolio_user_data');
            }
        } else {
            // Fallback to old user session
            const userSession = localStorage.getItem(USER_SESSION_KEY);
            if (userSession) {
                try {
                    setUser(JSON.parse(userSession));
                }
                catch {
                    localStorage.removeItem(USER_SESSION_KEY);
                }
            }
        }
        
        setIsAuthReady(true);
    }, []);
    const getMockUsers = () => {
        try {
            const users = localStorage.getItem(MOCK_USERS_KEY);
            return users ? JSON.parse(users) : [];
        }
        catch {
            return [];
        }
    };
    const saveMockUsers = (users) => {
        localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    };
    const adminLogin = async (username, password) => {
        try {
            const response = await apiClient.post('auth/admin-login', {
                username,
                password,
            });
            const data = response?.data;
            if (!data?.success || !data?.token || !data?.user) {
                return false;
            }
            const admin = data.user;
            setAdminUser(admin);
            localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(TOKEN_TYPE_KEY, data.token_type || 'Bearer');
            return true;
        }
        catch {
            clearAdminAuth();
            return false;
        }
    };
    const adminLogout = () => {
        clearAdminAuth();
    };
    const userLogin = async (email, password) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const users = getMockUsers();
        // For mock, we store password in a separate key (not secure, just for demo)
        const passwordsKey = 'portfolio_user_passwords';
        const passwords = JSON.parse(localStorage.getItem(passwordsKey) || '{}');
        const foundUser = users.find(u => u.email === email);
        if (foundUser && passwords[email] === password) {
            setUser(foundUser);
            localStorage.setItem(USER_SESSION_KEY, JSON.stringify(foundUser));
            return true;
        }
        return false;
    };
    const userRegister = async (email, password, name) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const users = getMockUsers();
        if (users.some(u => u.email === email)) {
            return false; // Email already exists
        }
        const newUser = {
            id: `user-${Date.now()}`,
            email,
            name,
            role: 'user',
        };
        // Store password separately (mock only)
        const passwordsKey = 'portfolio_user_passwords';
        const passwords = JSON.parse(localStorage.getItem(passwordsKey) || '{}');
        passwords[email] = password;
        localStorage.setItem(passwordsKey, JSON.stringify(passwords));
        saveMockUsers([...users, newUser]);
        setUser(newUser);
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newUser));
        return true;
    };
    const userLogout = () => {
        setUser(null);
        localStorage.removeItem(USER_SESSION_KEY);
        // Also clear OTP authentication tokens
        localStorage.removeItem('portfolio_user_token');
        localStorage.removeItem('portfolio_user_data');
        localStorage.removeItem('portfolio_visitor_mobile');
    };
    const updateUserProfile = (updates) => {
        if (!user)
            return;
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedUser));
        // Update in mock database
        const users = getMockUsers();
        const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
        saveMockUsers(updatedUsers);
    };
    return (<AuthContext.Provider value={{
            adminUser,
            user,
            isAuthReady,
            isAdminAuthenticated: !!adminUser,
            isUserAuthenticated: !!user,
            adminLogin,
            adminLogout,
            userLogin,
            userRegister,
            userLogout,
            updateUserProfile,
        }}>
      {children}
    </AuthContext.Provider>);
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
