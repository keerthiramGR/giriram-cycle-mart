"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    let supabase = null;
    try {
      supabase = createClient();
    } catch(e) {
      // Supabase env vars might not be set; allow app to work without auth
    }

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);
                }
            } catch(e) {
                console.error('Auth session error:', e);
            }
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session.user);
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const signIn = async ({ email, password }) => {
        if (!supabase) return { error: { message: 'Supabase not configured' } };
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        return { data, error };
    };

    const signUp = async ({ email, password, options }) => {
        if (!supabase) return { error: { message: 'Supabase not configured' } };
        const { data, error } = await supabase.auth.signUp({ email, password, options });
        return { data, error };
    };

    const signOut = async () => {
        if (supabase) await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            isAdmin: profile?.role === 'admin',
            signIn,
            signUp,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
