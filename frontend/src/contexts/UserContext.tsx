"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/api';
import { getToken } from '@/lib/auth';

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    city?: string;
    dateOfBirth?: string;
    gender?: string;
    height?: number;
    weight?: number;
    bloodType?: string;
    age?: number;
}

interface UserContextType {
    user: UserProfile | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    updateUser: (data: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const token = getToken();
            if (!token) {
                setLoading(false);
                return;
            }
            const data = await apiRequest('/users/me', 'GET', null, token);
            setUser(data);
        } catch (err) {
            console.error('Failed to fetch user', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const refreshUser = useCallback(async () => {
        await fetchUser();
    }, [fetchUser]);

    const updateUser = useCallback((data: Partial<UserProfile>) => {
        setUser(prev => prev ? { ...prev, ...data } : null);
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, refreshUser, updateUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
