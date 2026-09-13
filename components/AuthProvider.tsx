"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  businessId: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  businessId: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        
        // Fetch businessId from backend
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/${session.user.id}`);
          if (res.ok) {
            const profile = await res.json();
            setBusinessId(profile.businessId);
          }
        } catch (e) {
          console.error("Failed to fetch user profile", e);
        }
      } else {
        setUser(null);
        setBusinessId(null);
      }
      
      setIsLoading(false);
    }

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      if (session?.user) {
        setUser(session.user);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/${session.user.id}`);
          if (res.ok) {
            const profile = await res.json();
            setBusinessId(profile.businessId);
          }
        } catch (e) {
          console.error("Failed to fetch user profile", e);
        }
      } else {
        setUser(null);
        setBusinessId(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, businessId, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
