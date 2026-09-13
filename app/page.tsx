"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Check, Clock, Calendar, MessageCircle, ArrowRight, ChevronDown, User, Star, CheckCircle2, XCircle } from "lucide-react";

// Componente para simular balões de WhatsApp
const WAMessage = ({ text, time, isBot = true, delay = 0 }: { text: string, time: string, isBot?: boolean, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay, duration: 0.3 }}
    className={`flex flex-col w-full max-w-[85%] ${isBot ? "items-start" : "items-end ml-auto"} mb-3`}
  >
    <div className={`relative px-4 py-2 text-[15px] shadow-sm ${
      isBot 
        ? "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100" 
        : "bg-[#DCF8C6] text-gray-800 rounded-2xl rounded-tr-sm"
    }`}>
      {text}
      <div className="flex justify-end items-center gap-1 mt-1">
        <span className="text-[10px] text-gray-400 font-medium">{time}</span>
        {!isBot && <Check className="w-3 h-3 text-blue-500" />}
      </div>
    </div>
  </motion.div>
);

export default function SalesLandingPage() {
  const shouldReduceMotion = useReducedMotion();

  // Animações
  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F8] text-[#1A1A1A] selection:bg-klinik-primary/20 font-sans overflow-x-hidden">
      
      {/* Navbar Minimalista */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute top-0 w-full z-50 p-6 md:p-8 flex items-center justify-between max-w-7xl mx-auto left-0 right-0"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold rounded-sm">K</div>
          <span className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A]">Klinik OS</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth" className="hidden md:block text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity text-[#1A1A1A]">
            Login
          </Link>
          <Link href="#demonstracao" className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-sm text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors shadow-lg">
            Ver Demonstração
          </Link>
        </div>
      </motion.nav>

      {/* SEÇÃO 1: HERO */}
      <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-32 px-6 flex flex-col md:flex-row items-center max-w-7xl mx-auto gap-12">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full md:w-[55%] flex flex-col gap-6"
        >
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider w-fit">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Atendimento Inteligente 24/7
          </motion.div>
          <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-5xl lg:text-[64px] font-medium tracking-tight leading-[1.05]">
            Pare de perder agendamentos porque ninguém respondeu no WhatsApp.
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-xl">
            Atenda seus clientes 24h por dia, responda dúvidas automaticamente e transforme conversas em agendamentos — mesmo quando sua equipe está ocupada ou fora do horário comercial.
          </motion.p>
          <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="#demonstracao" className="bg-[#1A1A1A] text-white px-8 py-4 rounded-sm text-sm uppercase tracking-widest font-bold hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-center flex items-center justify-center gap-2">
              Quero ver como funciona <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#demonstracao" className="bg-white text-[#1A1A1A] border border-gray-200 px-8 py-4 rounded-sm text-sm uppercase tracking-widest font-bold hover:bg-gray-50 transition-all text-center flex items-center justify-center">
              Ver demonstração
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Visual Hero - Simulação de WhatsApp */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full md:w-[45%] relative flex justify-center"
        >
           <div className="relative w-full max-w-[360px] h-[600px] bg-[#EFEAE2] rounded-[2.5rem] p-4 shadow-2xl border-[8px] border-white overflow-hidden">
              <div className="w-full h-6 flex justify-between items-center px-4 mb-2 opacity-60">
                <span className="text-[10px] font-medium">21:29</span>
                <div className="flex gap-1"><div className="w-3 h-2 bg-black/80 rounded-sm"></div></div>
              </div>
              <div className="bg-[#075E54] text-white -mx-4 -mt-2 px-4 py-3 flex items-center gap-3 mb-6 shadow-md">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <span className="text-[#075E54] font-bold text-xs">KLINIK</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Sua Empresa</h3>
                  <p className="text-[10px] opacity-80">online</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 overflow-y-auto pb-10 hide-scrollbar">
                 <div className="text-center mb-4"><span className="bg-[#E1F3FB] text-gray-500 text-[10px] px-2 py-1 rounded-md">Hoje</span></div>
                 <WAMessage text="Olá! Queria saber se tem horário para limpeza de pele amanhã depois das 18h." time="21:30" isBot={false} delay={0.5} />
                 <WAMessage text="Olá! Temos sim. Para amanhã, temos disponibilidade às 18:30 e às 19:15. Qual horário você prefere?" time="21:30" isBot={true} delay={1.5} />
                 <WAMessage text="18:30 fica perfeito!" time="21:32" isBot={false} delay={2.5} />
                 <WAMessage text="Excelente! Seu agendamento para Limpeza de Pele amanhã às 18:30 está confirmado ✅ Te enviamos um lembrete 1 hora antes. Até lá!" time="21:32" isBot={true} delay={3.5} />
              </div>
           </div>
           
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 4.5, type: "spring" }}
             className="absolute -right-2 md:-right-8 top-1/2 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3"
           >
             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
               <Calendar className="w-5 h-5 text-green-600" />
             </div>
             <div>
               <p className="text-xs text-gray-500 font-medium">Novo Agendamento</p>
               <p className="font-bold text-sm">R$ 150,00 gerados</p>
             </div>
           </motion.div>
        </motion.div>
      </section>

      {/* SEÇÃO 2: O PROBLEMA */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-6">
              Quantos clientes estão tentando falar com você enquanto <span className="text-red-500 underline decoration-red-200">ninguém pode responder?</span>
            </h2>
            <p className="text-gray-500 text-lg">O cliente de hoje não tem paciência para esperar. Se você demora para responder, ele procura a concorrência.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="bg-[#F9F9F8] rounded-2xl p-6 md:p-8 flex flex-col gap-6 border border-gray-100">
              <div className="flex-1">
                <div className="bg-[#DCF8C6] p-3 rounded-2xl rounded-tr-sm inline-block max-w-[90%] shadow-sm mb-2 text-sm ml-auto float-right text-gray-800">
                  Oi! Qual o valor do procedimento?
                  <div className="text-[10px] text-gray-500 text-right mt-1">22:45</div>
                </div>
                <div className="clear-both"></div>
              </div>
              <div className="border-t border-gray-200 pt-6 mt-auto">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="text-red-500 w-5 h-5" />
                  <h3 className="font-semibold">Fora do Horário</h3>
                </div>
                <p className="text-sm text-gray-600">Cliente manda mensagem à noite, quando seu negócio já fechou.</p>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="bg-[#F9F9F8] rounded-2xl p-6 md:p-8 flex flex-col gap-6 border border-gray-100">
              <div className="flex-1">
                <div className="bg-[#DCF8C6] p-3 rounded-2xl rounded-tr-sm inline-block max-w-[90%] shadow-sm mb-2 text-sm ml-auto float-right text-gray-800">
                  Tem horário para hoje à tarde?
                  <div className="text-[10px] text-gray-500 text-right mt-1">10:15</div>
                </div>
                <div className="clear-both"></div>
              </div>
              <div className="border-t border-gray-200 pt-6 mt-auto">
                <div className="flex items-center gap-3 mb-2">
                  <User className="text-orange-500 w-5 h-5" />
                  <h3 className="font-semibold">Equipe Ocupada</h3>
                </div>
                <p className="text-sm text-gray-600">Sua equipe está focada em quem já está no local e não consegue responder rapidamente.</p>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="bg-[#F9F9F8] rounded-2xl p-6 md:p-8 flex flex-col gap-6 border border-gray-100">
              <div className="flex-1 text-center py-6 text-gray-400 font-medium flex items-center justify-center">
                Nenhuma resposta em 30 minutos...
              </div>
              <div className="border-t border-gray-200 pt-6 mt-auto">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="text-gray-500 w-5 h-5" />
                  <h3 className="font-semibold">Agendamento Perdido</h3>
                </div>
                <p className="text-sm text-gray-600">O cliente desiste e agenda com outro estabelecimento que respondeu na hora.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: A SOLUÇÃO */}
      <section className="py-24 bg-[#1A1A1A] text-white px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6">
              Seu WhatsApp continua atendendo mesmo quando sua equipe não pode.
            </h2>
            <p className="text-gray-400 text-lg">Um sistema que entende suas regras, tira dúvidas e marca na agenda de forma invisível.</p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -translate-y-1/2 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {[
                { title: "Cliente manda mensagem", desc: "Via WhatsApp, em qualquer dia ou horário.", icon: <MessageCircle /> },
                { title: "Resposta Imediata", desc: "O sistema responde instantaneamente e de forma natural.", icon: <Star /> },
                { title: "Tira dúvidas", desc: "Informa preços, serviços e verifica horários livres.", icon: <CheckCircle2 /> },
                { title: "Agenda confirmada", desc: "Conduz o cliente até o agendamento e avisa a equipe.", icon: <Calendar /> }
              ].map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-[#242424] p-8 rounded-xl border border-gray-800 text-center flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center mb-6 text-white shadow-lg">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: BENEFÍCIOS */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-medium tracking-tight mb-12">
              Tudo que você precisa para recuperar tempo e encher sua agenda.
            </motion.h2>
            
            <div className="space-y-8">
              {[
                { title: "Mais agendamentos garantidos", desc: "Não deixe o cliente esperando até o dia seguinte. Atenda no momento exato em que ele quer comprar." },
                { title: "Disponível 24 horas por dia", desc: "Seu cliente pode chamar à noite, no domingo ou feriado. Ele será atendido perfeitamente." },
                { title: "Mais tempo livre para a equipe", desc: "Sua equipe deixa de gastar horas no WhatsApp e foca nos clientes que já estão sendo atendidos." },
                { title: "Agendamento totalmente automático", desc: "O sistema não só conversa: ele conduz até o fim e agenda no seu sistema." },
                { title: "Respostas imediatas", desc: "O cliente recebe a resposta na mesma hora, sem depender de alguém parar tudo para digitar." }
              ].map((item, idx) => (
                <motion.div key={idx} variants={fadeUpVariant} className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-green-500" /></div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image 
              src="/images/doctor_patient.jpg" 
              alt="Equipe focada no atendimento presencial" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-10">
              <p className="text-white text-2xl font-medium leading-snug">
                Sua equipe fica totalmente dedicada ao atendimento presencial e aos relacionamentos de valor.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO 5: ANTES E DEPOIS */}
      <section className="py-24 bg-[#F9F9F8] px-6 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight">O impacto de uma resposta imediata</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* ANTES */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-red-100 flex flex-col items-center text-center opacity-80"
            >
              <div className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-10">O Problema (Como é hoje)</div>
              
              <div className="flex flex-col gap-4 w-full max-w-sm mx-auto mb-10 relative">
                <div className="bg-gray-100 p-4 rounded-xl text-sm text-left font-medium">Cliente manda mensagem no WhatsApp</div>
                <ArrowRight className="w-5 h-5 mx-auto text-gray-300 rotate-90" />
                <div className="bg-red-50 p-4 rounded-xl text-sm border border-red-100 text-red-800 font-medium">Equipe está ocupada e não responde na hora</div>
                <ArrowRight className="w-5 h-5 mx-auto text-gray-300 rotate-90" />
                <div className="bg-gray-100 p-4 rounded-xl text-sm text-left font-medium">Cliente espera alguns minutos</div>
                <ArrowRight className="w-5 h-5 mx-auto text-gray-300 rotate-90" />
                <div className="bg-gray-100 p-4 rounded-xl text-sm text-left font-medium">Cliente desiste e procura outro</div>
              </div>
              
              <div className="mt-auto w-full pt-8 border-t border-gray-100">
                <p className="text-red-500 font-bold text-xl flex items-center justify-center gap-2"><XCircle className="w-6 h-6"/> Dinheiro deixado na mesa</p>
              </div>
            </motion.div>

            {/* DEPOIS */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border-2 border-green-400 flex flex-col items-center text-center transform md:-translate-y-4"
            >
              <div className="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-10">A Solução (Com o Sistema)</div>
              
              <div className="flex flex-col gap-4 w-full max-w-sm mx-auto mb-10 relative">
                <div className="bg-gray-100 p-4 rounded-xl text-sm text-left font-medium">Cliente manda mensagem no WhatsApp</div>
                <ArrowRight className="w-5 h-5 mx-auto text-green-300 rotate-90" />
                <div className="bg-green-50 p-4 rounded-xl text-sm border border-green-200 text-green-800 font-bold shadow-sm">Sistema atende imediatamente</div>
                <ArrowRight className="w-5 h-5 mx-auto text-green-300 rotate-90" />
                <div className="bg-gray-100 p-4 rounded-xl text-sm text-left font-medium">Cliente tira dúvidas sobre o serviço</div>
                <ArrowRight className="w-5 h-5 mx-auto text-green-300 rotate-90" />
                <div className="bg-gray-100 p-4 rounded-xl text-sm text-left font-medium">Cliente escolhe o horário e agenda</div>
              </div>
              
              <div className="mt-auto w-full pt-8 border-t border-gray-100">
                <p className="text-green-600 font-bold text-xl flex items-center justify-center gap-2"><CheckCircle2 className="w-6 h-6"/> Oportunidade transformada em venda</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: ECONOMIA DE TEMPO */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="w-full md:w-1/2 flex flex-wrap gap-4 justify-center md:justify-start"
          >
            {[
              "Qual o valor da consulta?",
              "Vocês atendem sábado?",
              "Tem horário hoje à tarde?",
              "Onde fica o estabelecimento?",
              "Posso marcar para amanhã?",
              "Como funciona o serviço?"
            ].map((pergunta, i) => (
              <div key={i} className="bg-gray-50 text-gray-700 px-6 py-4 rounded-full text-sm font-medium shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform cursor-default">
                "{pergunta}"
              </div>
            ))}
          </motion.div>
          
          <motion.div className="w-full md:w-1/2" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-medium tracking-tight mb-8">
              Pare de gastar seu tempo respondendo as mesmas perguntas.
            </motion.h2>
            <motion.p variants={fadeUpVariant} className="text-lg text-gray-600 mb-8 leading-relaxed">
              O sistema responde automaticamente todas essas perguntas repetitivas com precisão, tirando as dúvidas do cliente e direcionando ele para a marcação do horário.
            </motion.p>
            <motion.div variants={fadeUpVariant} className="bg-[#1A1A1A] text-white p-8 rounded-2xl shadow-xl">
              <span className="font-bold text-xl block mb-2 text-klinik-primary">A ideia é muito simples:</span>
              <p className="text-lg font-light">Sua equipe trabalha sem interrupções contínuas.<br/> O atendimento automático cuida do WhatsApp.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO 7: COMO FUNCIONA (3 PASSOS) */}
      <section className="py-24 bg-[#1A1A1A] text-white px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-medium tracking-tight">Como funciona na prática</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { num: "1", title: "Cliente chama", desc: "Em qualquer momento do dia ou da noite, o cliente inicia a conversa." },
             { num: "2", title: "Sistema conduz", desc: "Responde de forma natural, informa os valores e mostra os horários livres." },
             { num: "3", title: "Agendamento feito", desc: "O cliente agenda e o horário entra automaticamente no seu sistema." }
           ].map((step, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }}
               className="bg-[#242424] p-8 rounded-2xl flex flex-col items-center text-center"
             >
               <div className="w-16 h-16 rounded-full border border-gray-600 flex items-center justify-center text-3xl font-light text-gray-400 mb-6">{step.num}</div>
               <h3 className="text-2xl font-medium mb-4">{step.title}</h3>
               <p className="text-gray-400">{step.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* SEÇÃO 8: PARA QUEM É */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-5xl font-medium tracking-tight mb-16"
          >
            Feito para negócios que vendem e <br/> agendam pelo WhatsApp.
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { nome: "Clínicas de Estética", img: "/images/clinic_reception.jpg" },
              { nome: "Consultórios Odontológicos", img: "/images/doctor_patient.jpg" },
              { nome: "Barbearias de Alto Padrão", img: "/images/smartphone_desk.jpg" }, 
              { nome: "Salões de Beleza", img: "/images/minimalist_waiting.jpg" } 
            ].map((negocio, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative h-64 md:h-80 rounded-2xl overflow-hidden group shadow-lg"
              >
                <Image src={negocio.img} alt={negocio.nome} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-medium text-lg md:text-xl text-left leading-tight">{negocio.nome}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 9: CTA DE CONVERSÃO */}
      <section id="demonstracao" className="py-32 bg-[#1A1A1A] text-white px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-8">
            Enquanto sua equipe trabalha, <br/>seu WhatsApp continua atendendo.
          </h2>
          <p className="text-xl text-gray-400 font-light mb-12 max-w-2xl">
            Veja como o atendimento automático pode funcionar no seu negócio e descubra quanto tempo e dinheiro você pode recuperar.
          </p>
          <Link href="/auth" className="bg-white text-[#1A1A1A] px-12 py-5 rounded-sm text-sm uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors shadow-2xl hover:scale-105 transform duration-200 flex items-center gap-3">
            Quero ver uma demonstração <ArrowRight className="w-5 h-5"/>
          </Link>
        </motion.div>
      </section>

      {/* SEÇÃO 10: FAQ */}
      <section className="py-24 bg-[#F9F9F8] px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight">Dúvidas Frequentes</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                q: "A inteligência artificial substitui minha atendente?", 
                a: "Não. Ela ajuda a equipe assumindo o atendimento inicial e as tarefas mais repetitivas. Dessa forma, sua equipe foca nos clientes presenciais e no relacionamento humano."
              },
              { 
                q: "Funciona fora do horário comercial?", 
                a: "Sim, essa é a grande vantagem! O objetivo é manter seu atendimento disponível 24 horas por dia, 7 dias por semana, sem perder nenhum cliente à noite ou no final de semana."
              },
              { 
                q: "O sistema consegue realmente agendar os clientes sozinho?", 
                a: "Sim. O sistema se conecta à sua agenda, entende os horários livres que você definiu e realiza a marcação, enviando a confirmação para o cliente sem que você precise fazer nada."
              },
              { 
                q: "Preciso contratar alguém para operar o sistema?", 
                a: "Não. A proposta é exatamente o oposto: reduzir a necessidade de trabalho manual no atendimento. Após a rápida configuração inicial, o sistema funciona no piloto automático."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer overflow-hidden">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg hover:bg-gray-50 transition-colors">
                  {faq.q}
                  <span className="transition duration-300 group-open:rotate-180">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </span>
                </summary>
                <div className="text-gray-600 px-6 pb-6 text-base font-light border-t border-gray-50 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-gray-500 py-12 text-center text-xs uppercase tracking-widest">
        Klinik OS © 2024. Todos os direitos reservados.
      </footer>
    </main>
  );
}
