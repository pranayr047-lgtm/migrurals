import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, languageNames } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import NgoSidebar from '@/components/ngo/NgoSidebar';
import DashboardOverview from '@/components/ngo/DashboardOverview';
import ReportedSymptoms from '@/components/ngo/ReportedSymptoms';
import DiseaseTrends from '@/components/ngo/DiseaseTrends';
import RuralAreasMonitoring from '@/components/ngo/RuralAreasMonitoring';
import MedicalCamps from '@/components/ngo/MedicalCamps';
import Volunteers from '@/components/ngo/Volunteers';
import AlertsPanel from '@/components/ngo/AlertsPanel';
import NgoSettings from '@/components/ngo/NgoSettings';
import NgoProfile from '@/components/ngo/NgoProfile';
import { Globe, ChevronDown, LogOut, Bell, User } from 'lucide-react';

export type NgoSection = 'overview' | 'symptoms' | 'trends' | 'areas' | 'camps' | 'volunteers' | 'alerts' | 'settings' | 'profile';

const NgoDashboard = () => {
  const [activeSection, setActiveSection] = useState<NgoSection>('overview');
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <DashboardOverview />;
      case 'symptoms': return <ReportedSymptoms />;
      case 'trends': return <DiseaseTrends />;
      case 'areas': return <RuralAreasMonitoring />;
      case 'camps': return <MedicalCamps />;
      case 'volunteers': return <Volunteers />;
      case 'alerts': return <AlertsPanel />;
      case 'settings': return <NgoSettings />;
      case 'profile': return <NgoProfile />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <NgoSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-card/95 backdrop-blur-md px-6">
            <SidebarTrigger className="text-muted-foreground" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">
                {(t as any).ngo?.title || 'NGO Healthcare Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Language selector */}
              <div className="relative">
                <button onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                  <Globe className="h-3.5 w-3.5 text-primary" />
                  <span>{languageNames[language]}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-border bg-card shadow-elevated z-50">
                    {(Object.entries(languageNames) as [typeof language, string][]).map(([code, name]) => (
                      <button key={code} onClick={() => { setLanguage(code); setLangOpen(false); }}
                        className={`block w-full px-4 py-2 text-left text-sm ${language === code ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-muted'}`}>
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                <Bell className="h-4 w-4" />
              </button>

              {/* Admin profile */}
              <button onClick={() => setActiveSection('profile')} className="flex items-center gap-2">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="" className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </button>

              {/* Logout */}
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="h-3.5 w-3.5" />
                {(t as any).ngo?.logout || 'Logout'}
              </button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {renderSection()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default NgoDashboard;
