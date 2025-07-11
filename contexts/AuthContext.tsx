import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  studentId: string;
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, userData: { name: string; studentId: string; department?: string; faculty?: string; phone?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'Student',
          studentId: session.user.user_metadata?.student_id || 'N/A',
        });
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'Student',
          studentId: session.user.user_metadata?.student_id || 'N/A',
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check for demo credentials first
      if (email === 'demo@student.com' && password === 'demo123') {
        // Create a mock session for demo user
        const mockUser = {
          id: 'demo-user-id',
          email: 'demo@student.com',
          name: 'Demo Student',
          studentId: 'STU001',
        };
        setUser(mockUser);
        setSession({ user: { id: 'demo-user-id', email: 'demo@student.com', user_metadata: { name: 'Demo Student', student_id: 'STU001' } } });
        return true;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (data.user) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: { name: string; studentId: string; department?: string; faculty?: string; phone?: string }
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            student_id: userData.studentId,
            department: userData.department,
            faculty: userData.faculty,
            phone: userData.phone,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error.message);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, signUp, logout, isLoading }}>
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