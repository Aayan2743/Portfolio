import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(undefined);
// Mock admin credentials
const MOCK_ADMIN = {
    email: 'admin@portfolio.com',
    password: 'admin123',
};
// Mock user database
const MOCK_USERS_KEY = 'portfolio_users';
const ADMIN_SESSION_KEY = 'portfolio_admin_session';
const USER_SESSION_KEY = 'portfolio_user_session';
export const AuthProvider = ({ children }) => {
    const [adminUser, setAdminUser] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    useEffect(() => {
        // Check for existing sessions on mount
        const adminSession = localStorage.getItem(ADMIN_SESSION_KEY);
        if (adminSession) {
            try {
                setAdminUser(JSON.parse(adminSession));
            }
            catch {
                localStorage.removeItem(ADMIN_SESSION_KEY);
            }
        }
        const userSession = localStorage.getItem(USER_SESSION_KEY);
        if (userSession) {
            try {
                setUser(JSON.parse(userSession));
            }
            catch {
                localStorage.removeItem(USER_SESSION_KEY);
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
    const adminLogin = async (email, password) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
            const admin = {
                id: 'admin-1',
                email: MOCK_ADMIN.email,
                name: 'Admin User',
                role: 'admin',
            };
            setAdminUser(admin);
            localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
            return true;
        }
        return false;
    };
    const adminLogout = () => {
        setAdminUser(null);
        localStorage.removeItem(ADMIN_SESSION_KEY);
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
