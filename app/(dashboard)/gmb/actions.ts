"use server";

import { createClient } from "@/lib/supabase/server";

async function getUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nao autenticado");

  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!data) throw new Error("Usuario nao encontrado");
  return data.id;
}

// ─── Connection ──────────────────────────────────────────

export async function getGmbConnection() {
  const supabase = await createClient();
  const userId = await getUserId();
  const { data } = await supabase
    .from("gmb_connections")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function saveGmbConnection(payload: Record<string, unknown>) {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("gmb_connections")
    .upsert({ ...payload, user_id: userId }, { onConflict: "user_id" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function disconnectGmb() {
  const supabase = await createClient();
  const userId = await getUserId();
  const { error } = await supabase
    .from("gmb_connections")
    .delete()
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}

// ─── Dashboard ───────────────────────────────────────────

export async function getGmbDashboard() {
  const supabase = await createClient();
  const userId = await getUserId();

  const [connRes, postsRes, reviewsRes, logRes] = await Promise.all([
    supabase.from("gmb_connections").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("gmb_posts").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
    supabase.from("gmb_reviews").select("*").eq("user_id", userId).order("review_date", { ascending: false }).limit(5),
    supabase.from("gmb_optimization_log").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
  ]);

  const posts = postsRes.data ?? [];
  const reviews = reviewsRes.data ?? [];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const postsThisMonth = posts.filter((p) => p.created_at >= startOfMonth).length;
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const pendingReviews = reviews.filter((r) => r.reply_status === "pending").length;

  return {
    connection: connRes.data,
    posts,
    reviews,
    log: logRes.data ?? [],
    stats: {
      profileScore: connRes.data?.profile_score ?? 0,
      postsThisMonth,
      avgRating,
      pendingReviews,
      totalReviews: reviews.length,
    },
  };
}

// ─── Posts ────────────────────────────────────────────────

export async function getGmbPosts(status?: string) {
  const supabase = await createClient();
  const userId = await getUserId();

  let query = supabase
    .from("gmb_posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return data ?? [];
}

export async function createGmbPost(formData: {
  content: string;
  cta_type?: string;
  cta_url?: string;
  status?: string;
  scheduled_for?: string;
}) {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("gmb_posts")
    .insert({
      user_id: userId,
      content: formData.content,
      cta_type: formData.cta_type || "none",
      cta_url: formData.cta_url || null,
      status: formData.status || "draft",
      scheduled_for: formData.scheduled_for || null,
      generated_by_ai: true,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateGmbPost(
  id: string,
  formData: {
    content?: string;
    cta_type?: string;
    cta_url?: string;
    status?: string;
    scheduled_for?: string;
  }
) {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("gmb_posts")
    .update(formData)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteGmbPost(id: string) {
  const supabase = await createClient();
  const userId = await getUserId();

  const { error } = await supabase
    .from("gmb_posts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}

export async function publishGmbPost(id: string) {
  const supabase = await createClient();
  const userId = await getUserId();

  // TODO: Call Google Business Profile API to actually publish
  const { data, error } = await supabase
    .from("gmb_posts")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Reviews ─────────────────────────────────────────────

export async function getGmbReviews(filter?: string) {
  const supabase = await createClient();
  const userId = await getUserId();

  let query = supabase
    .from("gmb_reviews")
    .select("*")
    .eq("user_id", userId)
    .order("review_date", { ascending: false });

  if (filter === "positive") {
    query = query.gte("rating", 4);
  } else if (filter === "negative") {
    query = query.lte("rating", 3);
  } else if (filter === "pending") {
    query = query.eq("reply_status", "pending");
  }

  const { data } = await query;
  return data ?? [];
}

export async function replyToReview(id: string, reply: string, repliedBy: "ai" | "manual") {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("gmb_reviews")
    .update({
      reply,
      reply_status: "replied",
      replied_at: new Date().toISOString(),
      replied_by: repliedBy,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Optimization ────────────────────────────────────────

export async function getOptimizationLog() {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data } = await supabase
    .from("gmb_optimization_log")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  return data ?? [];
}

export async function updateProfileScore(connectionId: string) {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data: conn } = await supabase
    .from("gmb_connections")
    .select("*")
    .eq("id", connectionId)
    .eq("user_id", userId)
    .single();

  if (!conn) throw new Error("Conexao nao encontrada");

  let score = 0;
  if (conn.office_name_gmb) score += 15;
  if (conn.description && conn.description.length > 50) score += 20;
  if (conn.primary_category) score += 15;
  if (conn.secondary_categories && conn.secondary_categories.length > 0) score += 10;
  if (conn.services && Array.isArray(conn.services) && conn.services.length > 0) score += 10;
  if (conn.verification_status === "verified") score += 15;
  if (conn.auto_posts_enabled) score += 5;
  if (conn.auto_reviews_enabled) score += 5;
  score += 5; // base score for being connected

  const { error } = await supabase
    .from("gmb_connections")
    .update({ profile_score: score })
    .eq("id", connectionId);

  if (error) throw new Error(error.message);
  return score;
}

// ─── AI Content Generation (Mock) ────────────────────────

export async function generateAiContent(
  type: "description" | "post" | "review_reply",
  context?: Record<string, string>
) {
  // Simulates AI generation delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const officeName = context?.officeName || "seu escritorio";

  switch (type) {
    case "description":
      return `${officeName} e um escritorio de contabilidade comprometido com a excelencia no atendimento. Oferecemos servicos completos de contabilidade, gestao fiscal, departamento pessoal e consultoria empresarial. Com profissionais qualificados e tecnologia de ponta, ajudamos empresas de todos os portes a crescerem com seguranca e conformidade. Entre em contato e descubra como podemos simplificar sua gestao financeira.`;

    case "post":
      return `Voce sabia que manter sua contabilidade em dia pode economizar ate 30% em impostos? No ${officeName}, oferecemos consultoria especializada para otimizar sua carga tributaria. Agende uma consulta gratuita e descubra como podemos ajudar seu negocio a crescer!`;

    case "review_reply": {
      const rating = context?.rating;
      if (rating && parseInt(rating) >= 4) {
        return `Muito obrigado pela sua avaliacao! Ficamos felizes em saber que voce esta satisfeito com nossos servicos. Nossa equipe trabalha diariamente para oferecer o melhor atendimento. Conte sempre conosco!`;
      }
      return `Agradecemos seu feedback. Lamentamos que sua experiencia nao tenha atendido suas expectativas. Gostariam de entender melhor o ocorrido para podermos melhorar. Por favor, entre em contato conosco diretamente para resolvermos essa situacao.`;
    }

    default:
      return "";
  }
}
