
-- Allow NGO admins to read all analysis_history for dashboard
CREATE POLICY "NGO admins can view all reports"
  ON public.analysis_history FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'ngo_admin'));
