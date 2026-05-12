"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { saveGmbConnection, generateAiContent, updateProfileScore } from "../actions";

interface Connection {
  id: string;
  office_name_gmb: string | null;
  description: string | null;
  primary_category: string | null;
  secondary_categories: string[] | null;
  services: string[] | null;
  post_frequency: string;
  post_tone: string;
  auto_posts_enabled: boolean;
  auto_reviews_enabled: boolean;
}

const CATEGORIES = [
  "Escritorio de Contabilidade",
  "Consultoria Financeira",
  "Consultoria Tributaria",
  "Servicos Fiscais",
  "Departamento Pessoal",
  "Consultoria Empresarial",
];

export function ProfileEditor({ connection }: { connection: Connection }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);

  const [officeName, setOfficeName] = useState(connection.office_name_gmb || "");
  const [description, setDescription] = useState(connection.description || "");
  const [primaryCategory, setPrimaryCategory] = useState(connection.primary_category || "");
  const [secondaryCategories, setSecondaryCategories] = useState<string[]>(
    connection.secondary_categories || []
  );
  const [services, setServices] = useState<string[]>(
    (connection.services as string[] | null) || []
  );
  const [newService, setNewService] = useState("");
  const [postFrequency, setPostFrequency] = useState(connection.post_frequency);
  const [postTone, setPostTone] = useState(connection.post_tone);
  const [autoPosts, setAutoPosts] = useState(connection.auto_posts_enabled);
  const [autoReviews, setAutoReviews] = useState(connection.auto_reviews_enabled);

  async function handleGenerateDescription() {
    setGeneratingAi(true);
    const aiDesc = await generateAiContent("description", { officeName });
    setDescription(aiDesc);
    setGeneratingAi(false);
  }

  function addService() {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService("");
    }
  }

  function removeService(service: string) {
    setServices(services.filter((s) => s !== service));
  }

  function toggleSecondaryCategory(cat: string) {
    if (secondaryCategories.includes(cat)) {
      setSecondaryCategories(secondaryCategories.filter((c) => c !== cat));
    } else {
      setSecondaryCategories([...secondaryCategories, cat]);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveGmbConnection({
        office_name_gmb: officeName,
        description,
        primary_category: primaryCategory,
        secondary_categories: secondaryCategories,
        services,
        post_frequency: postFrequency,
        post_tone: postTone,
        auto_posts_enabled: autoPosts,
        auto_reviews_enabled: autoReviews,
      });
      await updateProfileScore(connection.id);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informacoes do Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome no Google Meu Negocio</Label>
            <Input value={officeName} onChange={(e) => setOfficeName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Descricao</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={generatingAi}
              >
                {generatingAi ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="mr-1 h-3 w-3" />
                )}
                Gerar com IA
              </Button>
            </div>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Categoria Principal</Label>
            <select
              value={primaryCategory}
              onChange={(e) => setPrimaryCategory(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="">Selecione...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Categorias Secundarias</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c !== primaryCategory).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleSecondaryCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    secondaryCategories.includes(cat)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-input hover:bg-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle>Servicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Adicionar servico..."
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
            />
            <Button type="button" variant="outline" size="icon" onClick={addService}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <span
                key={service}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs"
              >
                {service}
                <button type="button" onClick={() => removeService(service)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Automacao</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Frequencia de Posts</Label>
            <select
              value={postFrequency}
              onChange={(e) => setPostFrequency(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="weekly">Semanal</option>
              <option value="biweekly">Quinzenal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Tom dos Posts</Label>
            <select
              value={postTone}
              onChange={(e) => setPostTone(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="formal">Formal</option>
              <option value="friendly">Amigavel</option>
              <option value="casual">Casual</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Posts Automaticos</Label>
            <Switch checked={autoPosts} onCheckedChange={setAutoPosts} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Respostas Automaticas a Avaliacoes</Label>
            <Switch checked={autoReviews} onCheckedChange={setAutoReviews} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          "Salvar Alteracoes"
        )}
      </Button>
    </div>
  );
}
