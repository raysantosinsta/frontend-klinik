"use client";

import { useState } from 'react';

export default function ChatTestPage() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // ID do negócio que usamos para subir o PDF do Complexo BemStar
  const businessId = "f47ac10b-58cc-4372-a567-0e02b2c3d479"; 

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, message: userMessage })
      });
      
      const data = await res.json();
      setHistory(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      console.error(err);
      setHistory(prev => [...prev, { role: 'assistant', content: 'Erro ao se conectar com o servidor.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 h-[calc(100vh-64px)]">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl flex flex-col h-full border border-gray-100 overflow-hidden">
        
        {/* Header do WhatsApp fake */}
        <div className="bg-[#075E54] text-white p-4 flex items-center shadow-md z-10">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#075E54] font-bold text-xl mr-3">
            B
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-tight">Clínica BemStar (IA)</h1>
            <p className="text-xs text-green-200">Online</p>
          </div>
        </div>

        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#E5DDD5] flex flex-col space-y-4">
          
          {history.length === 0 && (
            <div className="bg-[#DCF8C6] text-gray-800 text-sm p-3 rounded-lg self-center mt-4 text-center max-w-md shadow-sm">
              Envie uma mensagem para testar a base de conhecimento do PDF (RAG).
            </div>
          )}

          {history.map((msg, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-xl max-w-[80%] shadow-sm relative ${
                msg.role === 'user' 
                  ? 'bg-[#DCF8C6] ml-auto rounded-tr-none text-gray-800' 
                  : 'bg-white mr-auto rounded-tl-none text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="text-[10px] text-gray-400 absolute bottom-1 right-2">
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          ))}
          {loading && (
            <div className="bg-white mr-auto rounded-xl rounded-tl-none p-3 shadow-sm flex space-x-1 items-center h-10">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-[#F0F0F0] p-3 flex items-center space-x-2">
          <input 
            type="text"
            className="flex-1 bg-white border border-gray-300 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:border-transparent text-gray-700" 
            value={message} 
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua dúvida clínica..." 
          />
          <button 
            onClick={sendMessage} 
            className="bg-[#128C7E] hover:bg-[#075E54] text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
