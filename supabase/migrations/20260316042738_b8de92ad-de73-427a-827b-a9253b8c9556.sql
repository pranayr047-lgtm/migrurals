
-- Medical camps table
CREATE TABLE public.medical_camps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT,
  camp_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Volunteers table
CREATE TABLE public.volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  region TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Camp-volunteer assignments
CREATE TABLE public.camp_volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id UUID REFERENCES public.medical_camps(id) ON DELETE CASCADE NOT NULL,
  volunteer_id UUID REFERENCES public.volunteers(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(camp_id, volunteer_id)
);

-- NGO alerts
CREATE TABLE public.ngo_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'medium',
  region TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medical_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camp_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies: authenticated users can CRUD
CREATE POLICY "Authenticated users can read camps" ON public.medical_camps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert camps" ON public.medical_camps FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update camps" ON public.medical_camps FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete camps" ON public.medical_camps FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read volunteers" ON public.volunteers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert volunteers" ON public.volunteers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update volunteers" ON public.volunteers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete volunteers" ON public.volunteers FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read camp_volunteers" ON public.camp_volunteers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert camp_volunteers" ON public.camp_volunteers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete camp_volunteers" ON public.camp_volunteers FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read alerts" ON public.ngo_alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert alerts" ON public.ngo_alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update alerts" ON public.ngo_alerts FOR UPDATE TO authenticated USING (true);

-- Add location column to analysis_history for regional tracking
ALTER TABLE public.analysis_history ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '';
ALTER TABLE public.analysis_history ADD COLUMN IF NOT EXISTS region TEXT DEFAULT '';
