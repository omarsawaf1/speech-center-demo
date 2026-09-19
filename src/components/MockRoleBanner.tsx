import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import { Sparkles, Users } from 'lucide-react';
import { DemoRole } from '@/types';

export const MockRoleBanner: React.FC = () => {
  const { t } = useTranslation();
  const { state, setRole } = useApp();

  const roles: { key: DemoRole; labelKey: string }[] = [
    { key: 'ADMINISTRATOR', labelKey: 'roles.ADMINISTRATOR' },
    { key: 'RECEPTIONIST', labelKey: 'roles.RECEPTIONIST' },
    { key: 'THERAPIST', labelKey: 'roles.THERAPIST' },
    { key: 'PARENT', labelKey: 'roles.PARENT' },
  ];

  return (
    <aside aria-label="Prototype demo banner" className="bg-slate-900 text-slate-200 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center p-1 rounded bg-brand-500/20 text-brand-400">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
        <span className="font-medium text-white">{t('common.appTagline')}</span>
        <span className="hidden md:inline text-slate-400">| {t('common.prototypeNotice')}</span>
      </div>

      <div className="flex items-center gap-2 ms-auto">
        <span className="text-slate-400 flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('common.roleSwitcherLabel')}</span>
        </span>
        <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className={`px-2.5 py-1 rounded-md transition-all text-xs font-medium ${
                state.currentRole === r.key
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {t(r.labelKey)}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
