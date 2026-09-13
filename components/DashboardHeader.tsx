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
    { href: "/dashboard", label: "Início" },
    { href: "/dashboard/appointments", label: "Agendamentos" },
    { href: "/dashboard/whatsapp", label: "WhatsApp" },
    { href: "/dashboard/chat-test", label: "Testar IA" },
    { href: "/dashboard/documents/new", label: "Base de Conhecimento" },
    { href: "/dashboard/services/new", label: "Serviços" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo / Brand */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#174d3b] text-white rounded-md flex items-center justify-center font-bold">
                  K
                </div>
                <span className="font-bold text-gray-900 text-lg hidden md:block">Klinik OS</span>
              </Link>
            </div>
            
            {/* Nav Links */}
            <nav className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-[#174d3b] text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-gray-500">
              {user?.email}
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
        
        {/* Mobile menu (simple version) */}
        <div className="sm:hidden flex overflow-x-auto py-2 space-x-4 border-t border-gray-100">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap px-3 py-1 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-[#dfece3] text-[#174d3b]"
                    : "text-gray-600 hover:bg-gray-100"
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
