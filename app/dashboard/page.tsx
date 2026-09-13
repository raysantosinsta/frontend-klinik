"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { businessId } = useAuth();
  
  const [ownerPhone, setOwnerPhone] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);

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

  useEffect(() => {
    if (!businessId) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/business/${businessId}`)
      .then(res => res.json())
      .then(data => {
        if (data.ownerPhone) {
          setOwnerPhone(data.ownerPhone);
        }
      })
      .catch(err => console.error("Erro ao carregar dados do negócio:", err));
  }, [businessId]);

  const handleSavePhone = async () => {
    if (!businessId) return;
    
    setSavingPhone(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business/${businessId}/ownerPhone`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerPhone }),
      });
      if (res.ok) {
        alert("Número salvo com sucesso! Você receberá notificações neste WhatsApp.");
      } else {
        alert("Falha ao salvar o número.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar o número.");
    } finally {
      setSavingPhone(false);
    }
  };

  if (isLoading) {
    return <main className="dashboard-loading">Carregando seu painel...</main>;
  }

  return (
    <main className="dashboard-shell">
      <div className="pt-8">
        <h1>Seu painel está pronto.</h1>
      </div>
      <section className="dashboard-welcome" style={{ marginBottom: '24px' }}>
        <span className="welcome-icon" aria-hidden="true">K</span>
        <div>
          <p className="eyebrow">Sessão ativa</p>
          <h2>{user?.email}</h2>
          <p>O próximo passo é conectar seus serviços e começar a organizar seus agendamentos.</p>
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => router.push('/dashboard/whatsapp')}
              style={{
                background: 'var(--accent)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Conectar WhatsApp
            </button>
          </div>
        </div>
      </section>

      <section style={{
        background: 'var(--surface)',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Configurações de Notificação</h3>
        <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Insira seu número de WhatsApp (com DDI e DDD) para receber notificações em tempo real sempre que a IA finalizar um novo agendamento.
        </p>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Ex: 5511999999999"
            value={ownerPhone}
            onChange={(e) => setOwnerPhone(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              flex: 1,
              maxWidth: '300px'
            }}
          />
          <button 
            onClick={handleSavePhone}
            disabled={savingPhone || !ownerPhone}
            style={{
              background: '#198754',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: (savingPhone || !ownerPhone) ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: (savingPhone || !ownerPhone) ? 0.7 : 1
            }}
          >
            {savingPhone ? 'Salvando...' : 'Salvar Número'}
          </button>
        </div>
      </section>
    </main>
  );
}
