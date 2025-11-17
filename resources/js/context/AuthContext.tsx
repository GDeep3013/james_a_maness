import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  type: "Admin" | "Manager" | "Driver";
  status: number;
}

interface AuthContextType {
  user: User | null;
  permissions: string[];
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
  hasRole: (roles: string[]) => boolean;
  loading: boolean;     
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          Accept: "application/json",
        },
        credentials: "include",
      }).catch(() => {});
    }

    setUser(null);
    setPermissions([]);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_permissions");
    window.location.href = "/login";
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("auth_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/user", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status && result.data) {
          setUser(result.data);
          setPermissions(result.data.permissions || []);
          localStorage.setItem("auth_user", JSON.stringify(result.data));
          localStorage.setItem("auth_permissions", JSON.stringify(result.data.permissions || []));
        }
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    const storedPermissions = localStorage.getItem("auth_permissions");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setPermissions(storedPermissions ? JSON.parse(storedPermissions) : []);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.status && result.data) {
      setToken(result.data.token);
      setUser(result.data.user);
      setPermissions(result.data.permissions || []);

      localStorage.setItem("auth_token", result.data.token);
      localStorage.setItem("auth_user", JSON.stringify(result.data.user));
      localStorage.setItem("auth_permissions", JSON.stringify(result.data.permissions || []));
    } else {
      throw new Error(result.message || "Login failed");
    }
  };


  const checkPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.type);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        checkPermission,
        hasRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
