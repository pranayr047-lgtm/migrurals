import {
  LayoutDashboard, FileText, TrendingUp, MapPin,
  Tent, Users, AlertTriangle, Settings, Building2, Brain,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { NgoSection } from '@/pages/ngo/NgoDashboard';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const NgoSidebar = ({
  activeSection,
  onSectionChange,
}: {
  activeSection: NgoSection;
  onSectionChange: (s: NgoSection) => void;
}) => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { t } = useLanguage();
  const ngo = (t as any).ngo || {};

  const items: { key: NgoSection; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'overview', label: ngo.sidebar_overview || 'Dashboard Overview', icon: LayoutDashboard },
    { key: 'symptoms', label: ngo.sidebar_symptoms || 'Reported Symptoms', icon: FileText },
    { key: 'trends', label: ngo.sidebar_trends || 'Disease Trends', icon: TrendingUp },
    { key: 'areas', label: ngo.sidebar_areas || 'Rural Areas', icon: MapPin },
    { key: 'region_analysis', label: ngo.sidebar_region_analysis || 'Region Health Analysis', icon: TrendingUp },
    { key: 'camps', label: ngo.sidebar_camps || 'Medical Camps', icon: Tent },
    { key: 'volunteers', label: ngo.sidebar_volunteers || 'Volunteers', icon: Users },
    { key: 'alerts', label: ngo.sidebar_alerts || 'Alerts', icon: AlertTriangle },
    { key: 'profile', label: ngo.sidebar_profile || 'NGO Profile', icon: Building2 },
    { key: 'ai_settings', label: ngo.sidebar_ai || 'AI Model Settings', icon: Brain },
    { key: 'settings', label: ngo.sidebar_settings || 'Settings', icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60">
              {ngo.navigation || 'Navigation'}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.key)}
                    className={`cursor-pointer transition-colors ${
                      activeSection === item.key
                        ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default NgoSidebar;
