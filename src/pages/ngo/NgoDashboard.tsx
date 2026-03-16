import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
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

export type NgoSection = 'overview' | 'symptoms' | 'trends' | 'areas' | 'camps' | 'volunteers' | 'alerts' | 'settings';

const NgoDashboard = () => {
  const [activeSection, setActiveSection] = useState<NgoSection>('overview');
  const { t } = useLanguage();

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
              <span className="text-sm text-muted-foreground">
                {(t as any).ngo?.org_name || 'Rural Health Initiative'}
              </span>
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
