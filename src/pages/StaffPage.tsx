import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import { Card, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Stethoscope, Phone, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export const StaffPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { state } = useApp();

  const isRtl = i18n.language.startsWith('ar');
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-brand-600" />
            <span>{t('nav.staff')}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isRtl
              ? 'فريق الأخصائيين، المعالجين، والإداريين مع تصنيف التخصصات'
              : 'Specialists, therapists, and administrative staff roster by specialty'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.staff.map((staff) => (
          <Card key={staff.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0 shadow-xs"
                  style={{ backgroundColor: staff.color }}
                >
                  {isRtl ? staff.nameAr.charAt(0) : staff.nameEn.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {isRtl ? staff.nameAr : staff.nameEn}
                    </h3>
                    <Badge variant={staff.active ? 'success' : 'default'} className="text-[10px]">
                      {staff.active ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'غير نشط' : 'Inactive')}
                    </Badge>
                  </div>
                  <p className="text-xs text-brand-600 font-medium mt-0.5">
                    {t('specialties.' + staff.specialty)}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                    {t('staffRoles.' + staff.role)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600 font-mono">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{staff.phone}</span>
                </p>
                <p className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{staff.email}</span>
                </p>
              </div>
            </CardContent>

            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Link
                to={`/staff/${staff.id}`}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>{t('common.view')}</span>
                <ArrowIcon className="w-3 h-3" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const StaffDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-4">
      <Link to="/staff" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600">
        <ArrowIcon className="w-3.5 h-3.5" />
        <span>{t('nav.staff')}</span>
      </Link>
      <Card className="p-8 text-center">
        <h2 className="text-base font-bold text-slate-800">
          {isRtl ? 'الملف الوظيفي والجدول للأخصائي' : 'Specialist Profile & Schedule'}
        </h2>
        <p className="text-xs text-slate-500 mt-2">
          {isRtl
            ? 'ساعات العمل، الأطفال الموكلون، وجدول المواعيد الأسبوعي (المرحلة الأولى)'
            : 'Working hours, caseload, and weekly schedule (Stage 1 placeholder)'}
        </p>
      </Card>
    </div>
  );
};
