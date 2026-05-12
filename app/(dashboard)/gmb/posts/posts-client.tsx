"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Loader2, Trash2, Send, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getGmbPosts,
  createGmbPost,
  deleteGmbPost,
  publishGmbPost,
  generateAiContent,
} from "../actions";

interface Post {
  id: string;
  content: string;
  cta_type: string;
  cta_url: string | null;
  status: string;
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
}

export function PostsClient({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [tab, setTab] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);

  // Form state
  const [content, setContent] = useState("");
  const [ctaType, setCtaType] = useState("none");
  const [ctaUrl, setCtaUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [scheduledFor, setScheduledFor] = useState("");

  async function handleTabChange(value: string) {
    setTab(value);
    const data = await getGmbPosts(value);
    setPosts(data);
  }

  async function handleGenerateAi() {
    setGeneratingAi(true);
    const aiContent = await generateAiContent("post");
    setContent(aiContent);
    setGeneratingAi(false);
  }

  async function handleCreate() {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await createGmbPost({
        content,
        cta_type: ctaType,
        cta_url: ctaUrl || undefined,
        status,
        scheduled_for: scheduledFor || undefined,
      });
      setContent("");
      setCtaType("none");
      setCtaUrl("");
      setStatus("draft");
      setScheduledFor("");
      setShowForm(false);
      const data = await getGmbPosts(tab);
      setPosts(data);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteGmbPost(id);
    const data = await getGmbPosts(tab);
    setPosts(data);
    router.refresh();
  }

  async function handlePublish(id: string) {
    await publishGmbPost(id);
    const data = await getGmbPosts(tab);
    setPosts(data);
    router.refresh();
  }

  const statusLabel: Record<string, string> = {
    draft: "Rascunho",
    scheduled: "Agendado",
    published: "Publicado",
    failed: "Falhou",
  };

  const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    draft: "outline",
    scheduled: "secondary",
    published: "default",
    failed: "destructive",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="draft">Rascunhos</TabsTrigger>
            <TabsTrigger value="scheduled">Agendados</TabsTrigger>
            <TabsTrigger value="published">Publicados</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Post
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Conteudo</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateAi}
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
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Escreva o conteudo do post..."
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de CTA</Label>
                <select
                  value={ctaType}
                  onChange={(e) => setCtaType(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="none">Nenhum</option>
                  <option value="learn_more">Saiba Mais</option>
                  <option value="book">Agendar</option>
                  <option value="call">Ligar</option>
                </select>
              </div>
              {ctaType !== "none" && (
                <div className="space-y-2">
                  <Label>URL do CTA</Label>
                  <Input
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="draft">Rascunho</option>
                  <option value="scheduled">Agendado</option>
                </select>
              </div>
              {status === "scheduled" && (
                <div className="space-y-2">
                  <Label>Agendar Para</Label>
                  <Input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={loading || !content.trim()}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Criar Post
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Nenhum post encontrado.</p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{post.content}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span>{new Date(post.created_at).toLocaleDateString("pt-BR")}</span>
                      {post.scheduled_for && (
                        <span>Agendado: {new Date(post.scheduled_for).toLocaleDateString("pt-BR")}</span>
                      )}
                      {post.cta_type !== "none" && <span>CTA: {post.cta_type}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={statusVariant[post.status]}>
                      {statusLabel[post.status]}
                    </Badge>
                    {post.status === "draft" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublish(post.id)}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Publicar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
