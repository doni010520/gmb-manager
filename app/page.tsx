import Link from "next/link";
import { MapPin, Sparkles, FileText, Star, BarChart3, CheckCircle2, ArrowRight, Zap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">GMB Manager</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Sparkles className="h-4 w-4" />
            Potencializado por Inteligencia Artificial
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            Gerencie seu Google Meu Negocio com{" "}
            <span className="text-primary">Inteligencia Artificial</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Plataforma para escritorios de contabilidade otimizarem seus perfis no Google Meu Negocio,
            gerarem posts automaticos e responderem avaliacoes com IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Comecar Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#como-funciona">Como Funciona</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">1. Conecte sua Conta Google</CardTitle>
                <CardDescription>
                  Conecte seu perfil do Google Meu Negocio com apenas um clique. Processo simples e seguro.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">2. IA Otimiza seu Perfil</CardTitle>
                <CardDescription>
                  A IA gera descricoes otimizadas, sugere categorias e melhora a visibilidade do seu perfil.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">3. Posts e Respostas Automaticas</CardTitle>
                <CardDescription>
                  A IA gera posts semanais e responde avaliacoes automaticamente, economizando seu tempo.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Sparkles className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Otimizacao de Perfil</CardTitle>
                <CardDescription>
                  IA gera descricoes otimizadas, sugere categorias e servicos para maximizar sua visibilidade no Google.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Posts Automaticos</CardTitle>
                <CardDescription>
                  Posts semanais agendados e gerados por IA para manter seu perfil sempre atualizado e relevante.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Gestao de Avaliacoes</CardTitle>
                <CardDescription>
                  Respostas inteligentes geradas por IA para todas as avaliacoes, mantendo o engajamento com clientes.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Dashboard de Analytics</CardTitle>
                <CardDescription>
                  Acompanhe o score do perfil, metricas de engajamento e evolucao da presenca online.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Beneficios</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Economize horas de trabalho com IA",
              "Posts automaticos semanais",
              "Respostas inteligentes a avaliacoes",
              "Perfil otimizado para mais visibilidade",
              "Dashboard com metricas do perfil",
              "Gratuito para comecar",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button size="lg" asChild>
              <Link href="/register">
                Comecar Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          Powered by <span className="font-semibold text-foreground">Benitech Lab</span>
        </div>
      </footer>
    </div>
  );
}
