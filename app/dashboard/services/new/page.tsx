"use client";

import { useState, useEffect } from 'react';
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

  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const fetchServices = async () => {
    if (!businessId) return;
    setLoadingServices(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/business/${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchServices();
    }
  }, [businessId]);

  const handleEdit = (service: any) => {
    setEditingServiceId(service.id);
    setFormData({
      name: service.name,
      description: service.description || '',
      durationInMinutes: service.durationInMinutes,
      price: service.price,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setFormData({
      name: '',
      description: '',
      durationInMinutes: 30,
      price: 0,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchServices();
        setStatusMessage({ type: "success", text: "Serviço excluído com sucesso." });
        if (editingServiceId === id) {
          handleCancelEdit();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;
    
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const method = editingServiceId ? 'PATCH' : 'POST';
      const url = editingServiceId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/services/${editingServiceId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/services`;

      const response = await fetch(url, {
        method,
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

      setStatusMessage({ type: "success", text: editingServiceId ? "Serviço atualizado com sucesso." : "Serviço indexado no catálogo." });
      fetchServices();
      handleCancelEdit();
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
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Formulário */}
        <div className="flex flex-col gap-8">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight text-klinik-text mb-2">
              {editingServiceId ? 'Editar Serviço' : 'Adicionar Serviço'}
            </h1>
            <p className="text-klinik-muted text-lg leading-relaxed">
              {editingServiceId 
                ? 'Atualize os dados do procedimento. As alterações serão refletidas em novos agendamentos.' 
                : 'Registre um novo procedimento no catálogo. A IA utilizará estas informações para ofertar horários precisos.'}
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

              <div className="pt-4 flex justify-end gap-3">
                {editingServiceId && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="h-12 px-6 bg-transparent border border-klinik-line text-klinik-text hover:bg-klinik-bg font-medium transition-colors rounded-sm"
                  >
                    Cancelar
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={loading || !businessId || isAuthLoading}
                  className="h-12 px-8 bg-klinik-primary hover:bg-klinik-primary-hover text-klinik-surface font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                >
                  {loading ? 'Processando...' : editingServiceId ? 'Salvar Alterações' : 'Registrar no catálogo'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Lista de Serviços */}
        <div className="flex flex-col gap-8">
          <header>
            <h2 className="text-3xl font-semibold tracking-tight text-klinik-text mb-2">
              Seus Serviços
            </h2>
            <p className="text-klinik-muted text-lg leading-relaxed">
              Catálogo de serviços ativos da sua empresa.
            </p>
          </header>
          
          <div className="flex flex-col gap-4">
            {loadingServices ? (
              <div className="p-8 text-center text-klinik-muted">Carregando serviços...</div>
            ) : services.length === 0 ? (
              <div className="p-8 text-center bg-klinik-surface border border-klinik-line rounded-lg text-klinik-muted">
                Nenhum serviço cadastrado ainda.
              </div>
            ) : (
              services.map((service) => (
                <div key={service.id} className="bg-klinik-surface border border-klinik-line rounded-lg p-5 flex flex-col gap-4 hover:border-klinik-primary/50 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-klinik-text text-lg">{service.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-klinik-muted">
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {service.durationInMinutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                          R$ {service.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(service)}
                        className="p-2 text-klinik-muted hover:text-klinik-primary hover:bg-klinik-bg rounded-sm transition-colors"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-klinik-muted hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                        title="Excluir"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </div>
                  {service.description && (
                    <p className="text-sm text-klinik-muted border-t border-klinik-line pt-3 mt-1">
                      {service.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
