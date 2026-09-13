"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function NewDocumentPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: "success" | "error" | "", text: string}>({ type: "", text: "" });

  const { businessId, isLoading: isAuthLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !businessId) return;

    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('businessId', businessId);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Rejeitado pelo processador de documentos.');
      }

      setStatusMessage({ type: "success", text: "Vetorização concluída. Documento indexado na RAG." });
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Falha na transmissão do arquivo." });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col max-w-2xl gap-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-klinik-text mb-2">
          Base de Conhecimento
        </h1>
        <p className="text-klinik-muted text-lg leading-relaxed">
          Alimente a IA com manuais, regras e contextos da clínica. Os dados serão vetorizados e usados no atendimento.
        </p>
      </header>

      <div className="bg-klinik-surface border border-klinik-line rounded-lg p-6 md:p-8">
        
        {statusMessage.text && (
          <div className={`mb-6 p-4 border-l-2 text-sm ${statusMessage.type === 'success' ? 'bg-klinik-whatsapp/5 text-klinik-whatsapp border-klinik-whatsapp/20' : 'bg-red-50 text-red-700 border-red-100'}`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 border-2 border-dashed border-klinik-line p-8 md:p-12 items-center justify-center rounded-lg bg-klinik-bg/30 relative hover:bg-klinik-bg/80 transition-colors">
            
            <div className="w-12 h-12 bg-white border border-klinik-line rounded-full flex items-center justify-center text-klinik-primary mb-2 shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-klinik-text">Upload de PDF estruturado</p>
              <p className="text-xs text-klinik-muted mt-1">Clique para procurar no diretório</p>
            </div>

            <input 
              type="file" 
              accept="application/pdf"
              required
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {file && (
              <div className="mt-4 px-4 py-2 bg-white border border-klinik-primary/30 rounded-sm text-sm font-medium text-klinik-primary flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading || !file || !businessId || isAuthLoading}
              className="h-12 px-8 bg-klinik-text hover:bg-black text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
            >
              {loading ? 'Vetorizando arquivo...' : 'Processar e Indexar Documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
