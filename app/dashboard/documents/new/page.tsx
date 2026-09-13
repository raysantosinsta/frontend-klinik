"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

type DocumentItem = {
  id: string;
  filename: string;
  storageUrl: string;
  createdAt: string;
};

export default function NewDocumentPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: "success" | "error" | "", text: string}>({ type: "", text: "" });
  
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  const { businessId, isLoading: isAuthLoading } = useAuth();

  const fetchDocuments = useCallback(async () => {
    if (!businessId) return;
    try {
      setIsLoadingDocs(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${businessId}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Erro ao carregar documentos:", err);
    } finally {
      setIsLoadingDocs(false);
    }
  }, [businessId]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente apagar este documento da base de conhecimento?")) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setStatusMessage({ type: "success", text: "Documento excluído com sucesso." });
        await fetchDocuments();
        setTimeout(() => setStatusMessage({ type: "", text: "" }), 5000);
      } else {
        throw new Error('Falha ao excluir o documento.');
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Erro ao excluir." });
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

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
      setFile(null); // Reset file
      await fetchDocuments(); // Refresh the list
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 5000);
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
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl items-start">
      
      {/* Coluna Esquerda: Upload */}
      <div className="flex-1 flex flex-col gap-8 w-full">
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

      {/* Coluna Direita: Listagem */}
      <div className="lg:w-1/3 w-full flex flex-col gap-6">
        <h2 className="text-xl font-semibold tracking-tight text-klinik-text">Arquivos indexados</h2>
        
        <div className="bg-klinik-surface border border-klinik-line rounded-lg overflow-hidden flex flex-col">
          {isLoadingDocs ? (
             <div className="p-8 text-center text-sm text-klinik-muted">Carregando índice...</div>
          ) : documents.length === 0 ? (
             <div className="p-8 text-center text-sm text-klinik-muted">Nenhum documento vetorizado ainda.</div>
          ) : (
            <ul className="divide-y divide-klinik-line max-h-[500px] overflow-y-auto scrollbar-hide">
              {documents.map((doc) => (
                <li key={doc.id} className="p-4 hover:bg-klinik-bg/50 transition-colors flex items-start gap-4">
                  <div className="w-8 h-8 bg-klinik-primary/10 text-klinik-primary rounded flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-klinik-text truncate mb-1" title={doc.filename}>{doc.filename}</p>
                    <div className="flex items-center gap-2 text-xs text-klinik-muted">
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <a href={doc.storageUrl} target="_blank" rel="noopener noreferrer" className="text-klinik-primary hover:underline font-medium">Visualizar PDF</a>
                      <span>•</span>
                      <button onClick={() => handleDelete(doc.id)} className="text-red-500 hover:text-red-700 hover:underline">Apagar</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
    </div>
  );
}
