import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService, UserProfile } from "./authService";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; message: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(authService.getUser());
  const [isLoading, setIsLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      if (authService.isAuthenticated()) {
        const result = await authService.verifyToken();
        if (result.success && result.user) {
          setUser(result.user);
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    setIsLoading(false);
    return { success: result.success, message: result.message };
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) => {
    setIsLoading(true);
    const result = await authService.register(
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword
    );
    setIsLoading(false);
    return { success: result.success, message: result.message };
  };

  const logout = async () => {
    setIsLoading(true);
    await authService.logout();
    setUser(null);
    setIsLoading(false);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const result = await authService.updateProfile(updates);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, message: result.message };
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    return authService.changePassword(currentPassword, newPassword, confirmPassword);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: authService.isAdmin(),
    isStaff: authService.isStaff(),
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
