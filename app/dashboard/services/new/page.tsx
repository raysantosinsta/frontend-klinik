"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function NewServicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationInMinutes: 30,
    price: 0,
  });
  const { businessId, isLoading: isAuthLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: "success" | "error" | "", text: string}>({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;
    
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          durationInMinutes: Number(formData.durationInMinutes),
          price: Number(formData.price),
          businessId,
        }),
      });

      if (!response.ok) {
        throw new Error('O servidor rejeitou os parâmetros do serviço.');
      }

      setStatusMessage({ type: "success", text: "Serviço indexado no catálogo." });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Falha ao registrar o serviço." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col max-w-2xl gap-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-klinik-text mb-2">
          Adicionar Serviço
        </h1>
        <p className="text-klinik-muted text-lg leading-relaxed">
          Registre um novo procedimento no catálogo. A IA utilizará estas informações para ofertar horários precisos.
        </p>
      </header>

      <div className="bg-klinik-surface border border-klinik-line rounded-lg p-6 md:p-8">
        
        {statusMessage.text && (
          <div className={`mb-6 p-4 border-l-2 text-sm ${statusMessage.type === 'success' ? 'bg-klinik-whatsapp/5 text-klinik-whatsapp border-klinik-whatsapp/20' : 'bg-red-50 text-red-700 border-red-100'}`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-klinik-text">Nomenclatura do serviço</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="h-12 px-4 bg-klinik-bg/50 border border-klinik-line focus:border-klinik-primary focus:ring-1 focus:ring-klinik-primary outline-none transition-all rounded-sm text-base"
              placeholder="Ex: Avaliação Odontológica Primária"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-klinik-text">Parâmetros operacionais</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[100px] p-4 bg-klinik-bg/50 border border-klinik-line focus:border-klinik-primary focus:ring-1 focus:ring-klinik-primary outline-none transition-all rounded-sm text-base resize-y"
              placeholder="Descreva pré-requisitos, instruções ou detalhes do procedimento..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-klinik-line pt-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-klinik-text">Tempo de execução (minutos)</label>
              <input 
                type="number" 
                name="durationInMinutes"
                required
                min="1"
                value={formData.durationInMinutes}
                onChange={handleChange}
                className="h-12 px-4 bg-klinik-bg/50 border border-klinik-line focus:border-klinik-primary focus:ring-1 focus:ring-klinik-primary outline-none transition-all rounded-sm text-base"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-klinik-text">Valor base (R$)</label>
              <input 
                type="number" 
                name="price"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="h-12 px-4 bg-klinik-bg/50 border border-klinik-line focus:border-klinik-primary focus:ring-1 focus:ring-klinik-primary outline-none transition-all rounded-sm text-base"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading || !businessId || isAuthLoading}
              className="h-12 px-8 bg-klinik-primary hover:bg-klinik-primary-hover text-klinik-surface font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
            >
              {loading ? 'Indexando...' : 'Registrar no catálogo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
