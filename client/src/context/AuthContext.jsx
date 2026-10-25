import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('househunt_token'));
  const [loading, setLoading] = useState(true);

  // Load user profile on startup if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.error('Session restore failed:', err);
        localStorage.removeItem('househunt_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { 
      identifier: identifier?.trim(),
      email: identifier?.trim(),
      password 
    });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('househunt_token', receivedToken);
    localStorage.setItem('househunt_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('househunt_token', receivedToken);
    localStorage.setItem('househunt_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const quickLogin = async (role) => {
    const credentials = {
      admin: { email: 'admin@househunt.com', password: 'Admin@123' },
      owner: { email: 'owner@househunt.com', password: 'Owner@123' },
      renter: { email: 'renter@househunt.com', password: 'Renter@123' }
    };

    const cred = credentials[role];
    if (cred) {
      return await login(cred.email, cred.password);
    }
  };

  const logout = () => {
    localStorage.removeItem('househunt_token');
    localStorage.removeItem('househunt_user');
    sessionStorage.clear();
    setToken(null);
    setUser(null);
  };

  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        quickLogin,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isOwner: user?.role === 'owner' || user?.role === 'admin',
        isRenter: user?.role === 'renter'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
