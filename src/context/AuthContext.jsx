import { createContext, useMemo, useState } from 'react';
import * as authApi from '../api/auth.js';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'notesync_token';
const USER_KEY = 'notesync_user';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Erro ao carregar usuário salvo', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  const persistSession = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (newUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  const handleAuthSuccess = (data) => {
    setToken(data.token);
    setUser(data.usuario);
    persistSession(data.token, data.usuario);
    return data;
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authApi.login(credentials);
      return handleAuthSuccess(data);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const data = await authApi.register(payload);
      return handleAuthSuccess(data);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    persistSession(null, null);
  };

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout
  }), [token, user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
