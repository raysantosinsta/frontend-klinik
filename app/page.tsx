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
      setError("Configure as variáveis do Supabase no arquivo .env.local antes de entrar.");
      setIsSubmitting(false);
      return;
    }

    if (mode === "register") {
      // 1. Cadastrar no Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError || !authData.user) {
        setError(signUpError?.message || "Erro ao criar conta. Verifique os dados.");
        setIsSubmitting(false);
        return;
      }

      // 2. Criar a clínica e vincular ao usuário no Backend
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
          throw new Error("Erro ao criar perfil e clínica.");
        }
      } catch (err) {
        console.error(err);
        setError("Conta criada, mas houve erro ao configurar a clínica.");
        setIsSubmitting(false);
        return;
      }
    } else {
      // Login normal
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("E-mail ou senha inválidos. Confira os dados e tente novamente.");
        setIsSubmitting(false);
        return;
      }
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="login-shell">
      <section className="login-intro" aria-label="Sobre a Klinik">
        <div className="brand-mark">K</div>
        <p className="eyebrow">Klinik OS</p>
        <h1>Mais tempo para cuidar. Menos tempo no WhatsApp.</h1>
        <p className="intro-copy">
          O painel da Klinik organiza seus atendimentos, agendamentos e a base de
          conhecimento do seu negócio em um só lugar.
        </p>
        <div className="intro-note">
          <span className="status-dot" aria-hidden="true" />
          <span>Seu espaço de trabalho, sempre por perto.</span>
        </div>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-heading">
          <div className="auth-tabs" style={{ display: 'flex', gap: '20px', marginBottom: '24px', borderBottom: '1px solid var(--line)' }}>
            <button 
              type="button"
              onClick={() => setMode("login")}
              style={{ 
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: mode === 'login' ? '700' : '500', 
                color: mode === 'login' ? 'var(--green)' : 'var(--ink-muted)',
                borderBottom: mode === 'login' ? '3px solid var(--green)' : '3px solid transparent', 
                paddingBottom: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              Entrar
            </button>
            <button 
              type="button"
              onClick={() => setMode("register")}
              style={{ 
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: mode === 'register' ? '700' : '500', 
                color: mode === 'register' ? 'var(--green)' : 'var(--ink-muted)',
                borderBottom: mode === 'register' ? '3px solid var(--green)' : '3px solid transparent', 
                paddingBottom: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              Criar Conta
            </button>
          </div>
          
          <h2 id="login-title">
            {mode === "login" ? "Bem-vindo de volta" : "Comece a usar a Klinik"}
          </h2>
          <p>
            {mode === "login" 
              ? "Entre para acessar o painel do seu negócio." 
              : "Preencha seus dados para criar o perfil da sua clínica."}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label htmlFor="name">Seu Nome</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Dr. João Silva"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
              <label htmlFor="businessName">Nome da Clínica</label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                placeholder="Clínica BemStar"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                required
              />
            </>
          )}

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@seunegocio.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <div className="password-label">
            <label htmlFor="password">Senha</label>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Aguarde..." : (mode === "login" ? "Entrar no painel" : "Criar Minha Conta")}
            <span aria-hidden="true">-&gt;</span>
          </button>
        </form>

        <p className="login-footer">Acesso protegido por autenticação Supabase.</p>
      </section>
    </main>
  );
}
