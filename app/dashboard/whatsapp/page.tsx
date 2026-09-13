"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';

export default function WhatsAppSettingsPage() {
  const { businessId, isLoading: isAuthLoading } = useAuth();

  const [status, setStatus] = useState<string>('Verificando status...');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{type: "success" | "error" | "", text: string}>({ type: "", text: "" });

  const fetchStatus = async () => {
    if (!businessId) return;
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whatsapp/status/${businessId}`);
      if (res.ok) {
        const data = await res.json();
        setIsConnected(data.connected);
        setStatus(data.connected ? 'Operacional' : (data.status || 'Offline'));
        if (data.connected) setQrCode(null);
      }
    } catch (err) {
      console.error(err);
      setStatus('Falha de comunicação');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchStatus();
    }
    const interval = setInterval(() => {
      if (!isConnected && businessId) fetchStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [isConnected, businessId]);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setStatusMessage({ type: "", text: "" });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whatsapp/connect/${businessId}`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.qrcode) {
          setQrCode(data.qrcode.startsWith('data:') ? data.qrcode : `data:image/png;base64,${data.qrcode}`);
          setStatus('Aguardando sincronização');
        }
      } else {
        setStatusMessage({ type: "error", text: "O servidor de IA rejeitou a conexão. Tente novamente." });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: "error", text: "Falha na rede ao tentar contactar a Evolution API." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    // We will use a custom state for confirmation in a real app, but for now we keep window.confirm to avoid over-engineering the state machine, just with a better copy.
    if (!window.confirm('Isto irá interromper o atendimento automático da IA. Deseja realmente desconectar o dispositivo?')) return;

    try {
      setIsLoading(true);
      setStatusMessage({ type: "", text: "" });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whatsapp/disconnect/${businessId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setIsConnected(false);
        setQrCode(null);
        setStatus('Offline');
        setStatusMessage({ type: "success", text: "Dispositivo desconectado com sucesso." });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: "error", text: "Falha ao interromper a conexão no servidor." });
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 5000);
    }
  };

  return (
    <div className="flex flex-col max-w-4xl gap-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-klinik-text mb-2">
          Integração de IA
        </h1>
        <p className="text-klinik-muted text-lg max-w-2xl leading-relaxed">
          Vincule um dispositivo WhatsApp para autorizar o modelo de linguagem a interceptar e processar mensagens dos seus pacientes.
        </p>
      </header>

      <div className="bg-klinik-surface border border-klinik-line rounded-lg overflow-hidden">
        <div className="p-6 md:p-8 border-b border-klinik-line flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-medium text-klinik-text mb-1">Status do Agente</h3>
            <p className="text-sm text-klinik-muted">Monitoramento em tempo real do túnel de comunicação.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium border ${
              isConnected ? 'bg-klinik-whatsapp/10 text-klinik-whatsapp border-klinik-whatsapp/20' : 'bg-red-50 text-red-700 border-red-100'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-klinik-whatsapp animate-pulse' : 'bg-red-500'}`}></span>
              {status}
            </div>

            {!isConnected && !qrCode && (
              <button
                onClick={handleConnect}
                disabled={isLoading || !businessId || isAuthLoading}
                className="bg-klinik-text hover:bg-black text-white px-5 py-2 rounded-sm text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading || isAuthLoading ? 'Iniciando túnel...' : 'Vincular dispositivo'}
              </button>
            )}

            {isConnected && (
              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                className="bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 px-5 py-2 rounded-sm text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Interrompendo...' : 'Desconectar dispositivo'}
              </button>
            )}
          </div>
        </div>

        {statusMessage.text && (
          <div className={`p-4 border-b text-sm ${statusMessage.type === 'success' ? 'bg-klinik-whatsapp/5 text-klinik-whatsapp border-klinik-whatsapp/20' : 'bg-red-50 text-red-700 border-red-100'}`}>
            {statusMessage.text}
          </div>
        )}

        {qrCode && !isConnected && (
          <div className="p-6 md:p-10 flex flex-col items-center justify-center bg-klinik-bg/50">
            <h3 className="text-xl font-medium text-klinik-text mb-6">Autenticação exigida</h3>
            
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="bg-white p-3 rounded-xl border border-klinik-line shadow-sm">
                <div className="relative w-64 h-64">
                  <Image
                    src={qrCode}
                    alt="QR Code de autenticação"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
              
              <div className="max-w-sm">
                <ol className="text-sm text-klinik-text space-y-4">
                  <li className="flex gap-3">
                    <span className="font-semibold text-klinik-muted">01</span>
                    <span>Abra o aplicativo WhatsApp no dispositivo que fará o atendimento.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-klinik-muted">02</span>
                    <span>Acesse as configurações e toque em <strong>Aparelhos Conectados</strong>.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-klinik-muted">03</span>
                    <span>Selecione <strong>Conectar um aparelho</strong> e aponte a câmera.</span>
                  </li>
                </ol>
                <p className="text-xs text-klinik-muted mt-8 border-t border-klinik-line pt-4">
                  O túnel será estabelecido automaticamente após a leitura do código. Este QR Code expira em alguns segundos.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
