import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-800">404</h1>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        {isRtl
          ? 'عذراً، الصفحة التي تبحث عنها غير موجودة في هذا النموذج التجريبي.'
          : 'The page you are looking for does not exist in this prototype.'}
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>{t('nav.dashboard')}</span>
      </Link>
    </div>
  );
};
