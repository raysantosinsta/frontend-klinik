import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-klinik-bg text-klinik-text overflow-hidden selection:bg-klinik-primary/20">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-klinik-bg/80 backdrop-blur-md border-b border-klinik-line z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-klinik-primary text-white flex items-center justify-center text-xl font-bold rounded-lg shadow-sm">
              K
            </div>
            <span className="text-xl font-semibold tracking-tight">Klinik OS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-klinik-muted">
            <a href="#features" className="hover:text-klinik-text transition-colors">Recursos</a>
            <a href="#pricing" className="hover:text-klinik-text transition-colors">Preços</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm font-medium text-klinik-text hover:text-klinik-primary transition-colors hidden sm:block">
              Acessar painel
            </Link>
            <Link href="/auth" className="bg-klinik-text hover:bg-black text-white px-5 py-2.5 rounded-sm text-sm font-medium transition-colors shadow-sm">
              Começar agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-klinik-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-klinik-surface border border-klinik-line text-xs font-semibold text-klinik-primary mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-klinik-accent animate-pulse"></span>
            Inteligência Artificial Ativa
          </div>
          
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-8">
            Sua clínica no piloto automático. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-klinik-primary to-klinik-accent">
              Menos telas. Mais cuidado.
            </span>
          </h1>
          
          <p className="text-xl text-klinik-muted max-w-2xl leading-relaxed mb-12">
            Um agente autônomo que agenda pacientes, responde dúvidas complexas via WhatsApp e organiza sua agenda 24 horas por dia, sem intervenção humana.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/auth" className="w-full sm:w-auto px-8 py-4 bg-klinik-primary hover:bg-klinik-primary-hover text-white rounded-sm font-medium text-lg transition-all shadow-[0_4px_14px_rgba(13,148,136,0.25)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.4)] hover:-translate-y-0.5">
              Criar espaço de trabalho
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white border border-klinik-line hover:border-klinik-muted text-klinik-text rounded-sm font-medium text-lg transition-all">
              Conhecer a tecnologia
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white border-y border-klinik-line px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Engenharia projetada para a área da saúde</h2>
            <p className="text-lg text-klinik-muted">Abandone dezenas de abas e CRMs genéricos. O Klinik OS foi arquitetado do zero para centralizar e automatizar o relacionamento com pacientes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-klinik-bg/50 border border-klinik-line rounded-xl hover:bg-klinik-surface transition-colors">
              <div className="w-12 h-12 bg-klinik-whatsapp/10 text-klinik-whatsapp rounded-lg flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h3 className="text-xl font-medium text-klinik-text mb-3">Interceptação WhatsApp</h3>
              <p className="text-klinik-muted leading-relaxed">
                Nosso modelo escuta ativamente o seu número. Ele tria intenções, responde perguntas e agenda pacientes instantaneamente através de LLMs avançados.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-klinik-bg/50 border border-klinik-line rounded-xl hover:bg-klinik-surface transition-colors">
              <div className="w-12 h-12 bg-klinik-primary/10 text-klinik-primary rounded-lg flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              </div>
              <h3 className="text-xl font-medium text-klinik-text mb-3">Agendamento Determinístico</h3>
              <p className="text-klinik-muted leading-relaxed">
                Esqueça conflitos de agenda. O Agente extrai dados estruturados (nome, serviço e data) da conversa e aloca diretamente no seu painel.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-klinik-bg/50 border border-klinik-line rounded-xl hover:bg-klinik-surface transition-colors">
              <div className="w-12 h-12 bg-klinik-accent/10 text-klinik-accent rounded-lg flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <h3 className="text-xl font-medium text-klinik-text mb-3">Base de Conhecimento RAG</h3>
              <p className="text-klinik-muted leading-relaxed">
                Faça upload de manuais e regras da clínica. Transformamos PDFs em matrizes vetoriais para que a IA tenha contexto profundo e privado ao responder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Investimento escalável</h2>
            <p className="text-lg text-klinik-muted">Custos transparentes. Escolha o plano que se alinha ao volume operacional da sua clínica.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            
            {/* Starter */}
            <div className="bg-white p-8 md:p-10 border border-klinik-line rounded-2xl shadow-sm">
              <h3 className="text-xl font-medium text-klinik-text mb-2">Starter</h3>
              <p className="text-sm text-klinik-muted mb-6">Para clínicas individuais iniciando com IA.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold tracking-tight text-klinik-text">R$ 197</span>
                <span className="text-klinik-muted"> / mês</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-klinik-text">
                <li className="flex gap-3"><CheckIcon /> <span>1 negócio (Instância WhatsApp)</span></li>
                <li className="flex gap-3"><CheckIcon /> <span>RAG com volume básico de documentos</span></li>
                <li className="flex gap-3"><CheckIcon /> <span>Extração de agendamento padrão</span></li>
                <li className="flex gap-3"><CheckIcon /> <span>Notificações via Telegram/WhatsApp</span></li>
              </ul>
              <Link href="/auth" className="block w-full py-3 px-4 bg-klinik-bg border border-klinik-line hover:border-klinik-text text-klinik-text text-center font-medium rounded-sm transition-colors">
                Iniciar com Starter
              </Link>
            </div>

            {/* Pro - Anchor */}
            <div className="bg-klinik-text p-8 md:p-10 border border-klinik-text rounded-2xl shadow-2xl relative lg:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-klinik-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Mais Escolhido
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Pro</h3>
              <p className="text-sm text-gray-400 mb-6">Para clínicas de alto fluxo que dependem de agilidade.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold tracking-tight text-white">R$ 397</span>
                <span className="text-gray-400"> / mês</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-gray-300">
                <li className="flex gap-3 text-white"><CheckIcon className="text-klinik-primary" /> <span>Volume estendido de mensagens LLM</span></li>
                <li className="flex gap-3 text-white"><CheckIcon className="text-klinik-primary" /> <span>Upload avançado de documentos na RAG</span></li>
                <li className="flex gap-3 text-white"><CheckIcon className="text-klinik-primary" /> <span>Prioridade máxima de suporte (SLA 4h)</span></li>
                <li className="flex gap-3 text-white"><CheckIcon className="text-klinik-primary" /> <span>Agendamento inteligente ilimitado</span></li>
              </ul>
              <Link href="/auth" className="block w-full py-3 px-4 bg-klinik-primary hover:bg-klinik-primary-hover text-white text-center font-medium rounded-sm transition-colors shadow-lg shadow-klinik-primary/20">
                Assinar o Pro
              </Link>
            </div>

            {/* Advanced */}
            <div className="bg-white p-8 md:p-10 border border-klinik-line rounded-2xl shadow-sm">
              <h3 className="text-xl font-medium text-klinik-text mb-2">Avançado</h3>
              <p className="text-sm text-klinik-muted mb-6">Para redes de clínicas e operações complexas.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold tracking-tight text-klinik-text">R$ 597</span>
                <span className="text-klinik-muted"> / mês</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-klinik-text">
                <li className="flex gap-3"><CheckIcon /> <span>Múltiplos atendentes virtuais</span></li>
                <li className="flex gap-3"><CheckIcon /> <span>Agendas cruzadas de médicos</span></li>
                <li className="flex gap-3"><CheckIcon /> <span>Relatórios preditivos e de conversão</span></li>
                <li className="flex gap-3"><CheckIcon /> <span>SLA de resposta em tempo real</span></li>
              </ul>
              <Link href="/auth" className="block w-full py-3 px-4 bg-klinik-bg border border-klinik-line hover:border-klinik-text text-klinik-text text-center font-medium rounded-sm transition-colors">
                Falar com especialista
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 px-6 bg-klinik-surface border-t border-klinik-line text-center">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">Pronto para elevar o padrão?</h2>
        <p className="text-lg text-klinik-muted mb-10 max-w-2xl mx-auto">
          Junte-se às clínicas que estão economizando centenas de horas humanas repassando o primeiro atendimento para a infraestrutura do Klinik OS.
        </p>
        <Link href="/auth" className="inline-block px-10 py-4 bg-klinik-text hover:bg-black text-white rounded-sm font-medium text-lg transition-all shadow-xl hover:-translate-y-1">
          Criar espaço de trabalho agora
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-klinik-line text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-klinik-primary text-white flex items-center justify-center text-xs font-bold rounded shadow-sm">K</div>
          <span className="text-sm font-medium">Klinik OS © 2024</span>
        </div>
        <div className="flex gap-6 text-sm text-klinik-muted">
          <a href="#" className="hover:text-klinik-text">Termos de Uso</a>
          <a href="#" className="hover:text-klinik-text">Privacidade</a>
          <a href="#" className="hover:text-klinik-text">Status da API</a>
        </div>
      </footer>

    </main>
  );
}

function CheckIcon({ className = "text-klinik-text" }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
