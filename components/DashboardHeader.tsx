"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/dashboard", label: "Visão geral" },
    { href: "/dashboard/appointments", label: "Agendamentos" },
    { href: "/dashboard/whatsapp", label: "Integração IA" },
    { href: "/dashboard/chat-test", label: "Depurador IA" },
    { href: "/dashboard/documents/new", label: "Base de conhecimento" },
    { href: "/dashboard/services/new", label: "Serviços clínicos" },
  ];

  return (
    <header className="bg-klinik-surface border-b border-klinik-line sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-20 items-center">
          
          <div className="flex items-center">
            {/* Logo / Brand */}
            <Link href="/dashboard" className="flex items-center gap-3 mr-10 group">
              <div className="w-9 h-9 bg-klinik-primary text-klinik-surface rounded-xl rounded-tr-sm flex items-center justify-center font-bold text-lg shadow-[0_2px_8px_rgba(13,148,136,0.25)] group-hover:shadow-[0_4px_12px_rgba(13,148,136,0.4)] transition-all">
                K
              </div>
              <span className="font-semibold text-klinik-text text-lg tracking-tight hidden md:block">Klinik</span>
            </Link>
            
            {/* Nav Links */}
            <nav className="hidden lg:flex lg:space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive
                        ? "bg-klinik-primary/10 text-klinik-primary"
                        : "text-klinik-muted hover:bg-klinik-bg hover:text-klinik-text"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-sm font-medium text-klinik-muted">
              {user?.email}
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
            >
              Encerrar sessão
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="lg:hidden flex overflow-x-auto py-3 space-x-2 border-t border-klinik-line scrollbar-hide">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-klinik-primary/10 text-klinik-primary"
                    : "text-klinik-muted hover:bg-klinik-bg"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
