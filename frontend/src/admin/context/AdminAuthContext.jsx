import { createContext, useCallback, useContext, useState } from "react";
import API_BASE_URL from "../../data/apis/config";

const STORAGE_KEY = "pesa_admin_key";

const AdminAuthContext = createContext(null);

/**
 * Holds the admin Bearer key for the session and exposes login/logout.
 * The key itself lives in sessionStorage (cleared when the tab closes) —
 * never in a cookie or anywhere the public site's JS could read it.
 */
export function AdminAuthProvider({ children }) {
  const [adminKey, setAdminKey] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) || "",
  );
  const [verifying, setVerifying] = useState(false);

  const login = useCallback(async (key) => {
    setVerifying(true);
    try {
      // /contacts is a lightweight admin-only GET — good for verifying the key
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Invalid admin key."
            : "Unable to verify key right now.",
        );
      }
      sessionStorage.setItem(STORAGE_KEY, key);
      setAdminKey(key);
      return true;
    } finally {
      setVerifying(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey("");
  }, []);

  const value = {
    adminKey,
    isAuthenticated: Boolean(adminKey),
    verifying,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return ctx;
}
