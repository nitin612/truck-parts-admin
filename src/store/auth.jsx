import { createContext, useContext, useEffect, useState } from "react";
import api, { setToken } from "../api/client.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On load, try to restore a session via the refresh cookie.
  useEffect(() => {
    (async () => {
      const ok = await api.refresh();
      if (ok) {
        try {
          const { user } = await api.get("/auth/me");
          setUser(user);
        } catch { /* ignore */ }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    const data = await api.post("/auth/login", { email, password }, { auth: false });
    if (!data.user?.isAdmin) {
      throw new Error("This console is staff only. Your account is not an admin.");
    }
    setToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try { await api.post("/auth/logout", {}, { auth: false }); } catch { /* ignore */ }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>{children}</AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
