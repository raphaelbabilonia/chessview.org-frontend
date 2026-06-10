import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("chessview_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("chessview_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem("chessview_user", JSON.stringify(profile));
      })
      .catch(() => {
        localStorage.removeItem("chessview_token");
        localStorage.removeItem("chessview_user");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const persistAuth = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem("chessview_token", nextToken);
    localStorage.setItem("chessview_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (payload) => {
    const data = await authApi.login(payload);
    persistAuth(data);
    return data;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    persistAuth(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("chessview_token");
    localStorage.removeItem("chessview_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      register
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
