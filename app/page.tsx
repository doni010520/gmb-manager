import Link from "next/link";
import { MapPin, Sparkles, FileText, Star, BarChart3, CheckCircle2, ArrowRight, Zap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[oklch(0.7_0.18_165)]/20">
              <MapPin className="h-5 w-5 text-[oklch(0.8_0.15_165)]" />
            </div>
            <span className="text-lg font-bold text-white">GMB Manager</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-white/70 hover:text-white hover:bg-white/[0.06]">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-[oklch(0.55_0.18_165)] hover:bg-[oklch(0.6_0.18_165)] text-white glow-green">
              <Link href="/register">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/60 mb-6">
            <Sparkles className="h-4 w-4 text-[oklch(0.8_0.15_165)]" />
            Potencializado por Inteligência Artificial
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6 text-white leading-tight">
            Gerencie seu Google Meu Negócio com{" "}
            <span className="gradient-text">Inteligência Artificial</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10">
            Plataforma para escritórios de contabilidade otimizarem seus perfis no Google Meu Negócio,
            gerarem posts automáticos e responderem avaliações com IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
            <Button size="lg" asChild className="bg-[oklch(0.55_0.18_165)] hover:bg-[oklch(0.6_0.18_165)] text-white glow-green h-12 px-8 text-base">
              <Link href="/register">
                Começar Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/10 text-white/70 hover:bg-white/[0.06] hover:text-white h-12 px-8">
              <Link href="#como-funciona">Como Funciona</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12 animate-fade-in">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: "1. Conecte sua Conta Google", desc: "Conecte seu perfil do Google Meu Negócio com apenas um clique. Processo simples e seguro.", delay: "delay-100" },
              { icon: Sparkles, title: "2. IA Otimiza seu Perfil", desc: "A IA gera descrições otimizadas, sugere categorias e melhora a visibilidade do seu perfil.", delay: "delay-200" },
              { icon: Zap, title: "3. Posts e Respostas Automáticas", desc: "A IA gera posts semanais e responde avaliações automaticamente, economizando seu tempo.", delay: "delay-300" },
            ].map((item) => (
              <div key={item.title} className={`glass-strong rounded-2xl p-6 text-center animate-slide-up ${item.delay} hover:bg-white/[0.08] transition-all duration-300`}>
                <div className="mx-auto w-12 h-12 rounded-xl bg-[oklch(0.7_0.18_165)]/15 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-[oklch(0.8_0.15_165)]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/45 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12 animate-fade-in">Recursos</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Sparkles, title: "Otimização de Perfil", desc: "IA gera descrições otimizadas, sugere categorias e serviços para maximizar sua visibilidade no Google.", delay: "delay-100" },
              { icon: FileText, title: "Posts Automáticos", desc: "Posts semanais agendados e gerados por IA para manter seu perfil sempre atualizado e relevante.", delay: "delay-200" },
              { icon: MessageSquare, title: "Gestão de Avaliações", desc: "Respostas inteligentes geradas por IA para todas as avaliações, mantendo o engajamento com clientes.", delay: "delay-300" },
              { icon: BarChart3, title: "Dashboard de Analytics", desc: "Acompanhe o score do perfil, métricas de engajamento e evolução da presença online.", delay: "delay-400" },
            ].map((item) => (
              <div key={item.title} className={`glass rounded-2xl p-6 animate-slide-up ${item.delay} hover:bg-white/[0.06] transition-all duration-300`}>
                <item.icon className="h-8 w-8 text-[oklch(0.8_0.15_165)] mb-3" />
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12 animate-fade-in">Benefícios</h2>
          <div className="glass-strong rounded-2xl p-8 animate-slide-up">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Economize horas de trabalho com IA",
                "Posts automáticos semanais",
                "Respostas inteligentes a avaliações",
                "Perfil otimizado para mais visibilidade",
                "Dashboard com métricas do perfil",
                "Gratuito para começar",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 p-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span className="text-white/60 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-10 animate-fade-in delay-300">
            <Button size="lg" asChild className="bg-[oklch(0.55_0.18_165)] hover:bg-[oklch(0.6_0.18_165)] text-white glow-green h-12 px-8 text-base">
              <Link href="/register">
                Começar Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4">
        <div className="container mx-auto text-center text-sm text-white/30">
          Powered by <a href="https://benitech.com.br" target="_blank" rel="noopener noreferrer" className="text-[oklch(0.7_0.15_165)] hover:text-[oklch(0.8_0.15_165)] transition-colors">Benitech Lab</a>
        </div>
      </footer>
    </div>
  );
}
