import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // True until we check if user is logged in

    // Check if user is already logged in (on app load)
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await authAPI.getMe();
                setUser(data.data.user);
            } catch {
                // Token invalid — try refresh
                try {
                    const { data } = await authAPI.refresh();
                    localStorage.setItem('accessToken', data.data.accessToken);
                    const meRes = await authAPI.getMe();
                    setUser(meRes.data.data.user);
                } catch {
                    // Both failed — clear everything
                    localStorage.removeItem('accessToken');
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = useCallback(async (email, password) => {
        const { data } = await authAPI.login({ email, password });
        localStorage.setItem('accessToken', data.data.accessToken);
        setUser(data.data.user);
        return data;
    }, []);

    const register = useCallback(async (name, email, password) => {
        const { data } = await authAPI.register({ name, email, password });
        return data;
    }, []);

    const verifyOTP = useCallback(async (email, otp) => {
        const { data } = await authAPI.verifyOTP({ email, otp });
        localStorage.setItem('accessToken', data.data.accessToken);
        setUser(data.data.user);
        return data;
    }, []);

    const forgotPassword = useCallback(async (email) => {
        const { data } = await authAPI.forgotPassword({ email });
        return data;
    }, []);

    const resetPassword = useCallback(async (email, otp, newPassword) => {
        const { data } = await authAPI.resetPassword({ email, otp, newPassword });
        return data;
    }, []);

    const resendOTP = useCallback(async (email, purpose) => {
        const { data } = await authAPI.resendOTP({ email, purpose });
        return data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authAPI.logout();
        } catch {
            // Ignore errors on logout
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('resumeData');
        localStorage.removeItem('activeResumeId');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                register,
                verifyOTP,
                forgotPassword,
                resetPassword,
                resendOTP,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
