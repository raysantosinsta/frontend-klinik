"use client";

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function ChatTestPage() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const { businessId, isLoading: isAuthLoading } = useAuth();

  const sendMessage = async () => {
    if (!message.trim() || !businessId) return;

    const userMessage = message;
    setHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, message: userMessage })
      });
      
      const data = await res.json();
      setHistory(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      console.error(err);
      setHistory(prev => [...prev, { role: 'assistant', content: 'Exception: Timeout ou falha no LLM.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-klinik-text mb-2">
          Depurador do Agente
        </h1>
        <p className="text-klinik-muted text-sm">
          Simulador de contexto isolado. Teste a recuperação (RAG) da base de conhecimento da IA antes de habilitar no WhatsApp.
        </p>
      </header>

      <div className="flex-1 bg-white border border-klinik-line rounded-lg shadow-sm flex flex-col overflow-hidden">
        
        {/* Header do Chat (Tech/AI Theme) */}
        <div className="bg-klinik-text text-white p-4 flex items-center border-b border-gray-800">
          <div className="w-2 h-2 bg-klinik-accent rounded-full animate-pulse mr-3 shadow-[0_0_8px_rgba(139,92,246,0.8)]"></div>
          <div>
            <h2 className="font-medium text-sm tracking-wide text-gray-200">Klinik OS — LLM RAG Pipeline</h2>
            <p className="text-xs text-klinik-accent">Ambiente de Teste (Isolado)</p>
          </div>
        </div>

        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 bg-klinik-bg/30 flex flex-col space-y-6">
          
          {history.length === 0 && (
            <div className="text-xs text-klinik-muted self-center mt-10 text-center max-w-sm border border-klinik-line bg-white p-4 rounded-sm">
              <p className="font-semibold text-klinik-text mb-1">Contexto inicializado.</p>
              Aguardando prompt do usuário para iniciar vetorização e síntese de resposta.
            </div>
          )}

          {history.map((msg, i) => (
            <div 
              key={i} 
              className={`flex flex-col max-w-[85%] ${
                msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <span className="text-[10px] font-semibold text-klinik-muted uppercase tracking-wider mb-1 px-1">
                {msg.role === 'user' ? 'Prompt (Usuário)' : 'Response (LLM)'}
              </span>
              <div className={`p-4 rounded-sm text-sm leading-relaxed border ${
                msg.role === 'user' 
                  ? 'bg-klinik-primary text-white border-klinik-primary-hover shadow-sm' 
                  : 'bg-white text-klinik-text border-klinik-line shadow-sm'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="self-start flex flex-col max-w-[85%]">
              <span className="text-[10px] font-semibold text-klinik-muted uppercase tracking-wider mb-1 px-1">
                Response (LLM)
              </span>
              <div className="bg-white border border-klinik-line rounded-sm p-4 shadow-sm flex space-x-1 items-center h-12">
                <div className="w-1.5 h-1.5 bg-klinik-primary rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-klinik-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-klinik-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-white p-4 border-t border-klinik-line">
          <div className="flex items-center gap-3">
            <input 
              type="text"
              className="flex-1 bg-klinik-bg border border-klinik-line rounded-sm py-3 px-4 focus:outline-none focus:border-klinik-primary focus:ring-1 focus:ring-klinik-primary text-sm text-klinik-text transition-all" 
              value={message} 
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Sintetize uma query para o modelo..." 
              autoFocus
            />
            <button 
              onClick={sendMessage} 
              disabled={!businessId || isAuthLoading || !message.trim()}
              className="bg-klinik-accent hover:bg-[#7c3aed] text-white px-6 py-3 rounded-sm font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Executar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
