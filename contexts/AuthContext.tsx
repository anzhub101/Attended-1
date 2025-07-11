import React, { createContext, useContext, useState, useEffect } from 'react';

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
  email: 'student@adu.ac.ae',
  name: 'Ahmed Al-Mansouri',
  studentId: 'ADU2024001',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const timer = setTimeout(() => {
      // Check if user was previously logged in (mock localStorage check)
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setSession({ user: JSON.parse(savedUser) });
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
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
        localStorage.setItem('mockUser', JSON.stringify(userData));
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
      localStorage.setItem('mockUser', JSON.stringify(newUser));
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
      localStorage.removeItem('mockUser');
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