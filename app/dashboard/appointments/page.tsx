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

    fetch(`http://localhost:3001/appointments/${businessId}`)
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
      const res = await fetch(`http://localhost:3001/appointments/${id}/status`, {
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
    return <main className="dashboard-loading">Carregando agendamentos...</main>;
  }

  return (
    <main className="dashboard-shell">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Agendamentos</h2>
      </div>

      {appointments.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <p style={{ color: 'var(--text-secondary)' }}>Nenhum agendamento encontrado.</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>Quando a IA concluir um agendamento pelo WhatsApp, ele aparecerá aqui.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {appointments.map((app) => (
            <div key={app.id} style={{
              padding: '20px',
              background: 'var(--surface)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{app.clientName} <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'normal' }}>({app.clientPhone})</span></h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {app.service.name} • R$ {app.service.price} • {new Date(app.date).toLocaleString()}
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: app.status === 'PENDING' ? '#FFF3CD' : app.status === 'CONFIRMED' ? '#D1E7DD' : '#F8D7DA',
                    color: app.status === 'PENDING' ? '#856404' : app.status === 'CONFIRMED' ? '#0F5132' : '#842029',
                  }}>
                    {app.status === 'PENDING' ? 'PENDENTE' : app.status === 'CONFIRMED' ? 'CONFIRMADO' : 'CANCELADO'}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {app.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => changeStatus(app.id, 'CONFIRMED')}
                      style={{
                        padding: '8px 16px',
                        background: '#198754',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Confirmar
                    </button>
                    <button 
                      onClick={() => changeStatus(app.id, 'CANCELLED')}
                      style={{
                        padding: '8px 16px',
                        background: 'transparent',
                        color: '#DC3545',
                        border: '1px solid #DC3545',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {app.status !== 'PENDING' && (
                  <button 
                    onClick={() => changeStatus(app.id, 'PENDING')}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--border)',
                      color: 'var(--text)',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Reabrir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
