"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

type Appointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  date: string;
  status: string;
  service: {
    name: string;
    price: number;
    durationInMinutes: number;
  };
};

export default function AppointmentsPage() {
  const { businessId } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${businessId}`)
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar agendamentos:", err);
        setIsLoading(false);
      });
  }, [businessId]);

  const changeStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
      }
    } catch (e) {
      console.error("Erro ao atualizar status:", e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-klinik-muted flex flex-col items-center gap-4">
          <div className="w-6 h-6 border-2 border-klinik-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Recuperando registros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-6xl gap-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-klinik-line pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-klinik-text mb-2">
            Agendamentos
          </h1>
          <p className="text-klinik-muted text-lg">
            Registros processados e triados pelo agente de IA.
          </p>
        </div>
        <div className="text-sm text-klinik-muted">
          Total de registros: <span className="font-medium text-klinik-text">{appointments.length}</span>
        </div>
      </header>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-klinik-line rounded-lg bg-klinik-surface/50">
          <div className="w-12 h-12 bg-klinik-bg rounded-full flex items-center justify-center mb-4 text-klinik-muted">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <p className="text-klinik-text font-medium mb-1">Base de registros vazia</p>
          <p className="text-sm text-klinik-muted max-w-md text-center">
            Quando a IA interceptar uma intenção de agendamento no WhatsApp e concluir a reserva, o registro será indexado aqui.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((app) => (
            <div key={app.id} className="group bg-klinik-surface border border-klinik-line rounded-md p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-klinik-primary/30 transition-colors">
              
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 flex-1">
                <div className="min-w-[120px]">
                  <p className="text-xs font-semibold text-klinik-muted uppercase tracking-wider mb-1">Horário</p>
                  <p className="font-medium text-klinik-text">
                    {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-klinik-muted">
                    {new Date(app.date).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex-1">
                  <p className="text-xs font-semibold text-klinik-muted uppercase tracking-wider mb-1">Paciente</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-klinik-text text-lg">{app.clientName}</p>
                    <span className="text-xs text-klinik-muted bg-klinik-bg px-2 py-0.5 rounded-sm">{app.clientPhone}</span>
                  </div>
                  <p className="text-sm text-klinik-primary mt-1 font-medium">
                    {app.service.name}
                  </p>
                </div>

                <div className="md:px-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-semibold border ${
                    app.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                    app.status === 'CONFIRMED' ? 'bg-klinik-whatsapp/10 text-klinik-whatsapp border-klinik-whatsapp/20' : 
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {app.status === 'PENDING' ? 'Aguardando validação' : app.status === 'CONFIRMED' ? 'Reserva confirmada' : 'Reserva cancelada'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-klinik-line">
                {app.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => changeStatus(app.id, 'CONFIRMED')}
                      className="px-4 py-2 bg-klinik-primary hover:bg-klinik-primary-hover text-white text-sm font-medium rounded-sm transition-colors"
                    >
                      Aprovar reserva
                    </button>
                    <button 
                      onClick={() => changeStatus(app.id, 'CANCELLED')}
                      className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 text-sm font-medium rounded-sm transition-colors"
                    >
                      Rejeitar
                    </button>
                  </>
                )}
                {app.status !== 'PENDING' && (
                  <button 
                    onClick={() => changeStatus(app.id, 'PENDING')}
                    className="px-4 py-2 bg-klinik-bg hover:bg-gray-200 text-klinik-text text-sm font-medium rounded-sm transition-colors"
                  >
                    Reabrir triagem
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
