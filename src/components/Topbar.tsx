import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import {
  Menu,
  Languages,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { DemoRole } from '@/types';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const { state, setRole } = useApp();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Toggle between Arabic and English
  const handleToggleLanguage = () => {
    const nextLang = i18n.language.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const handleRoleSelect = (role: DemoRole) => {
    setRole(role);
  };

  const handleMockLogout = () => {
    setIsProfileOpen(false);
    navigate('/login');
  };

  // Find active staff or parent representation
  const activeStaff = state.staff.find((s) => s.id === state.currentUserId);
  const activeParent = state.parents.find((p) => p.id === state.currentUserId);
  const displayName =
    state.currentRole === 'PARENT'
      ? i18n.language.startsWith('ar') ? activeParent?.nameAr || 'ولي أمر تجريبي' : activeParent?.nameEn || 'Demo Parent'
      : i18n.language.startsWith('ar') ? activeStaff?.nameAr || 'مستخدم النظام' : activeStaff?.nameEn || 'Staff User';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ms-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden focus:outline-hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <span className="text-xs text-slate-400 font-medium">{t('common.appName')}</span>
          <h2 className="text-sm font-semibold text-slate-800">
            {t('roles.' + state.currentRole)}
          </h2>
        </div>
      </div>

      {/* Right side: Language Switcher, Role Selector, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <button
          onClick={handleToggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors"
          title="Switch Language / تغيير اللغة"
        >
          <Languages className="w-3.5 h-3.5 text-brand-600" />
          <span>{t('common.languageSwitcher')}</span>
        </button>

        {/* Role Quick Selector */}
        <div className="relative">
          <select
            value={state.currentRole}
            onChange={(e) => handleRoleSelect(e.target.value as DemoRole)}
            className="text-xs font-medium bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 pe-7 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors cursor-pointer appearance-none"
            aria-label={t('common.roleSwitcherLabel')}
          >
            <option value="ADMINISTRATOR">{t('roles.ADMINISTRATOR')}</option>
            <option value="RECEPTIONIST">{t('roles.RECEPTIONIST')}</option>
            <option value="THERAPIST">{t('roles.THERAPIST')}</option>
            <option value="PARENT">{t('roles.PARENT')}</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute end-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* User / Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-hidden"
            aria-expanded={isProfileOpen}
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <span className="hidden md:block text-xs font-medium text-slate-700 max-w-[130px] truncate">
              {displayName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute end-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-800 truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-brand-600" />
                    {t('roles.' + state.currentRole)}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-start px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <span>{t('nav.settings')}</span>
                  </button>
                  <button
                    onClick={handleMockLogout}
                    className="w-full text-start px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('common.logout')}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
