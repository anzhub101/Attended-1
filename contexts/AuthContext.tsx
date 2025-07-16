import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  studentId: string;
} 

interface AuthContextType {
  user: User | null;
  session: any;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, userData: { name: string; studentId: string; department?: string; faculty?: string; phone?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: 'mock-user-id',
  email: '1095305@adu.ac.ae',
  name: 'Mohamed Anzeem',
  studentId: '1095305',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          // Fallback to mock user for development
          const savedUser = await AsyncStorage.getItem('mockUser');
          if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setSession({ user: userData });
          }
        } else if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            studentId: session.user.user_metadata?.student_id || 'N/A',
          };
          setUser(userData);
          setSession(session);
        } else {
          // Fallback to mock user for development
          const savedUser = await AsyncStorage.getItem('mockUser');
          if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setSession({ user: userData });
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        // Fallback to mock user
        try {
          const savedUser = await AsyncStorage.getItem('mockUser');
          if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setSession({ user: userData });
          }
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
        }
      }
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            studentId: session.user.user_metadata?.student_id || 'N/A',
          };
          setUser(userData);
          setSession(session);
        } else {
          setUser(null);
          setSession(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Try Supabase auth first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (data.user && !error) {
        return true;
      }
      
      // Fallback to mock authentication for development
      if (email && password) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const userData = { ...mockUser, email };
        setUser(userData);
        setSession({ user: userData });
        await AsyncStorage.setItem('mockUser', JSON.stringify(userData));
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
      // Try Supabase auth first
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
          }
        }
      });
      
      if (data.user && !error) {
        return true;
      }
      
      // Fallback to mock sign up for development
      if (email && password) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newUser: User = {
          id: 'mock-user-' + Date.now(),
          email,
          name: userData.name,
          studentId: userData.studentId,
        };
        
        setUser(newUser);
        setSession({ user: newUser });
        await AsyncStorage.setItem('mockUser', JSON.stringify(newUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Try Supabase logout first
      await supabase.auth.signOut();
      
      // Clear local state
      setUser(null);
      setSession(null);
      await AsyncStorage.removeItem('mockUser');
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