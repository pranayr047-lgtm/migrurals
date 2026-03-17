
-- Add new columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS current_medications text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS smoking_status text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS alcohol_consumption text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS village_location text DEFAULT NULL;

-- Create ngo_profiles table
CREATE TABLE public.ngo_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  organization_name TEXT NOT NULL DEFAULT '',
  admin_name TEXT NOT NULL DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  region_service_area TEXT DEFAULT '',
  address TEXT DEFAULT '',
  number_of_volunteers INTEGER DEFAULT 0,
  onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ngo_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "NGO admins can read own profile"
  ON public.ngo_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "NGO admins can insert own profile"
  ON public.ngo_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "NGO admins can update own profile"
  ON public.ngo_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_ngo_profiles_updated_at
  BEFORE UPDATE ON public.ngo_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
