"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!isSupabaseConfigured) {
      setError("As credenciais do banco de dados não estão configuradas no ambiente.");
      setIsSubmitting(false);
      return;
    }

    if (mode === "register") {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError || !authData.user) {
        setError(signUpError?.message || "Falha ao registrar credenciais. Verifique o formato do e-mail e senha.");
        setIsSubmitting(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: authData.user.id,
            email,
            name,
            businessName,
          }),
        });

        if (!res.ok) {
          throw new Error("Falha de sincronização com o painel central.");
        }
      } catch (err) {
        console.error(err);
        setError("Autenticação criada, mas houve uma falha de rede ao provisionar a clínica.");
        setIsSubmitting(false);
        return;
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Credenciais inválidas. Verifique seu endereço de e-mail e senha.");
        setIsSubmitting(false);
        return;
      }
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-klinik-bg text-klinik-text flex flex-col lg:flex-row items-center justify-center p-6 md:p-12 relative overflow-hidden">
        
        {/* Main Content Container */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative z-10">
          
          {/* Left: Branding & Hero */}
          <section className="flex flex-col justify-center">
             <div className="w-12 h-12 bg-klinik-primary text-klinik-surface flex items-center justify-center text-xl font-bold rounded-xl rounded-tr-sm mb-16 shadow-[0_4px_14px_rgba(13,148,136,0.3)]">
               K
             </div>
             
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-6">
                Mais tempo para cuidar. <br/><span className="text-klinik-muted">Menos tempo no WhatsApp.</span>
             </h1>
             
             <p className="text-lg text-klinik-muted max-w-md leading-relaxed mb-16">
                Organize seus atendimentos, gerencie agendamentos e unifique o conhecimento do seu negócio em uma única plataforma estruturada.
             </p>
             
             <div className="flex items-center gap-3 text-sm font-medium text-klinik-primary">
                <span className="w-2 h-2 rounded-full bg-klinik-accent shadow-[0_0_10px_rgba(139,92,246,0.6)]"></span>
                Infraestrutura de IA ativa
             </div>
          </section>

          {/* Right: Action Area */}
          <section className="flex items-center justify-center lg:justify-end">
             <div className="w-full max-w-md bg-klinik-surface p-8 md:p-10 shadow-sm border border-klinik-line">
                <div className="flex gap-6 mb-10 border-b border-klinik-line">
                   <button 
                     type="button" 
                     onClick={() => { setMode("login"); setError(""); }}
                     className={`pb-4 text-sm font-medium transition-colors ${mode === "login" ? "text-klinik-primary border-b-2 border-klinik-primary" : "text-klinik-muted hover:text-klinik-text"}`}
                   >
                     Acessar painel
                   </button>
                   <button 
                     type="button" 
                     onClick={() => { setMode("register"); setError(""); }}
                     className={`pb-4 text-sm font-medium transition-colors ${mode === "register" ? "text-klinik-primary border-b-2 border-klinik-primary" : "text-klinik-muted hover:text-klinik-text"}`}
                   >
                     Criar espaço de trabalho
                   </button>
                </div>

                <h2 className="text-2xl font-semibold mb-2 tracking-tight">
                   {mode === "login" ? "Autenticação" : "Novo espaço de trabalho"}
                </h2>
                <p className="text-klinik-muted mb-8 text-sm leading-relaxed">
                   {mode === "login" ? "Insira suas credenciais para gerenciar a clínica." : "Forneça os detalhes iniciais para estruturar seu negócio."}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                   {mode === "register" && (
                     <>
                        <div className="flex flex-col gap-2">
                           <label htmlFor="name" className="text-sm font-medium">Nome do responsável</label>
                           <input 
                             id="name" name="name" type="text" 
                             className="h-12 px-4 bg-klinik-bg/30 border border-klinik-line focus:border-klinik-primary focus:ring-1 focus:ring-klinik-primary outline-none transition-all rounded-sm text-base" 
                             value={name} onChange={(e) => setName(e.target.value)} required 
                           />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label htmlFor="businessName" className="text-sm font-medium">Nome da clínica</label>
                           <input 
                             id="businessName" name="businessName" type="text" 
                             className="h-12 px-4 bg-klinik-bg/30 border border-klinik-line focus:border-klinik-primary focus:ring-1 focus:ring-klinik-primary outline-none transition-all rounded-sm text-base" 
                             value={businessName} onChange={(e) => setBusinessName(e.target.value)} required 
                           />
                        </div>
                     </>
                   )}

                   <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-medium">Endereço de e-mail</label>
                      <input 
                        id="email" name="email" type="email" autoComplete="email"
                        className="h-12 px-4 bg-klinik-bg/30 border border-klinik-line focus:border-klinik-primary focus:ring-1 focus:ring-klinik-primary outline-none transition-all rounded-sm text-base" 
                        value={email} onChange={(e) => setEmail(e.target.value)} required 
                      />
                   </div>

                   <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-baseline">
                         <label htmlFor="password" className="text-sm font-medium">Senha</label>
                         {mode === "login" && <span className="text-klinik-muted text-xs cursor-pointer hover:text-klinik-text transition-colors">Recuperar acesso</span>}
                      </div>
                      <input 
                        id="password" name="password" type="password" autoComplete="current-password"
                        className="h-12 px-4 bg-klinik-bg/30 border border-klinik-line focus:border-klinik-primary focus:ring-1 focus:ring-klinik-primary outline-none transition-all rounded-sm text-base" 
                        value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required 
                      />
                   </div>

                   {error && (
                     <div className="p-3 mt-2 border-l-2 border-red-500 bg-red-50 text-red-700 text-sm">
                       {error}
                     </div>
                   )}

                   <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="mt-2 h-12 bg-klinik-primary hover:bg-klinik-primary-hover text-klinik-surface font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed rounded-sm shadow-[0_2px_4px_rgba(13,148,136,0.2)] hover:shadow-[0_4px_8px_rgba(13,148,136,0.3)] active:translate-y-0.5"
                   >
                     {isSubmitting ? "Autenticando..." : (mode === "login" ? "Acessar painel" : "Criar espaço de trabalho")}
                   </button>
                </form>
             </div>
          </section>
        </div>
    </main>
  );
}
