"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';

export default function WhatsAppSettingsPage() {
  const { businessId, isLoading: isAuthLoading } = useAuth();

  const [status, setStatus] = useState<string>('Carregando...');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStatus = async () => {
    if (!businessId) return;
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:3001/whatsapp/status/${businessId}`);
      if (res.ok) {
        const data = await res.json();
        setIsConnected(data.connected);
        setStatus(data.connected ? 'Conectado' : (data.status || 'Não conectado'));
        if (data.connected) setQrCode(null);
      }
    } catch (err) {
      console.error(err);
      setStatus('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchStatus();
    }
    // Atualiza o status a cada 5 segundos se estiver na tela de QR Code
    const interval = setInterval(() => {
      if (!isConnected && businessId) fetchStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [isConnected, businessId]);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:3001/whatsapp/connect/${businessId}`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.qrcode) {
          // Se for base64
          setQrCode(data.qrcode.startsWith('data:') ? data.qrcode : `data:image/png;base64,${data.qrcode}`);
          setStatus('Aguardando leitura do QR Code');
        }
      } else {
        const errorText = await res.text();
        console.error('Backend error:', errorText);
        alert(`Erro retornado pelo servidor: ${res.status}. Verifique o terminal do backend.`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao tentar conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Tem certeza que deseja desconectar este número de WhatsApp?')) return;

    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:3001/whatsapp/disconnect/${businessId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setIsConnected(false);
        setQrCode(null);
        setStatus('Não conectado');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao tentar desconectar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-8 bg-gray-50 h-full min-h-screen">
      <div className="max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-2">Integração WhatsApp</h1>
        <p className="text-gray-600 mb-8">
          Conecte o seu número de WhatsApp para que a Inteligência Artificial possa responder automaticamente seus clientes.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Status da Conexão</h3>
              <p className="text-sm text-gray-500">Acompanhe se a IA está online.</p>
            </div>
            <div className={`px-4 py-1 rounded-full text-sm font-semibold ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {status}
            </div>
          </div>

          {!isConnected && !qrCode && (
            <button
              onClick={handleConnect}
              disabled={isLoading || !businessId}
              className="bg-[#128C7E] hover:bg-[#075E54] text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading || isAuthLoading ? 'Aguarde...' : 'Conectar Novo Número'}
            </button>
          )}

          {isConnected && (
            <button
              onClick={handleDisconnect}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Desconectando...' : 'Desconectar WhatsApp'}
            </button>
          )}
        </div>

        {qrCode && !isConnected && (
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Escaneie o QR Code</h3>
            <ol className="text-sm text-gray-600 mb-6 list-decimal list-inside space-y-2">
              <li>Abra o WhatsApp no seu celular</li>
              <li>Vá em <strong>Aparelhos Conectados</strong></li>
              <li>Toque em <strong>Conectar um aparelho</strong></li>
              <li>Aponte a câmera para a imagem abaixo</li>
            </ol>
            <div className="relative w-64 h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={qrCode}
                alt="QR Code do WhatsApp"
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              A tela irá atualizar automaticamente assim que o celular for conectado.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
