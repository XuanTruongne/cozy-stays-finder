import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithOtp: (emailOrPhone: string, type: 'email' | 'phone') => Promise<{ error: Error | null }>;
  verifyOtp: (emailOrPhone: string, token: string, type: 'email' | 'phone') => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error: error as Error | null };
  };

  const signInWithOtp = async (emailOrPhone: string, type: 'email' | 'phone') => {
    const redirectUrl = `${window.location.origin}/`;
    
    if (type === 'email') {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailOrPhone,
        options: {
          emailRedirectTo: redirectUrl,
        }
      });
      return { error: error as Error | null };
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        phone: emailOrPhone,
      });
      return { error: error as Error | null };
    }
  };

  const verifyOtp = async (emailOrPhone: string, token: string, type: 'email' | 'phone') => {
    if (type === 'email') {
      const { error } = await supabase.auth.verifyOtp({
        email: emailOrPhone,
        token,
        type: 'email',
      });
      return { error: error as Error | null };
    } else {
      const { error } = await supabase.auth.verifyOtp({
        phone: emailOrPhone,
        token,
        type: 'sms',
      });
      return { error: error as Error | null };
    }
  };

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      }
    });
    
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signUp, 
      signIn, 
      signInWithOtp, 
      verifyOtp, 
      signInWithGoogle, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
