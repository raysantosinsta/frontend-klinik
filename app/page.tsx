"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("E-mail ou senha inválidos. Confira os dados e tente novamente.");
      setIsSubmitting(false);
      return;
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
          <p className="eyebrow">Área do proprietário</p>
          <h2 id="login-title">Bem-vindo de volta</h2>
          <p>Entre para acessar o painel do seu negócio.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
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
            <span>Use sua senha do Supabase</span>
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
            {isSubmitting ? "Entrando..." : "Entrar no painel"}
            <span aria-hidden="true">-&gt;</span>
          </button>
        </form>

        <p className="login-footer">Acesso protegido por autenticação Supabase.</p>
      </section>
    </main>
  );
}
