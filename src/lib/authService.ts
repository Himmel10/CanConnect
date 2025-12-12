// Authentication Service - Handles all API calls to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: "citizen" | "staff" | "admin";
    created_at: string;
  };
}

interface RegisterResponse {
  success: boolean;
  message: string;
  user_id?: string;
}

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "citizen" | "staff" | "admin";
  created_at: string;
  address?: string;
  barangay?: string;
}

interface VerifyTokenResponse {
  success: boolean;
  user?: UserProfile;
  message?: string;
}

class AuthService {
  private token: string | null = null;
  private user: UserProfile | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("auth_user");
    if (token) this.token = token;
    if (user) {
      try {
        this.user = JSON.parse(user);
      } catch (e) {
        localStorage.removeItem("auth_user");
      }
    }
  }

  private saveToStorage() {
    if (this.token) {
      localStorage.setItem("auth_token", this.token);
    } else {
      localStorage.removeItem("auth_token");
    }

    if (this.user) {
      localStorage.setItem("auth_user", JSON.stringify(this.user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth && this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ): Promise<RegisterResponse> {
    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
      };
    }

    // Mock registration - simulate API call
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock user creation
      const mockUser = {
        id: Date.now().toString(),
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        role: "citizen" as const,
        created_at: new Date().toISOString(),
      };

      return {
        success: true,
        message: "Account created successfully! Please login.",
        user_id: mockUser.id,
      };
    } catch (error) {
      return {
        success: false,
        message: `Registration error: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    // Mock login - simulate API call
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Simple validation
      if (!email || !password) {
        return {
          success: false,
          message: "Email and password required",
        };
      }

      // Mock admin account
      if (email === "admin@canconnect.gov.ph" && password === "admin123") {
        const mockToken = btoa(`${email}:${password}:${Date.now()}`);
        const mockUser = {
          id: "admin_001",
          email,
          first_name: "Admin",
          last_name: "User",
          phone: "1234567890",
          role: "admin" as const,
          created_at: new Date().toISOString(),
        };

        this.token = mockToken;
        this.user = mockUser;
        this.saveToStorage();

        return {
          success: true,
          message: "Login successful!",
          token: mockToken,
          user: mockUser,
        };
      }

      // Mock staff account
      if (email === "staff@canconnect.gov.ph" && password === "staff123") {
        const mockToken = btoa(`${email}:${password}:${Date.now()}`);
        const mockUser = {
          id: "staff_001",
          email,
          first_name: "Staff",
          last_name: "Member",
          phone: "1234567890",
          role: "staff" as const,
          created_at: new Date().toISOString(),
        };

        this.token = mockToken;
        this.user = mockUser;
        this.saveToStorage();

        return {
          success: true,
          message: "Login successful!",
          token: mockToken,
          user: mockUser,
        };
      }

      // Mock regular citizen account
      const mockToken = btoa(`${email}:${password}:${Date.now()}`);
      const mockUser = {
        id: "user_123",
        email,
        first_name: email.split("@")[0],
        last_name: "User",
        phone: "1234567890",
        role: "citizen" as const,
        created_at: new Date().toISOString(),
      };

      this.token = mockToken;
      this.user = mockUser;
      this.saveToStorage();

      return {
        success: true,
        message: "Login successful!",
        token: mockToken,
        user: mockUser,
      };
    } catch (error) {
      return {
        success: false,
        message: `Login error: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  async verifyToken(): Promise<VerifyTokenResponse> {
    if (!this.token) {
      return {
        success: false,
        message: "No token found",
      };
    }

    // Mock token verification
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock: token is valid if user exists
      if (this.user) {
        return {
          success: true,
          user: this.user,
        };
      }

      return {
        success: false,
        message: "Token verification failed",
      };
    } catch (error) {
      return {
        success: false,
        message: `Verification error: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: this.getHeaders(true),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Clear local data regardless of API response
    this.token = null;
    this.user = null;
    this.saveToStorage();

    return {
      success: true,
      message: "Logout successful",
    };
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<{
    success: boolean;
    message: string;
    user?: UserProfile;
  }> {
    if (!this.user) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${this.user.id}`, {
        method: "PUT",
        headers: this.getHeaders(true),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Update failed",
        };
      }

      this.user = data.user;
      this.saveToStorage();

      return {
        success: true,
        message: "Profile updated successfully",
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: `Update error: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message: string }> {
    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
      };
    }

    if (!this.user) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${this.user.id}/password`,
        {
          method: "POST",
          headers: this.getHeaders(true),
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Password change failed",
        };
      }

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  // Utility methods
  getToken(): string | null {
    return this.token;
  }

  getUser(): UserProfile | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  isAdmin(): boolean {
    return this.user?.role === "admin";
  }

  isStaff(): boolean {
    return this.user?.role === "staff" || this.user?.role === "admin";
  }
}

// Export singleton instance
export const authService = new AuthService();
export type { LoginResponse, RegisterResponse, UserProfile, VerifyTokenResponse };
