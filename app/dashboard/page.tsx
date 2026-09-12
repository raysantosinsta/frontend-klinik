"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;

      if (!data.user) {
        router.replace("/");
        return;
      }

      setUser(data.user);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (isLoading) {
    return <main className="dashboard-loading">Carregando seu painel...</main>;
  }

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Klinik OS</p>
          <h1>Seu painel está pronto.</h1>
        </div>
        <button className="sign-out-button" type="button" onClick={handleSignOut}>
          Sair
        </button>
      </header>
      <section className="dashboard-welcome">
        <span className="welcome-icon" aria-hidden="true">K</span>
        <div>
          <p className="eyebrow">Sessão ativa</p>
          <h2>{user?.email}</h2>
          <p>O próximo passo é conectar seus serviços e começar a organizar seus agendamentos.</p>
        </div>
      </section>
    </main>
  );
}
