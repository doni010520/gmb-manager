-- ============================================================
-- GMB Manager Standalone - Database Schema
-- Uses its own Supabase project (separate from CRM)
-- ============================================================

-- Users table (one row per auth user)
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  office_name text,
  phone text,
  slug text UNIQUE,
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'agency')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- GMB Connections (one per user)
CREATE TABLE public.gmb_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  google_account_id text,
  google_location_id text,
  google_access_token text,
  google_refresh_token text,
  google_token_expires_at timestamptz,
  office_name_gmb text,
  description text,
  primary_category text,
  secondary_categories text[] DEFAULT '{}',
  services jsonb DEFAULT '[]',
  profile_score integer DEFAULT 0,
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
  is_new_profile boolean DEFAULT false,
  auto_posts_enabled boolean DEFAULT true,
  auto_reviews_enabled boolean DEFAULT true,
  post_frequency text DEFAULT 'weekly' CHECK (post_frequency IN ('weekly', 'biweekly', 'monthly')),
  post_tone text DEFAULT 'formal' CHECK (post_tone IN ('formal', 'friendly', 'casual')),
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- GMB Posts
CREATE TABLE public.gmb_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  google_post_id text,
  content text NOT NULL,
  cta_type text DEFAULT 'none' CHECK (cta_type IN ('learn_more', 'book', 'call', 'none')),
  cta_url text,
  image_url text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_for timestamptz,
  published_at timestamptz,
  generated_by_ai boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- GMB Reviews
CREATE TABLE public.gmb_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  google_review_id text NOT NULL,
  reviewer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  reply text,
  reply_status text DEFAULT 'pending' CHECK (reply_status IN ('pending', 'replied', 'skipped')),
  replied_at timestamptz,
  replied_by text CHECK (replied_by IN ('ai', 'manual')),
  review_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, google_review_id)
);

-- GMB Optimization Log
CREATE TABLE public.gmb_optimization_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('description_updated', 'categories_updated', 'services_added', 'profile_created', 'posts_scheduled', 'review_replied')),
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gmb_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gmb_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gmb_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gmb_optimization_log ENABLE ROW LEVEL SECURITY;

-- Users can only see their own row
CREATE POLICY "users_own" ON public.users
  FOR ALL USING (auth_id = auth.uid());

-- RLS using a helper to get user_id from auth
CREATE OR REPLACE FUNCTION public.auth_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.users WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE POLICY "user_isolation" ON public.gmb_connections FOR ALL USING (user_id = auth_user_id());
CREATE POLICY "user_isolation" ON public.gmb_posts FOR ALL USING (user_id = auth_user_id());
CREATE POLICY "user_isolation" ON public.gmb_reviews FOR ALL USING (user_id = auth_user_id());
CREATE POLICY "user_isolation" ON public.gmb_optimization_log FOR ALL USING (user_id = auth_user_id());

-- Indexes
CREATE INDEX idx_gmb_posts_user ON public.gmb_posts(user_id);
CREATE INDEX idx_gmb_posts_status ON public.gmb_posts(status);
CREATE INDEX idx_gmb_reviews_user ON public.gmb_reviews(user_id);
CREATE INDEX idx_gmb_reviews_status ON public.gmb_reviews(reply_status);
CREATE INDEX idx_gmb_log_user ON public.gmb_optimization_log(user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.gmb_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Handle new user creation on auth.signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (auth_id, name, email, office_name, phone, slug)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'office_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'slug'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
