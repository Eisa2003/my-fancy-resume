
CREATE TABLE public.resume (
  id text PRIMARY KEY DEFAULT 'main',
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.resume TO anon, authenticated;
GRANT ALL ON public.resume TO service_role;
ALTER TABLE public.resume ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read resume" ON public.resume FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert resume" ON public.resume FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update resume" ON public.resume FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
