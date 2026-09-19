import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Stethoscope,
  CalendarDays,
  Calendar,
  ClipboardCheck,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  X,
  ExternalLink,
} from 'lucide-react';
import { DemoRole } from '@/types';
import { ASSETS } from '@/lib/assets';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  to: string;
  labelKey: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { state } = useApp();

  // Role-specific navigation arrays conforming strictly to approved architecture
  const getNavItems = (role: DemoRole): NavItem[] => {
    switch (role) {
      case 'ADMINISTRATOR':
        return [
          { to: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
          { to: '/calendar', labelKey: 'nav.calendar', icon: Calendar },
          { to: '/children', labelKey: 'nav.children', icon: Users },
          { to: '/parents', labelKey: 'nav.parents', icon: UserCheck },
          { to: '/staff', labelKey: 'nav.staff', icon: Stethoscope },
          { to: '/appointments', labelKey: 'nav.appointments', icon: CalendarDays },
          { to: '/sessions', labelKey: 'nav.sessions', icon: FileText },
          { to: '/attendance', labelKey: 'nav.attendance', icon: ClipboardCheck },
          { to: '/payments', labelKey: 'nav.payments', icon: CreditCard },
          { to: '/reports', labelKey: 'nav.reports', icon: BarChart3 },
          { to: '/settings', labelKey: 'nav.settings', icon: Settings },
        ];

      case 'RECEPTIONIST':
        return [
          { to: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
          { to: '/calendar', labelKey: 'nav.calendar', icon: Calendar },
          { to: '/children', labelKey: 'nav.children', icon: Users },
          { to: '/parents', labelKey: 'nav.parents', icon: UserCheck },
          { to: '/appointments', labelKey: 'nav.appointments', icon: CalendarDays },
          { to: '/attendance', labelKey: 'nav.attendance', icon: ClipboardCheck },
          { to: '/payments', labelKey: 'nav.payments', icon: CreditCard },
        ];

      case 'THERAPIST':
        return [
          { to: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
          { to: '/calendar', labelKey: 'nav.mySchedule', icon: Calendar },
          { to: '/children', labelKey: 'nav.myCases', icon: Users },
          { to: '/sessions', labelKey: 'nav.sessions', icon: FileText },
        ];

      case 'PARENT':
        return [
          { to: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
          { to: '/children', labelKey: 'nav.myChildren', icon: Users },
          { to: '/appointments', labelKey: 'nav.mySchedule', icon: CalendarDays },
          { to: '/payments', labelKey: 'nav.myBilling', icon: CreditCard },
        ];
    }
  };

  const navItems = getNavItems(state.currentRole);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 z-50 w-64 bg-white border-e border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:translate-x-0 rtl:lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-teal-200/80 bg-teal-50/60 flex items-center justify-center p-1 shrink-0">
              <img src={ASSETS.logo} alt="Ofok" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm font-bold text-slate-800 leading-tight truncate">
                {t('common.appName')}
              </h1>
              <span className="text-[10px] text-teal-700 font-semibold truncate">
                بوابة النظام الداخلي
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Role Tag */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-teal-50 to-cyan-50/50 border-b border-teal-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-teal-900">
            {t('roles.' + state.currentRole)}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to + item.labelKey}
                to={item.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-bold shadow-xs border border-teal-200/60'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-teal-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{t(item.labelKey)}</span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer info & Link back to public site */}
        <div className="p-3 border-t border-slate-100 text-xs bg-slate-50/80 space-y-2">
          <NavLink
            to="/"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-teal-700 bg-white border border-teal-200 hover:bg-teal-50 transition-colors shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{t('common.backToPublic')}</span>
          </NavLink>

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>النموذج التجريبي</span>
            <span className="font-mono bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded">
              v2.0
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
