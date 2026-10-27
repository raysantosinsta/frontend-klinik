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

  const [googleSheetsId, setGoogleSheetsId] = useState("");
  const [googleSheetsInput, setGoogleSheetsInput] = useState("");
  const [savingSheet, setSavingSheet] = useState(false);
  const [sheetStatusMessage, setSheetStatusMessage] = useState<{type: "success" | "error" | "", text: string}>({ type: "", text: "" });

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
          setGoogleSheetsId(data.googleSheetsId);
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
        setStatusMessage({ type: "success", text: "Preferências de notificação ativadas com sucesso." });
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

  const extractSheetId = (input: string): string => {
    const trimmed = input.trim();
    // Extrai o ID da URL completa: https://docs.google.com/spreadsheets/d/1-zbGz.../edit
    const match = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return trimmed;
  };

  const handleSaveSheetId = async () => {
    if (!businessId) return;
    const cleanId = extractSheetId(googleSheetsInput);
    if (!cleanId) return;

    setSavingSheet(true);
    setSheetStatusMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business/${businessId}/googleSheetsId`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleSheetsId: cleanId }),
      });
      if (res.ok) {
        setGoogleSheetsId(cleanId);
        setGoogleSheetsInput(cleanId);
        setSheetStatusMessage({ type: "success", text: "Planilha Google Sheets sincronizada com sucesso!" });
      } else {
        setSheetStatusMessage({ type: "error", text: "Não foi possível salvar o ID da planilha." });
      }
    } catch (e) {
      console.error(e);
      setSheetStatusMessage({ type: "error", text: "Erro ao comunicar com o servidor." });
    } finally {
      setSavingSheet(false);
      setTimeout(() => setSheetStatusMessage({ type: "", text: "" }), 5000);
    }
  };

  const handleClearSheetId = async () => {
    if (!businessId) return;
    setSavingSheet(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business/${businessId}/googleSheetsId`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleSheetsId: "" }),
      });
      if (res.ok) {
        setGoogleSheetsId("");
        setGoogleSheetsInput("");
        setSheetStatusMessage({ type: "success", text: "Planilha desvinculada." });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSheet(false);
      setTimeout(() => setSheetStatusMessage({ type: "", text: "" }), 5000);
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

      {/* Card Google Sheets / Excel Multi-Tenant */}
      <section id="sheets" className="bg-klinik-surface border border-klinik-line rounded-lg p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="8" y1="13" x2="16" y2="13"></line>
                <line x1="8" y1="17" x2="16" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-klinik-text">
                Planilha Google Sheets & Excel (ERP)
              </h2>
              <p className="text-xs text-klinik-muted">Sincronização bidirecional em tempo real para agendamentos</p>
            </div>
          </div>

          {googleSheetsId && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Planilha Conectada
              </span>
              <a
                href={`https://docs.google.com/spreadsheets/d/${googleSheetsId}/edit`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition-colors inline-flex items-center gap-1 shadow-sm"
              >
                Abrir Planilha ↗
              </a>
            </div>
          )}
        </div>

        <p className="text-klinik-muted mb-6 max-w-2xl text-sm leading-relaxed">
          Cole abaixo o <strong>Link Completo</strong> ou o <strong>ID</strong> da sua planilha Google Sheets. Toda vez que o Agente IA ou você confirmar um agendamento, ele será automaticamente formatado e inserido como uma nova linha na sua planilha.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input 
            type="text" 
            placeholder="Ex: 1-zbGz0DcnlCrrb4kLc9JYILc9Q5z2QkeWXxlU__WqGE ou URL completa"
            value={googleSheetsInput}
            onChange={(e) => setGoogleSheetsInput(e.target.value)}
            className="flex-1 h-12 px-4 bg-klinik-bg/50 border border-klinik-line focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all rounded-sm text-sm placeholder:text-klinik-muted/60 font-mono"
          />
          <button 
            onClick={handleSaveSheetId}
            disabled={savingSheet || !googleSheetsInput.trim()}
            className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm whitespace-nowrap text-sm shadow-sm"
          >
            {savingSheet ? "Salvando..." : "Salvar Planilha"}
          </button>
          {googleSheetsId && (
            <button 
              onClick={handleClearSheetId}
              disabled={savingSheet}
              className="h-12 px-4 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 font-medium transition-colors rounded-sm text-sm"
            >
              Desvincular
            </button>
          )}
        </div>

        {sheetStatusMessage.text && (
          <div className={`mt-4 p-3 border-l-2 text-sm max-w-xl ${sheetStatusMessage.type === 'success' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-red-500 bg-red-50 text-red-700'}`}>
            {sheetStatusMessage.text}
          </div>
        )}

        <div className="mt-4 p-3 bg-klinik-bg/70 rounded border border-klinik-line/60 text-xs text-klinik-muted space-y-1">
          <p className="font-semibold text-klinik-text">💡 Dica de configuração:</p>
          <p>Você pode colar o endereço inteiro da barra de navegação (ex: <code className="bg-white px-1 py-0.5 rounded border border-klinik-line text-emerald-700">https://docs.google.com/spreadsheets/d/1-zbGz.../edit</code>). O sistema extrai o ID automaticamente.</p>
        </div>
      </section>

      {/* Card Alertas WhatsApp */}
      <section className="bg-klinik-surface border border-klinik-line rounded-lg p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4 text-klinik-text">
          Configuração de Alertas Administrativos
        </h2>
        <p className="text-klinik-muted mb-8 max-w-2xl leading-relaxed text-sm">
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

      {/* Card Integração WhatsApp */}
      <section className="bg-klinik-bg border border-klinik-line rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-medium mb-1">Integração do Agente WhatsApp</h2>
          <p className="text-klinik-muted text-sm max-w-md">
            Conecte o número de WhatsApp da sua empresa para que os pacientes conversem diretamente com a IA autônoma.
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

