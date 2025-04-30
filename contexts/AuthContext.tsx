"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import {
  LOGIN,
  SIGNUP,
  AuthResponse,
  LoginVars,
  SignupVars,
} from "../lib/graphql/auth";
import {
  setAuthToken,
  removeAuthToken,
  isAuthenticated,
  getUser,
  setUser as setUserInStorage,
} from "../lib/auth";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [loginMutation] = useMutation<{ login: AuthResponse }, LoginVars>(
    LOGIN
  );
  const [signupMutation] = useMutation<{ signup: AuthResponse }, SignupVars>(
    SIGNUP
  );

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuth = () => {
      if (isAuthenticated()) {
        const userData = getUser();
        if (userData) {
          setUser(userData);
        }
        router.replace("/dashboard");
      } else {
        router.replace("/auth/login");
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data } = await loginMutation({
        variables: { loginInput: { email, password } },
      });

      if (data?.login) {
        setAuthToken(data.login.access_token);
        setUserInStorage(data.login.user);
        setUser(data.login.user);
        toast.success("Successfully logged in");
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data } = await signupMutation({
        variables: { signupInput: { email, password } },
      });

      if (data?.signup) {
        setAuthToken(data.signup.access_token);
        setUserInStorage(data.signup.user);
        setUser(data.signup.user);
        toast.success("Account created successfully");
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    toast.info("You have been logged out");
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
