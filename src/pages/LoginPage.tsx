import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import { DemoRole } from '@/types';
import { Shield, Stethoscope, UserCheck, Users, ArrowRight, ArrowLeft, Globe, Sparkles } from 'lucide-react';
import { ASSETS } from '@/lib/assets';
import { Button } from '@/components/Button';

export const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { setRole } = useApp();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<DemoRole>('ADMINISTRATOR');
  const [username, setUsername] = useState('demo.admin');
  const [password, setPassword] = useState('••••••••');

  const isRtl = i18n.language.startsWith('ar');
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);
    navigate('/dashboard');
  };

  const handleDirectDemoLogin = (role: DemoRole) => {
    setRole(role);
    navigate('/dashboard');
  };

  const demoRolesList: { role: DemoRole; title: string; desc: string; icon: React.ElementType }[] = [
    {
      role: 'ADMINISTRATOR',
      title: t('roles.ADMINISTRATOR'),
      desc: isRtl ? 'إدارة شاملة للمركز، فريق العمل، التقارير والمدفوعات' : 'Full center management, staff, reports & finances',
      icon: Shield,
    },
    {
      role: 'RECEPTIONIST',
      title: t('roles.RECEPTIONIST'),
      desc: isRtl ? 'حركة اليوم، تسجيل الحضور، والمدفوعات الفورية' : 'Appointment booking, attendance check-in & payments',
      icon: UserCheck,
    },
    {
      role: 'THERAPIST',
      title: t('roles.THERAPIST'),
      desc: isRtl ? 'جدول الجلسات، الحالات المسندة، وتدوين الملاحظات' : 'Session schedules, clinical cases & notes',
      icon: Stethoscope,
    },
    {
      role: 'PARENT',
      title: t('roles.PARENT'),
      desc: isRtl ? 'متابعة مواعيد الطفل، التوصيات المنزلية، والفواتير' : 'Viewing child appointments, progress & invoices',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 via-white to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Navbar */}
      <div className="absolute top-4 start-4 end-4 max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 bg-white/80 backdrop-blur-sm border border-teal-200 px-3.5 py-1.5 rounded-full hover:bg-teal-50 transition-colors shadow-xs"
        >
          {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          <span>{t('login.backToHome')}</span>
        </Link>

        <button
          onClick={toggleLanguage}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors shadow-xs"
        >
          <Globe className="w-3.5 h-3.5 text-teal-600" />
          <span>{t('common.languageSwitcher')}</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl shadow-teal-600/15 border border-teal-100 p-2.5 mb-4">
          <img src={ASSETS.logo} alt="Ofok Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {t('login.title')}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
          {t('login.subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200/80 rounded-3xl sm:px-10">
          {/* Mock Notice */}
          <div className="mb-6 p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-semibold">{t('common.prototypeNotice')}</span>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('login.roleSelector')}
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as DemoRole)}
                className="w-full text-sm rounded-xl border border-slate-300 py-2.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value="ADMINISTRATOR">{t('roles.ADMINISTRATOR')}</option>
                <option value="RECEPTIONIST">{t('roles.RECEPTIONIST')}</option>
                <option value="THERAPIST">{t('roles.THERAPIST')}</option>
                <option value="PARENT">{t('roles.PARENT')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('login.emailLabel')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('login.passwordLabel')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm shadow-md gap-2"
            >
              <span>{t('login.loginButton')}</span>
              <ArrowIcon className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick 1-Click Persona Access */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-500 mb-3">
              {t('login.quickDemo')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoRolesList.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    onClick={() => handleDirectDemoLogin(item.role)}
                    type="button"
                    className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-start transition-all group shadow-xs"
                  >
                    <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-teal-100 group-hover:text-teal-700 text-slate-600 transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-teal-800">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
