import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { formatCurrency } from '@/lib/utils';
import { User, Phone, ArrowLeft, ArrowRight, Calendar, FileText, CreditCard } from 'lucide-react';

export const ChildDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { state } = useApp();

  const isRtl = i18n.language.startsWith('ar');
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const child = state.children.find((c) => c.id === id);
  const parent = state.parents.find((p) => p.id === child?.parentId);
  const childAppointments = state.appointments.filter((a) => a.childIds.includes(child?.id || ''));
  const childSessions = state.sessions.filter((s) => s.childId === child?.id);
  const childPayments = state.payments.filter((p) => p.childId === child?.id);

  if (!child) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-slate-800">{isRtl ? 'الطفل غير موجود' : 'Child not found'}</h2>
        <Link to="/children" className="mt-4 inline-flex items-center text-xs font-semibold text-brand-600">
          <BackArrow className="w-4 h-4 me-1" />
          <span>{t('nav.children')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Back */}
      <div>
        <Link
          to="/children"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors"
        >
          <BackArrow className="w-3.5 h-3.5" />
          <span>{isRtl ? 'العودة لقائمة الأطفال' : 'Back to Children List'}</span>
        </Link>
      </div>

      {/* Child Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-2xl border border-brand-200">
                <User className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-slate-900">
                    {isRtl ? child.nameAr : child.nameEn}
                  </h1>
                  <Badge variant={child.status === 'ACTIVE' ? 'success' : 'info'}>
                    {child.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isRtl ? 'تاريخ الميلاد:' : 'DOB:'} {child.birthDate} ({child.gender === 'MALE' ? (isRtl ? 'ذكر' : 'Male') : (isRtl ? 'أنثى' : 'Female')})
                </p>
              </div>
            </div>

            {/* Parent Contact Box */}
            {parent && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:max-w-xs">
                <p className="font-semibold text-slate-700 mb-1">
                  {isRtl ? 'بيانات ولي الأمر:' : 'Guardian Contact:'}
                </p>
                <p className="font-bold text-slate-900">{isRtl ? parent.nameAr : parent.nameEn}</p>
                <p className="text-slate-500 flex items-center gap-1.5 mt-0.5 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{parent.phone}</span>
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isRtl ? 'ملخص الحالة والتشخيص' : 'Diagnosis & Case Summary'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {child.diagnosisSummary || (isRtl ? 'لا توجد ملاحظات تشخيصية مسجلة' : 'No diagnosis recorded')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs / Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appointments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>{t('nav.appointments')} ({childAppointments.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {childAppointments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">{t('common.noData')}</p>
            ) : (
              childAppointments.map((a) => (
                <div key={a.id} className="p-2.5 rounded-lg border border-slate-100 text-xs bg-slate-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-800 font-mono">{a.date}</span>
                    <Badge variant={a.status === 'COMPLETED' ? 'success' : 'default'} className="text-[10px]">
                      {a.status}
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-[11px]">{a.startTime} - {a.endTime}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Sessions Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <span>{t('nav.sessions')} ({childSessions.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {childSessions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">{t('common.noData')}</p>
            ) : (
              childSessions.map((s) => (
                <div key={s.id} className="p-2.5 rounded-lg border border-slate-100 text-xs bg-slate-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-brand-700">{s.sessionObjective}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{s.date}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-2">{s.notes}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Payments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              <span>{t('nav.payments')} ({childPayments.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {childPayments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">{t('common.noData')}</p>
            ) : (
              childPayments.map((p) => (
                <div key={p.id} className="p-2.5 rounded-lg border border-slate-100 text-xs bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{formatCurrency(p.amount, i18n.language)}</p>
                    <p className="text-[10px] text-slate-400">{p.invoiceNumber}</p>
                  </div>
                  <Badge variant={p.status === 'PAID' ? 'success' : 'warning'} className="text-[10px]">
                    {p.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
