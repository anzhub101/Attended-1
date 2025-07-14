import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    // Check for existing session
    const checkExistingSession = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('mockUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setSession({ user: userData });
        }
      } catch (error) {
        console.error('Error loading saved user:', error);
      }
      setIsLoading(false);
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - accept any email/password for demo
      if (email && password) {
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock sign up - create user with provided data
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
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
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