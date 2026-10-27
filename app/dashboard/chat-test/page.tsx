"use client";

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  intention?: 'VENDAS' | 'DUVIDAS' | 'RECLAMACAO' | 'HUMAN' | string;
  humanInterventionNeeded?: boolean;
};

export default function ChatTestPage() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const { businessId } = useAuth();

  const samplePrompts = [
    { label: "💼 Vendas", text: "Olá! Gostaria de saber os procedimentos faciais e agendar um horário para amanhã." },
    { label: "❓ Dúvidas", text: "Vocês atendem por convênio médico ou apenas particular?" },
    { label: "🛡️ Reclamação", text: "Meu atendimento atrasou mais de 40 minutos hoje, achei um absurdo e quero providências." },
    { label: "🆘 Transbordo", text: "Preciso falar urgente com uma atendente humana da clínica agora." }
  ];

  const sendMessage = async (overrideMessage?: string) => {
    const textToSend = overrideMessage || message;
    if (!textToSend.trim() || !businessId) return;

    setHistory(prev => [...prev, { role: 'user', content: textToSend }]);
    if (!overrideMessage) setMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/multiagent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, message: textToSend })
      });
      
      const data = await res.json();
      setHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || data.answer || "Nenhuma resposta gerada.",
          intention: data.intention,
          humanInterventionNeeded: data.human_intervention_needed
        }
      ]);
    } catch (err) {
      console.error(err);
      setHistory(prev => [
        ...prev,
        { role: 'assistant', content: 'Erro: Não foi possível conectar ao agente Multiagente.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getAgentBadge = (intention?: string) => {
    switch (intention) {
      case 'VENDAS':
        return {
          icon: '💼',
          title: 'Vendedor Consultivo',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-300'
        };
      case 'DUVIDAS':
        return {
          icon: '❓',
          title: 'Especialista em FAQ & RAG',
          className: 'bg-blue-50 text-blue-700 border-blue-300'
        };
      case 'RECLAMACAO':
        return {
          icon: '🛡️',
          title: 'Ouvidoria & SAC',
          className: 'bg-amber-50 text-amber-800 border-amber-300'
        };
      case 'HUMAN':
        return {
          icon: '🆘',
          title: 'Transbordo Humano',
          className: 'bg-rose-50 text-rose-700 border-rose-300'
        };
      default:
        return {
          icon: '🤖',
          title: intention || 'Agente IA',
          className: 'bg-gray-100 text-gray-700 border-gray-300'
        };
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-klinik-text mb-2">
            Depurador Multiagente
          </h1>
          <p className="text-klinik-muted text-sm">
            Simulador ao vivo do LangGraph. Teste como o roteador direciona entre Vendas, FAQ, SAC e Transbordo.
          </p>
        </div>

        {/* Legenda dos Agentes */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm font-medium">
            💼 Vendas
          </span>
          <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-sm font-medium">
            ❓ FAQ
          </span>
          <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-sm font-medium">
            🛡️ SAC
          </span>
          <span className="text-xs px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-sm font-medium">
            🆘 Humano
          </span>
        </div>
      </header>

      <div className="flex-1 bg-white border border-klinik-line rounded-lg shadow-sm flex flex-col overflow-hidden">
        
        {/* Header do Chat (Tech/Multi-Agent Theme) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse mr-3 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
            <div>
              <h2 className="font-medium text-sm tracking-wide text-gray-100">Klinik OS — LangGraph Multi-Agent Router</h2>
              <p className="text-xs text-emerald-400">GPT-OSS 120B / Groq • Conectado à API Python (8000)</p>
            </div>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Limpar conversa
            </button>
          )}
        </div>

        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 bg-klinik-bg/30 flex flex-col space-y-6">
          
          {history.length === 0 && (
            <div className="text-xs text-klinik-muted self-center mt-6 text-center max-w-lg border border-klinik-line bg-white p-6 rounded-md shadow-sm">
              <p className="font-semibold text-klinik-text text-sm mb-2">Simulador de Roteamento Multiagente</p>
              <p className="mb-4">Clique em um dos cenários prontos abaixo para testar como o roteador classifica e direciona para a persona correta:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(p.text)}
                    className="p-2.5 border border-klinik-line hover:border-klinik-primary bg-slate-50 hover:bg-emerald-50 text-slate-800 text-xs rounded transition-colors flex flex-col gap-1"
                  >
                    <span className="font-semibold text-klinik-primary">{p.label}</span>
                    <span className="text-klinik-muted truncate w-full">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {history.map((msg, i) => (
            <div 
              key={i} 
              className={`flex flex-col max-w-[85%] ${
                msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[10px] font-semibold text-klinik-muted uppercase tracking-wider">
                  {msg.role === 'user' ? 'Prompt (Usuário)' : 'Agente Responsável'}
                </span>

                {msg.role === 'assistant' && msg.intention && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getAgentBadge(msg.intention).className}`}>
                    {getAgentBadge(msg.intention).icon} {msg.intention} — {getAgentBadge(msg.intention).title}
                  </span>
                )}

                {msg.humanInterventionNeeded && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                    ⚠️ Transbordo Solicitado
                  </span>
                )}
              </div>

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
                Classificando intenção e roteando...
              </span>
              <div className="bg-white border border-klinik-line rounded-sm p-4 shadow-sm flex space-x-1.5 items-center h-12">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Sugestões rápidas acima do input */}
        {history.length > 0 && (
          <div className="px-4 py-2 bg-slate-50 border-t border-klinik-line/60 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-klinik-muted whitespace-nowrap font-medium">Testar:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => sendMessage(p.text)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-klinik-line hover:border-emerald-300 rounded text-slate-700 whitespace-nowrap transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="bg-white p-4 border-t border-klinik-line">
          <div className="flex items-center gap-3">
            <input 
              type="text"
              className="flex-1 bg-klinik-bg border border-klinik-line rounded-sm py-3 px-4 focus:outline-none focus:border-klinik-primary focus:ring-1 focus:ring-klinik-primary text-sm text-klinik-text transition-all" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Digite uma mensagem para testar o roteamento (ex: 'Quero agendar uma limpeza de pele')..."
              disabled={loading}
            />
            <button 
              onClick={() => sendMessage()}
              disabled={loading || !message.trim()}
              className="bg-klinik-primary hover:bg-klinik-primary-hover text-white font-medium px-6 py-3 rounded-sm transition-colors disabled:opacity-50 text-sm whitespace-nowrap shadow-sm"
            >
              {loading ? 'Roteando...' : 'Enviar'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
