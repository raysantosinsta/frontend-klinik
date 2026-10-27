"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { getUserProfile } from "@/app/actions/auth";

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
        
        // Fetch businessId from backend via server action
        try {
          let profile = await getUserProfile(session.user.id);
          if (!profile && session.user.email) {
            // Auto-provisioning no banco local caso tenha sido recriado
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");
            const regRes = await fetch(`${apiUrl}/users/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || session.user.email.split('@')[0],
                businessName: session.user.user_metadata?.businessName || "Clínica Klinik",
              }),
            });
            if (regRes.ok) {
              const regData = await regRes.json();
              profile = { ...regData.user, business: regData.business };
            }
          }
          if (profile) {
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
          let profile = await getUserProfile(session.user.id);
          if (!profile && session.user.email) {
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");
            const regRes = await fetch(`${apiUrl}/users/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || session.user.email.split('@')[0],
                businessName: session.user.user_metadata?.businessName || "Clínica Klinik",
              }),
            });
            if (regRes.ok) {
              const regData = await regRes.json();
              profile = { ...regData.user, business: regData.business };
            }
          }
          if (profile) {
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
