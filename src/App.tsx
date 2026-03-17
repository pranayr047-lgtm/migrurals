import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import OnboardingGuard from "@/components/OnboardingGuard";
import NgoOnboardingGuard from "@/components/NgoOnboardingGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import NgoOnboarding from "./pages/NgoOnboarding";
import Profile from "./pages/Profile";
import SymptomAnalysis from "./pages/SymptomAnalysis";
import VoiceAssistant from "./pages/VoiceAssistant";
import HealthEducation from "./pages/HealthEducation";
import About from "./pages/About";
import NgoDashboard from "./pages/ngo/NgoDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const isNgoDashboard = location.pathname.startsWith('/ngo');

  return (
    <>
      {!isNgoDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<ProtectedRoute allowedRoles={['user']}><Onboarding /></ProtectedRoute>} />
        <Route path="/ngo/onboarding" element={<ProtectedRoute allowedRoles={['ngo_admin']}><NgoOnboarding /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['user']}><OnboardingGuard><Profile /></OnboardingGuard></ProtectedRoute>} />
        <Route path="/symptom-analysis" element={<ProtectedRoute allowedRoles={['user']}><OnboardingGuard><SymptomAnalysis /></OnboardingGuard></ProtectedRoute>} />
        <Route path="/voice-assistant" element={<ProtectedRoute allowedRoles={['user']}><OnboardingGuard><VoiceAssistant /></OnboardingGuard></ProtectedRoute>} />
        <Route path="/health-education" element={<HealthEducation />} />
        <Route path="/about" element={<About />} />
        <Route path="/ngo" element={<ProtectedRoute allowedRoles={['ngo_admin']}><NgoOnboardingGuard><NgoDashboard /></NgoOnboardingGuard></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isNgoDashboard && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
