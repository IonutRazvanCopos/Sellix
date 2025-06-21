'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  currentUser: any;
  user: any;
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
  login: () => { },
  logout: () => { },
  justLoggedIn: false,
  setJustLoggedIn: () => { },
  currentUser: undefined,
  user: undefined
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [justLoggedIn, setJustLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      const decoded: any = jwtDecode(storedToken);
      setCurrentUser({
        id: decoded.userId,
        username: decoded.username,
      });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
    setIsLoggedIn(true);
    setJustLoggedIn(true);

    const decoded: any = jwtDecode(token);
    setCurrentUser({
      id: decoded.userId,
      username: decoded.username,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginToastShown');
    localStorage.removeItem('username');
    setToken(null);
    setIsLoggedIn(false);
    setJustLoggedIn(false);

  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout, justLoggedIn, setJustLoggedIn, currentUser, user: currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);