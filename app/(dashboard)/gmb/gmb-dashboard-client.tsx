"use client";

import Link from "next/link";
import {
  TrendingUp,
  FileText,
  Star,
  BarChart3,
  Plus,
  Eye,
  Sparkles,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardData {
  connection: Record<string, unknown> | null;
  posts: Record<string, unknown>[];
  reviews: Record<string, unknown>[];
  log: Record<string, unknown>[];
  stats: {
    profileScore: number;
    postsThisMonth: number;
    avgRating: string | null;
    pendingReviews: number;
    totalReviews: number;
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

const actionLabels: Record<string, string> = {
  description_updated: "Descricao atualizada",
  categories_updated: "Categorias atualizadas",
  services_added: "Servicos adicionados",
  profile_created: "Perfil criado",
  posts_scheduled: "Posts agendados",
  review_replied: "Avaliacao respondida",
};

export function GmbDashboardClient({ dashboard }: { dashboard: DashboardData }) {
  const { stats, posts, reviews, log } = dashboard;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Google Meu Negocio</h1>
        <p className="text-muted-foreground">Visao geral do seu perfil</p>
      </div>

      {/* Profile Score Gauge */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profile Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    className="text-muted/50"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    className="text-primary"
                    strokeWidth="3"
                    strokeDasharray={`${stats.profileScore}, 100`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                  {stats.profileScore}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Posts Este Mes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.postsThisMonth}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Avaliacoes</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReviews}</div>
            {stats.avgRating && (
              <p className="text-sm text-muted-foreground">Media: {stats.avgRating}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avaliacoes Pendentes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/gmb/posts">
            <Plus className="mr-2 h-4 w-4" />
            Criar Post
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/gmb/reviews">
            <Eye className="mr-2 h-4 w-4" />
            Ver Avaliacoes
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/gmb/profile">
            <Sparkles className="mr-2 h-4 w-4" />
            Otimizar Perfil
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Avaliacoes Recentes</CardTitle>
            <CardDescription>Ultimas avaliacoes recebidas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma avaliacao ainda.</p>
            ) : (
              reviews.map((review: Record<string, unknown>) => (
                <div key={review.id as string} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{review.reviewer_name as string}</span>
                      <StarRating rating={review.rating as number} />
                    </div>
                    {typeof review.comment === "string" && review.comment && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {review.comment}
                      </p>
                    )}
                  </div>
                  <Badge variant={review.reply_status === "replied" ? "secondary" : "outline"}>
                    {review.reply_status === "replied" ? "Respondida" : "Pendente"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Posts Recentes</CardTitle>
            <CardDescription>Ultimos posts criados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum post criado ainda.</p>
            ) : (
              posts.map((post: Record<string, unknown>) => (
                <div key={post.id as string} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{post.content as string}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(post.created_at as string).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Badge
                    variant={
                      (post.status as string) === "published"
                        ? "default"
                        : (post.status as string) === "scheduled"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {(post.status as string) === "published"
                      ? "Publicado"
                      : (post.status as string) === "scheduled"
                      ? "Agendado"
                      : "Rascunho"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Log de Atividades</CardTitle>
          <CardDescription>Historico de otimizacoes e acoes</CardDescription>
        </CardHeader>
        <CardContent>
          {log.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma atividade registrada.</p>
          ) : (
            <div className="space-y-3">
              {log.map((entry: Record<string, unknown>) => (
                <div key={entry.id as string} className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{actionLabels[entry.action as string] || (entry.action as string)}</span>
                  <span className="text-muted-foreground ml-auto text-xs">
                    {new Date(entry.created_at as string).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
