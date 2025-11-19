"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface Session {
  sessionId: string;
  signInTime: string;
  userId: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: Session | null;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("session");
    if (!stored) {
      router.push("/sign-in");
      return;
    }

    try {
      const session: Session = JSON.parse(stored);

      // Check required fields
      if (!session.email || !session.userId || !session.signInTime) {
        localStorage.removeItem("session");
        router.push("/sign-in");
        return;
      }

      // Check if session is older than 2 days
      const signInDate = new Date(session.signInTime);
      const now = new Date();
      const diffInMs = now.getTime() - signInDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays > 2) {
        localStorage.removeItem("session");
        router.push("/sign-in");
        return;
      }

      setUser(session);
    } catch (err) {
      console.error("Failed to parse session:", err);
      localStorage.removeItem("session");
      router.push("/sign-in");
    }
  }, [router]);

  const signOut = () => {
    localStorage.removeItem("session");
    setUser(null);
    router.push("/sign-in");
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the auth context
export const useAuth = () => useContext(AuthContext);
