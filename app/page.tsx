"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export default function EditorialLandingPage() {
  const shouldReduceMotion = useReducedMotion();

  // Parallax Setup para as seções
  const refSection1 = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollYProgress1 } = useScroll({
    target: refSection1,
    offset: ["start end", "end start"]
  });
  const yParallax1 = useTransform(scrollYProgress1, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["-15%", "15%"]);

  const refSection2 = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: refSection2,
    offset: ["start end", "end start"]
  });
  const yParallax2 = useTransform(scrollYProgress2, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["-15%", "15%"]);

  // Animações utilitárias
  const fadeUpVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F8] text-[#1A1A1A] selection:bg-klinik-primary/20 font-sans overflow-hidden">
      
      {/* Navbar Minimalista */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="absolute top-0 w-full z-50 p-6 md:p-10 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center text-sm font-bold rounded-sm">
            K
          </div>
          <span className="text-sm font-semibold uppercase tracking-widest text-white md:text-[#1A1A1A] drop-shadow-md md:drop-shadow-none">Klinik OS</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth" className="text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity text-white md:text-[#1A1A1A] drop-shadow-md md:drop-shadow-none">
            Acessar
          </Link>
          <Link href="/auth" className="bg-[#1A1A1A] text-white px-6 py-3 rounded-none text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors">
            Criar Espaço
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section Editorial */}
      <section className="relative w-full h-[90vh] md:h-screen flex items-end p-6 md:p-16 overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: shouldReduceMotion ? 1 : 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
        >
          <Image 
            src="/images/clinic_reception.jpg" 
            alt="Recepção de Clínica Moderna" 
            fill 
            priority
            className="object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/10 z-10"></div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-20 max-w-4xl bg-white/90 backdrop-blur-md p-8 md:p-12 shadow-2xl"
        >
          <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1] mb-6">
            A arte do cuidado <br/> livre de telas.
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-gray-600 font-light max-w-xl mb-8">
            Automação invisível. Agendamento autônomo. Uma clínica que funciona com a precisão da inteligência artificial.
          </motion.p>
          <motion.div variants={fadeUpVariant}>
            <Link href="/auth" className="inline-block border-b border-[#1A1A1A] pb-1 text-sm uppercase tracking-widest font-semibold hover:text-klinik-primary hover:border-klinik-primary transition-colors">
              Explorar a Tecnologia
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Seção 1: O Foco na Relação */}
      <section ref={refSection1} className="py-24 md:py-40 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 overflow-hidden">
        <div className="w-full md:w-1/2 relative h-[60vh] md:h-[80vh] overflow-hidden">
          <motion.div style={{ y: yParallax1 }} className="absolute inset-0 -top-12 -bottom-12">
            <Image 
              src="/images/doctor_patient.jpg" 
              alt="Médica e Paciente" 
              fill 
              className="object-cover"
            />
          </motion.div>
        </div>
        <motion.div 
          className="w-full md:w-1/2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-light tracking-tight mb-8">Presença absoluta.</motion.h2>
          <motion.p variants={fadeUpVariant} className="text-gray-600 text-lg font-light leading-relaxed mb-6">
            Delegamos a triagem, as dúvidas frequentes e a alocação de horários para um Agente Autônomo.
          </motion.p>
          <motion.p variants={fadeUpVariant} className="text-gray-600 text-lg font-light leading-relaxed">
            O resultado é um profissional de saúde totalmente presente e focado em quem realmente importa: o paciente.
          </motion.p>
        </motion.div>
      </section>

      {/* Seção 2: Infraestrutura Invisível */}
      <section ref={refSection2} className="bg-[#1A1A1A] text-white py-24 md:py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="w-full md:w-1/2 relative h-[50vh] md:h-[70vh] overflow-hidden">
             <motion.div style={{ y: yParallax2 }} className="absolute inset-0 -top-12 -bottom-12">
              <Image 
                src="/images/smartphone_desk.jpg" 
                alt="Smartphone e Estetoscópio" 
                fill 
                className="object-cover"
              />
            </motion.div>
          </div>
          <motion.div 
            className="w-full md:w-1/2 md:pr-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-light tracking-tight mb-8">Intervenção Zero.</motion.h2>
            <motion.p variants={fadeUpVariant} className="text-gray-400 text-lg font-light leading-relaxed mb-10">
              O modelo escuta seu WhatsApp, consulta seus documentos privados através de RAG (Retrieval-Augmented Generation) e marca consultas de forma determinística. Tudo sem você tocar no celular.
            </motion.p>
            <motion.div variants={fadeUpVariant} className="grid grid-cols-2 gap-8 border-t border-gray-800 pt-10">
              <div>
                <span className="block text-2xl font-light mb-2">24h</span>
                <span className="text-xs uppercase tracking-widest text-gray-500">Atendimento Constante</span>
              </div>
              <div>
                <span className="block text-2xl font-light mb-2">100%</span>
                <span className="text-xs uppercase tracking-widest text-gray-500">Privacidade RAG</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Minimalista */}
      <section className="py-24 md:py-40 px-6 max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-light tracking-tight mb-6">Investimento.</motion.h2>
          <motion.p variants={fadeUpVariant} className="text-gray-500 font-light text-lg">Projetado para diferentes escalas operacionais.</motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-0 border-y border-[#1A1A1A]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          
          {/* Starter */}
          <motion.div variants={fadeUpVariant} className="p-10 border-b md:border-b-0 md:border-r border-[#1A1A1A]">
            <h3 className="text-xl font-light mb-2">Starter</h3>
            <div className="text-3xl font-light mb-8">R$ 197 <span className="text-sm text-gray-500">/mês</span></div>
            <ul className="space-y-4 text-sm font-light text-gray-600 mb-12">
              <li>1 Negócio</li>
              <li>RAG Base (Poucos Documentos)</li>
              <li>Agendamento Básico</li>
              <li>Notificações no Telegram</li>
            </ul>
            <Link href="/auth" className="block text-center border border-[#1A1A1A] py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#1A1A1A] hover:text-white transition-colors">
              Selecionar
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div variants={fadeUpVariant} className="p-10 bg-white shadow-2xl scale-105 z-10 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-klinik-primary"></div>
            <h3 className="text-xl font-medium mb-2">Pro</h3>
            <div className="text-3xl font-medium mb-8">R$ 397 <span className="text-sm text-gray-500">/mês</span></div>
            <ul className="space-y-4 text-sm font-light text-gray-600 mb-12">
              <li>Volume Superior de Mensagens</li>
              <li>RAG Avançado (Múltiplos Docs)</li>
              <li>Prioridade de Suporte</li>
              <li>Agendamento Sem Limites</li>
            </ul>
            <Link href="/auth" className="block text-center bg-[#1A1A1A] text-white py-3 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors">
              Assinar Pro
            </Link>
          </motion.div>

          {/* Avançado */}
          <motion.div variants={fadeUpVariant} className="p-10 md:border-l border-[#1A1A1A]">
            <h3 className="text-xl font-light mb-2">Avançado</h3>
            <div className="text-3xl font-light mb-8">R$ 597 <span className="text-sm text-gray-500">/mês</span></div>
            <ul className="space-y-4 text-sm font-light text-gray-600 mb-12">
              <li>Múltiplos Atendentes e Agendas</li>
              <li>Relatórios Avançados</li>
              <li>SLA de Resposta Dedicado</li>
              <li>Integrações Personalizadas</li>
            </ul>
            <Link href="/auth" className="block text-center border border-[#1A1A1A] py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#1A1A1A] hover:text-white transition-colors">
              Contatar
            </Link>
          </motion.div>
          
        </motion.div>
      </section>

      {/* Footer / Imagem Final */}
      <section className="relative w-full h-[50vh] flex items-center justify-center p-6 text-white text-center overflow-hidden">
        <Image 
          src="/images/minimalist_waiting.jpg" 
          alt="Sala de Espera Minimalista" 
          fill 
          className="object-cover absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <motion.div 
          className="relative z-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-8">Eleve o padrão da sua clínica.</h2>
          <Link href="/auth" className="bg-white text-[#1A1A1A] px-10 py-4 text-xs uppercase tracking-widest font-semibold hover:bg-gray-100 transition-colors">
            Iniciar Transformação
          </Link>
        </motion.div>
      </section>

      <footer className="bg-[#1A1A1A] text-gray-500 py-12 text-center text-xs uppercase tracking-widest">
        Klinik OS © 2024. Todos os direitos reservados.
      </footer>
    </main>
  );
}
