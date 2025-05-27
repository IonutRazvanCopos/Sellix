'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';


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

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    localStorage.getItem('username');
    setToken(token);
    setIsLoggedIn(true);
    setJustLoggedIn(true);
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
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout, justLoggedIn, setJustLoggedIn, currentUser: undefined, user: undefined }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);