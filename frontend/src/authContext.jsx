import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setCurrentUser(userId);
        }
        setLoading(false);
    }, []);

    const login = (userId, token) => {
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
        setCurrentUser(userId);
    };

    const signup = (userId, token) => {
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
        setCurrentUser(userId);
    };

    const signout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        setCurrentUser,
        loading,
        login,
        signup,
        signout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}