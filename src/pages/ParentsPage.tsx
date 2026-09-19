import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import { Card, CardContent } from '@/components/Card';
import { UserCheck, Search, Phone, Mail, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

export const ParentsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const isRtl = i18n.language.startsWith('ar');
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const filteredParents = state.parents.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.nameAr.toLowerCase().includes(term) ||
      p.nameEn.toLowerCase().includes(term) ||
      p.phone.includes(term)
    );
  });

  const getChildrenForParent = (parentId: string) => {
    return state.children.filter((c) => c.parentId === parentId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-brand-600" />
            <span>{t('nav.parents')}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isRtl
              ? 'سجل أولياء الأمور، بيانات الاتصال، والأطفال التابعين لكل أسرة'
              : 'Directory of parents, contact information, and associated children'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('common.search')}
            className="w-full text-xs ps-9 pe-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParents.map((parent) => {
          const children = getChildrenForParent(parent.id);
          return (
            <Card key={parent.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {isRtl ? parent.nameAr : parent.nameEn}
                    </h3>
                    <span className="text-[11px] text-brand-600 font-medium">
                      {parent.relationship === 'FATHER'
                        ? (isRtl ? 'الأب' : 'Father')
                        : parent.relationship === 'MOTHER'
                        ? (isRtl ? 'الأم' : 'Mother')
                        : (isRtl ? 'ولي أمر' : 'Guardian')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <p className="flex items-center gap-2 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{parent.phone}</span>
                  </p>
                  {parent.email && (
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{parent.email}</span>
                    </p>
                  )}
                  {parent.address && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{parent.address}</span>
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    {isRtl ? 'الأطفال المسجلون:' : 'Associated Children:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {children.map((c) => (
                      <Link
                        key={c.id}
                        to={`/children/${c.id}`}
                        className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-[11px] font-medium hover:bg-brand-100"
                      >
                        {isRtl ? c.nameAr : c.nameEn}
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>

              <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-end">
                <Link
                  to={`/parents/${parent.id}`}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <span>{t('common.view')}</span>
                  <ArrowIcon className="w-3 h-3" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export const ParentDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-4">
      <Link to="/parents" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600">
        <ArrowIcon className="w-3.5 h-3.5" />
        <span>{t('nav.parents')}</span>
      </Link>
      <Card className="p-8 text-center">
        <h2 className="text-base font-bold text-slate-800">
          {isRtl ? 'تفاصيل ملف ولي الأمر' : 'Parent Profile Details'}
        </h2>
        <p className="text-xs text-slate-500 mt-2">
          {isRtl
            ? 'عرض تفصيلي لسجل مدفوعات وتواصل الأسرة (نموذج تمهيدي للمرحلة الأولى)'
            : 'Detailed family billing and contact history (Stage 1 placeholder)'}
        </p>
      </Card>
    </div>
  );
};
