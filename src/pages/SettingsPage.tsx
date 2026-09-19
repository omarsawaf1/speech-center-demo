import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Settings, RotateCcw, CheckCircle2, Languages, Shield, Info } from 'lucide-react';
import { DemoRole } from '@/types';

export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { state, resetDemoData, setRole } = useApp();
  const [resetSuccessMessage, setResetSuccessMessage] = useState(false);

  const isRtl = i18n.language.startsWith('ar');

  const handleResetData = () => {
    const confirmed = window.confirm(
      isRtl
        ? 'هل أنت متأكد من رغبتك في استعادة البيانات التجريبية الأصلية؟ سيتم مسح أي تعديلات قمت بها محلياً.'
        : 'Are you sure you want to reset all mock data to original defaults? Local edits will be cleared.'
    );

    if (confirmed) {
      resetDemoData();
      setResetSuccessMessage(true);
      setTimeout(() => setResetSuccessMessage(false), 4000);
    }
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-600" />
          <span>{t('nav.settings')}</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isRtl
            ? 'إدارة بيئة العرض التوضيحي، استعادة البيانات الافتراضية، وإعدادات اللغة'
            : 'Prototype environment controls, demo dataset restoration, and language options'}
        </p>
      </div>

      {resetSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{t('common.resetSuccess')}</span>
        </div>
      )}

      {/* Demo State Control (RESET DEMO DATA) */}
      <Card className="border-amber-200">
        <CardHeader className="bg-amber-50/50">
          <CardTitle className="text-sm flex items-center gap-2 text-amber-900">
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>{t('settings.demoSection')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('settings.demoDescription')}
          </p>

          <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-500 space-y-1">
            <p>
              • {isRtl ? 'حالة التخزين المحلي:' : 'Local Storage status:'}{' '}
              <span className="font-mono text-slate-800 font-semibold">
                speech_center_mock_state_v1
              </span>
            </p>
            <p>
              • {isRtl ? 'الأطفال المسجلون:' : 'Active children in state:'}{' '}
              <span className="font-bold text-slate-800">{state.children.length}</span> |{' '}
              {isRtl ? 'المواعيد:' : 'Appointments:'}{' '}
              <span className="font-bold text-slate-800">{state.appointments.length}</span> |{' '}
              {isRtl ? 'المدفوعات:' : 'Payments:'}{' '}
              <span className="font-bold text-slate-800">{state.payments.length}</span>
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('settings.resetButton')}</span>
          </button>
        </CardContent>
      </Card>

      {/* Language & Direction Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Languages className="w-4 h-4 text-brand-600" />
            <span>{isRtl ? 'لغة واجهة النظام والاتجاه' : 'System Interface Language & Direction'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            {isRtl
              ? 'اللغة الافتراضية للنظام هي العربية مع دعم كامل للاتجاه من اليمين لليسار (RTL) واستخدام المصطلحات المعتمدة في مراكز التخاطب بمصر.'
              : 'The default language is Arabic with full RTL support and Egyptian clinical terminology. English (LTR) is also supported.'}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => handleLanguageChange('ar')}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                i18n.language.startsWith('ar')
                  ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              العربية (RTL - الافتراضية)
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                !i18n.language.startsWith('ar')
                  ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              English (LTR)
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Role Demonstration Switcher */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-600" />
            <span>{t('settings.rolesInfo')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-3">
          <p className="text-xs text-slate-600">
            {isRtl
              ? 'يمكنك تبديل الدور لاختبار كيف تتكيف القوائم والصلاحيات في الواجهة للمستخدمين المختلفين:'
              : 'Switch roles to test how navigation adapts for different center personnel:'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['ADMINISTRATOR', 'RECEPTIONIST', 'THERAPIST', 'PARENT'] as DemoRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`p-3 rounded-lg border text-start text-xs transition-all ${
                  state.currentRole === r
                    ? 'border-brand-500 bg-brand-50/50 font-bold text-brand-800'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {t('roles.' + r)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System & Architecture Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-600" />
            <span>{t('settings.systemInfo')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 text-xs text-slate-600 space-y-2">
          <p>
            • <strong className="text-slate-800">النمط المعماري:</strong> Frontend-Only Interactive Prototype.
          </p>
          <p>
            • <strong className="text-slate-800">التوجيه (Routing):</strong> HashRouter متوافق مع استضافة GitHub Pages المجانية بدون مشاكل 404 عند تحديث الصفحة.
          </p>
          <p>
            • <strong className="text-slate-800">طبقة البيانات:</strong> مستودع حالة مركزي (React Context + localStorage) مع خدمات برمجية قابلة للاستبدال مستقبلاً بواجهات برمجة التطبيقات (API).
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
