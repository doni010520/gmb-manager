"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { updateUserProfile } from "./actions";

interface Profile {
  id: string;
  name: string;
  email: string;
  office_name: string | null;
  phone: string | null;
  slug: string | null;
  plan: string;
}

const plans = [
  {
    name: "Free",
    value: "free",
    price: "R$ 0",
    features: [
      "1 perfil Google Meu Negocio",
      "2 posts por mes",
      "Respostas manuais a avaliacoes",
      "Dashboard basico",
    ],
  },
  {
    name: "Pro",
    value: "pro",
    price: "R$ 49/mes",
    features: [
      "1 perfil Google Meu Negocio",
      "Posts ilimitados",
      "Respostas automaticas com IA",
      "Dashboard completo",
      "Agendamento de posts",
      "Suporte prioritario",
    ],
  },
  {
    name: "Agency",
    value: "agency",
    price: "R$ 149/mes",
    features: [
      "Ate 10 perfis Google Meu Negocio",
      "Posts ilimitados",
      "Respostas automaticas com IA",
      "Dashboard avancado",
      "Agendamento de posts",
      "Relatorios personalizados",
      "API access",
      "Suporte dedicado",
    ],
  },
];

export function SettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(profile.name);
  const [officeName, setOfficeName] = useState(profile.office_name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [slug, setSlug] = useState(profile.slug || "");

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await updateUserProfile({ name, office_name: officeName, phone, slug });
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Tabs defaultValue="profile" className="max-w-2xl">
      <TabsList>
        <TabsTrigger value="profile">Perfil</TabsTrigger>
        <TabsTrigger value="plan">Plano</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>Atualize suas informacoes de perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">O email nao pode ser alterado</p>
            </div>
            <div className="space-y-2">
              <Label>Nome do Escritorio</Label>
              <Input value={officeName} onChange={(e) => setOfficeName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="meu-escritorio" />
              <p className="text-xs text-muted-foreground">Identificador unico do seu escritorio</p>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : saved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Salvo!
                </>
              ) : (
                "Salvar Alteracoes"
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="plan" className="space-y-6 mt-6">
        <div className="grid gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.value}
              className={plan.value === profile.plan ? "border-primary" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {plan.name}
                      {plan.value === profile.plan && (
                        <Badge variant="default">Plano Atual</Badge>
                      )}
                      {plan.value === "agency" && <Crown className="h-4 w-4 text-yellow-500" />}
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold mt-1">
                      {plan.price}
                    </CardDescription>
                  </div>
                  {plan.value !== profile.plan && plan.value !== "free" && (
                    <Button variant="outline" disabled>
                      Em breve
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
