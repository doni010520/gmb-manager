"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Globe, Sparkles, Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveGmbConnection, generateAiContent } from "../actions";

export default function ConnectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [officeName, setOfficeName] = useState("");
  const [isNewProfile, setIsNewProfile] = useState(false);

  // Step 3
  const [description, setDescription] = useState("");
  const [primaryCategory, setPrimaryCategory] = useState("Escritorio de Contabilidade");
  const [generatingAi, setGeneratingAi] = useState(false);

  async function handleStep2Connect() {
    setLoading(true);
    // Simulate Google OAuth delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setStep(3);

    // Auto-generate description
    setGeneratingAi(true);
    const aiDescription = await generateAiContent("description", { officeName });
    setDescription(aiDescription);
    setGeneratingAi(false);
  }

  async function handleComplete() {
    setLoading(true);
    try {
      await saveGmbConnection({
        office_name_gmb: officeName,
        description,
        primary_category: primaryCategory,
        is_new_profile: isNewProfile,
        verification_status: "pending",
        google_account_id: "mock-google-id",
        google_location_id: "mock-location-id",
      });
      router.push("/gmb");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Conectar Google Meu Negocio</h1>
        <p className="text-muted-foreground">Siga os passos para conectar seu perfil</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s < step ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-0.5 ${s < step ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Office Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <MapPin className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Informacoes do Escritorio</CardTitle>
            <CardDescription>Informe os dados do seu escritorio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Escritorio</Label>
              <Input
                placeholder="Ex: Contabilidade Silva"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Perfil</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!isNewProfile}
                    onChange={() => setIsNewProfile(false)}
                    className="accent-primary"
                  />
                  <span className="text-sm">Perfil existente</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={isNewProfile}
                    onChange={() => setIsNewProfile(true)}
                    className="accent-primary"
                  />
                  <span className="text-sm">Novo perfil</span>
                </label>
              </div>
            </div>
            <Button onClick={() => setStep(2)} disabled={!officeName} className="w-full">
              Continuar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Google OAuth */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <Globe className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Conectar com Google</CardTitle>
            <CardDescription>
              Autorize o acesso ao seu perfil do Google Meu Negocio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/50 text-sm text-muted-foreground">
              Ao clicar em &quot;Conectar com Google&quot;, voce sera redirecionado para autorizar
              o acesso ao seu perfil do Google Meu Negocio. Seus dados estao seguros.
            </div>
            <Button onClick={handleStep2Connect} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Conectar com Google
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: AI Optimization */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <Sparkles className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Otimizacao com IA</CardTitle>
            <CardDescription>
              A IA gerou uma descricao otimizada para seu perfil. Voce pode edita-la.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Descricao do Perfil</Label>
              {generatingAi ? (
                <div className="flex items-center gap-2 p-4 rounded-md border bg-muted/50">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Gerando com IA...</span>
                </div>
              ) : (
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>Categoria Principal</Label>
              <Input
                value={primaryCategory}
                onChange={(e) => setPrimaryCategory(e.target.value)}
              />
            </div>
            <Button onClick={handleComplete} disabled={loading || generatingAi} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Concluir Conexao"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
