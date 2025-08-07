'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: number;
  email?: string;
  username: string;
  role: string;
}

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  justLoggedIn: boolean;
  setJustLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  login: () => {},
  logout: () => {},
  justLoggedIn: false,
  setJustLoggedIn: () => {},
  currentUser: null
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [justLoggedIn, setJustLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken && storedToken !== 'undefined') {
      try {
        const decoded: DecodedToken = jwtDecode(storedToken);

        setToken(storedToken);
        setIsLoggedIn(true);
        setCurrentUser({
          id: decoded.userId,
          username: decoded.username,
          role: decoded.role
        });
      } catch (error) {
        console.error('Token invalid sau expirat:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);

      localStorage.setItem('token', token);
      setToken(token);
      setIsLoggedIn(true);
      setJustLoggedIn(true);

      setCurrentUser({
        id: decoded.userId,
        username: decoded.username,
        role: decoded.role
      });
    } catch (error) {
      console.error('Token invalid la login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginToastShown');
    setToken(null);
    setIsLoggedIn(false);
    setJustLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn,
        login,
        logout,
        justLoggedIn,
        setJustLoggedIn,
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);