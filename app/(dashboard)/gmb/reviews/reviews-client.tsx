"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Sparkles, Loader2, Send, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGmbReviews, replyToReview, generateAiContent } from "../actions";

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  reply: string | null;
  reply_status: string;
  replied_at: string | null;
  replied_by: string | null;
  review_date: string;
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

export function ReviewsClient({ initialReviews }: { initialReviews: Review[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [tab, setTab] = useState("all");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingAi, setGeneratingAi] = useState<string | null>(null);

  async function handleTabChange(value: string) {
    setTab(value);
    const filter = value === "all" ? undefined : value;
    const data = await getGmbReviews(filter);
    setReviews(data);
  }

  async function handleGenerateReply(reviewId: string, rating: number) {
    setGeneratingAi(reviewId);
    setReplyingTo(reviewId);
    const aiReply = await generateAiContent("review_reply", { rating: String(rating) });
    setReplyText(aiReply);
    setGeneratingAi(null);
  }

  async function handleSendReply(reviewId: string, repliedBy: "ai" | "manual") {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      await replyToReview(reviewId, replyText, repliedBy);
      setReplyingTo(null);
      setReplyText("");
      const filter = tab === "all" ? undefined : tab;
      const data = await getGmbReviews(filter);
      setReviews(data);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    pending: { label: "Pendente", variant: "outline" },
    replied: { label: "Respondida", variant: "default" },
    skipped: { label: "Ignorada", variant: "secondary" },
  };

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="positive">Positivas (4-5)</TabsTrigger>
          <TabsTrigger value="negative">Negativas (1-3)</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
        </TabsList>
      </Tabs>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Nenhuma avaliacao encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6 space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{review.reviewer_name}</span>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.review_date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Badge variant={statusConfig[review.reply_status]?.variant || "outline"}>
                    {statusConfig[review.reply_status]?.label || review.reply_status}
                  </Badge>
                </div>

                {/* Comment */}
                {review.comment && (
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                )}

                {/* Existing Reply */}
                {review.reply && (
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Resposta ({review.replied_by === "ai" ? "IA" : "Manual"})
                    </p>
                    <p className="text-sm">{review.reply}</p>
                  </div>
                )}

                {/* Reply Section (Pending) */}
                {review.reply_status === "pending" && (
                  <div className="space-y-3">
                    {replyingTo === review.id ? (
                      <>
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          placeholder="Escreva sua resposta..."
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSendReply(review.id, "manual")}
                            disabled={loading || !replyText.trim()}
                          >
                            {loading ? (
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            ) : (
                              <Send className="mr-1 h-3 w-3" />
                            )}
                            Enviar Resposta
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateReply(review.id, review.rating)}
                          disabled={generatingAi === review.id}
                        >
                          {generatingAi === review.id ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : (
                            <Sparkles className="mr-1 h-3 w-3" />
                          )}
                          Gerar Resposta IA
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setReplyingTo(review.id);
                            setReplyText("");
                          }}
                        >
                          Responder Manualmente
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
