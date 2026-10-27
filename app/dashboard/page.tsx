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
  const [statusMessage, setStatusMessage] = useState<{type: "success" | "error" | "", text: string}>({ type: "", text: "" });

  const [googleSheetsInput, setGoogleSheetsInput] = useState("");
  const [savingSheets, setSavingSheets] = useState(false);
  const [sheetsMessage, setSheetsMessage] = useState<{type: "success" | "error" | "", text: string}>({ type: "", text: "" });

  const extractSpreadsheetId = (val: string) => {
    const trimmed = val.trim();
    const match = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : trimmed;
  };

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
        if (data.googleSheetsId) {
          setGoogleSheetsInput(data.googleSheetsId);
        }
      })
      .catch(err => console.error("Erro ao carregar dados do negócio:", err));
  }, [businessId]);

  const handleSavePhone = async () => {
    if (!businessId) return;
    
    setSavingPhone(true);
    setStatusMessage({ type: "", text: "" });
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business/${businessId}/ownerPhone`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerPhone }),
      });
      if (res.ok) {
        setStatusMessage({ type: "success", text: "Preferências de notificação ativadas." });
      } else {
        setStatusMessage({ type: "error", text: "Não foi possível registrar o número. Verifique a conexão." });
      }
    } catch (e) {
      console.error(e);
      setStatusMessage({ type: "error", text: "Não foi possível registrar o número. Tente novamente mais tarde." });
    } finally {
      setSavingPhone(false);
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 5000);
    }
  };

  const handleSaveGoogleSheets = async () => {
    if (!businessId) return;
    
    setSavingSheets(true);
    setSheetsMessage({ type: "", text: "" });
    const cleanId = extractSpreadsheetId(googleSheetsInput);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business/${businessId}/googleSheetsId`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleSheetsId: cleanId }),
      });
      if (res.ok) {
        setGoogleSheetsInput(cleanId);
        setSheetsMessage({ type: "success", text: "Planilha do Google vinculada com sucesso! Agendamentos serão sincronizados." });
      } else {
        setSheetsMessage({ type: "error", text: "Falha ao salvar a planilha. Verifique a conexão com o backend." });
      }
    } catch (e) {
      console.error(e);
      setSheetsMessage({ type: "error", text: "Erro ao comunicar com o servidor." });
    } finally {
      setSavingSheets(false);
      setTimeout(() => setSheetsMessage({ type: "", text: "" }), 6000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-klinik-muted flex flex-col items-center gap-4">
          <div className="w-6 h-6 border-2 border-klinik-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 max-w-4xl">
      <header>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-klinik-text mb-2">
          Seu espaço de trabalho.
        </h1>
        <p className="text-klinik-muted text-lg">
          Autenticado como <span className="font-medium text-klinik-text">{user?.email}</span>
        </p>
      </header>

      <section className="bg-klinik-surface border border-klinik-line rounded-lg p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4 text-klinik-text">
          Configuração de Alertas
        </h2>
        <p className="text-klinik-muted mb-8 max-w-2xl leading-relaxed">
          Forneça o número do WhatsApp administrativo (com DDI e DDD) para receber despachos em tempo real sempre que a inteligência artificial finalizar e confirmar um novo agendamento de paciente.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input 
            type="text" 
            placeholder="Ex: 5511999999999"
            value={ownerPhone}
            onChange={(e) => setOwnerPhone(e.target.value)}
            className="w-full sm:w-80 h-12 px-4 bg-klinik-bg/50 border border-klinik-line focus:border-klinik-primary focus:ring-1 focus:ring-klinik-primary outline-none transition-all rounded-sm text-base placeholder:text-klinik-muted/60"
          />
          <button 
            onClick={handleSavePhone}
            disabled={savingPhone || !ownerPhone}
            className="h-12 px-6 bg-klinik-primary hover:bg-klinik-primary-hover text-klinik-surface font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm whitespace-nowrap"
          >
            {savingPhone ? "Registrando..." : "Ativar notificações"}
          </button>
        </div>

        {statusMessage.text && (
          <div className={`mt-4 p-3 border-l-2 text-sm max-w-md ${statusMessage.type === 'success' ? 'border-klinik-whatsapp bg-klinik-whatsapp/10 text-klinik-whatsapp' : 'border-red-500 bg-red-50 text-red-700'}`}>
            {statusMessage.text}
          </div>
        )}
      </section>

      {/* Seção Google Sheets (Multi-Tenant) */}
      <section className="bg-klinik-surface border border-klinik-line rounded-lg p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📊</span>
          <h2 className="text-xl font-semibold text-klinik-text">
            Planilha Google Sheets (Multi-Tenant)
          </h2>
        </div>
        <p className="text-klinik-muted mb-6 max-w-2xl leading-relaxed">
          Conecte a planilha exclusiva da sua empresa para receber automaticamente todos os agendamentos fechados pela IA. Você pode colar o <strong>Link completo</strong> ou apenas o <strong>ID da Planilha</strong>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input 
            type="text" 
            placeholder="Ex: https://docs.google.com/spreadsheets/d/14j1Z.../edit ou 14j1Z..."
            value={googleSheetsInput}
            onChange={(e) => setGoogleSheetsInput(e.target.value)}
            className="w-full sm:w-[420px] h-12 px-4 bg-klinik-bg/50 border border-klinik-line focus:border-klinik-primary focus:ring-1 focus:ring-klinik-primary outline-none transition-all rounded-sm text-sm placeholder:text-klinik-muted/60 font-mono"
          />
          <button 
            onClick={handleSaveGoogleSheets}
            disabled={savingSheets || !googleSheetsInput}
            className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm whitespace-nowrap shadow-sm"
          >
            {savingSheets ? "Salvando..." : "Vincular Planilha"}
          </button>

          {extractSpreadsheetId(googleSheetsInput) && (
            <a
              href={`https://docs.google.com/spreadsheets/d/${extractSpreadsheetId(googleSheetsInput)}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-4 border border-klinik-line hover:border-emerald-500 bg-white hover:bg-emerald-50 text-emerald-800 text-sm font-medium transition-colors rounded-sm flex items-center gap-2 whitespace-nowrap"
            >
              <span>Abrir Planilha</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        {sheetsMessage.text && (
          <div className={`mt-4 p-3 border-l-2 text-sm max-w-lg ${sheetsMessage.type === 'success' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-red-500 bg-red-50 text-red-700'}`}>
            {sheetsMessage.text}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-klinik-line/60 flex items-center gap-2 text-xs text-klinik-muted">
          <span className="font-semibold text-klinik-text">💡 Dica:</span> Lembre-se de compartilhar sua planilha com permissão de Editor com o e-mail da sua conta central do Hub Google Apps Script.
        </div>
      </section>

      <section className="bg-klinik-bg border border-klinik-line rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-medium mb-1">Integração do Agente</h2>
          <p className="text-klinik-muted text-sm max-w-md">
            Seu próximo passo é vincular um dispositivo WhatsApp para permitir que o modelo de linguagem atenda seus pacientes.
          </p>
        </div>
        <button 
          onClick={() => router.push('/dashboard/whatsapp')}
          className="px-6 py-3 bg-klinik-text hover:bg-black text-white text-sm font-medium rounded-sm transition-colors whitespace-nowrap"
        >
          Configurar integração
        </button>
      </section>
    </div>
  );
}
