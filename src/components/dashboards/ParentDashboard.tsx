import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import {
  Calendar,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Heart,
  FileText,
  UserCheck
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';

interface ParentDashboardProps {
  onOpenAppointmentModal?: (appointmentId: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ onOpenAppointmentModal }) => {
  const { t, i18n } = useTranslation();
  const { state } = useApp();
  const isRtl = i18n.language.startsWith('ar');

  // Active parent (defaults to Mohamed El-Shenawy parent-1)
  const currentParentId = state.currentUserId.startsWith('parent-') ? state.currentUserId : 'parent-1';
  const parent = state.parents.find((p) => p.id === currentParentId) || state.parents[0];

  // The parent's children ONLY
  const myChildren = state.children.filter((c) => c.parentId === parent.id);
  const myChildIds = myChildren.map((c) => c.id);

  // The parent's appointments ONLY
  const myAppointments = state.appointments.filter((a) =>
    a.childIds.some((id) => myChildIds.includes(id))
  );

  // Parent's payments ONLY
  const myPayments = state.payments.filter((p) => p.parentId === parent.id || myChildIds.includes(p.childId));
  const myPaidTotal = myPayments.reduce((acc, p) => acc + p.paidAmount, 0);
  const myInvoicedTotal = myPayments.reduce((acc, p) => acc + p.amount, 0);
  const myOutstanding = myInvoicedTotal - myPaidTotal;

  // Parent's sessions & home guidance notes
  const mySessions = state.sessions.filter((s) => myChildIds.includes(s.childId));
  const latestSession = mySessions[0];

  // Next upcoming appointment
  const nextAppointment = myAppointments.find((a) => a.sessionStatus !== 'COMPLETED') || myAppointments[0];
  const nextAptSpecialist = nextAppointment ? state.staff.find((s) => s.id === nextAppointment.staffIds[0]) : null;

  return (
    <div className="space-y-6">
      {/* Warm Parent Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold mb-1">
            <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
            <span>{t('dashboard.parentTitle')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            أهلاً بك، {isRtl ? parent.nameAr : parent.nameEn}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            متابعة مواعيد أطفالك، نتائج الجلسات، والتوصيات والتمارين المنزلية المقررة من الأخصائي.
          </p>
        </div>

        {/* Disabled / Future actions demonstrated */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group">
            <Button
              disabled
              variant="secondary"
              size="sm"
              className="bg-white/20 text-white/80 cursor-not-allowed border-none text-xs font-bold gap-1.5 opacity-80"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>طلب حجز موعد جديد</span>
            </Button>
            <div className="hidden group-hover:block absolute bottom-full mb-1 end-0 bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-lg whitespace-nowrap z-30">
              ميزة تحت الدراسة وسيتم تفعيلها في الإصدار القادم
            </div>
          </div>
        </div>
      </div>

      {/* Children Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Child Profile Card */}
        {myChildren.map((child) => (
          <Card key={child.id} className="p-5 border-teal-100 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-extrabold text-sm">
                  {child.nameAr.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {isRtl ? child.nameAr : child.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500">
                    تاريخ الميلاد: {child.birthDate}
                  </p>
                </div>
              </div>
              <Badge variant="success" className="text-xs">
                {child.status === 'ACTIVE' ? 'نشط في الخطة' : 'تحت التقييم'}
              </Badge>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">التشخيص الحالي: </span>
              <span>{child.diagnosisSummary || 'تأخر نمو لغوي ونطق'}</span>
            </div>
          </Card>
        ))}

        {/* Financial Summary */}
        <Card className="p-5 border-purple-100 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">حالة المصروفات والمدفوعات</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{myPaidTotal.toLocaleString()}</span>
            <span className="text-xs text-slate-500 font-bold">{t('common.currency')} مسدد</span>
          </div>
          <div className="mt-2 text-xs">
            {myOutstanding > 0 ? (
              <span className="text-amber-700 font-medium">متبقي للدفع: {myOutstanding.toLocaleString()} {t('common.currency')}</span>
            ) : (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                جميع الجلسات الحالية مسددة
              </span>
            )}
          </div>
        </Card>

        {/* Attendance Summary */}
        <Card className="p-5 border-cyan-100 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">سجل حضور الطفل</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-cyan-800">100%</span>
            <span className="text-xs text-cyan-600 font-medium">نسبة الالتزام بالجلسات</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            انتظام الحضور يعزز سرعة استجابة الطفل وتطوره
          </div>
        </Card>
      </div>

      {/* Next Appointment Card */}
      {nextAppointment && (
        <Card className="p-6 border-teal-200 bg-gradient-to-r from-teal-50/70 to-white shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex flex-col items-center justify-center font-bold shrink-0 shadow-md">
                <Calendar className="w-5 h-5 mb-0.5" />
                <span className="text-xs">{nextAppointment.startTime}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                    {t('dashboard.nextAppointment')}
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-white">
                    {nextAppointment.date}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-1.5">
                  جلسة تخاطب وتأهيل نطق
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                  <span>الأخصائي المعالج: <strong>{isRtl ? nextAptSpecialist?.nameAr : nextAptSpecialist?.nameEn}</strong></span>
                  <span>القاعة: <strong>{nextAppointment.room || 'عيادة 1'}</strong></span>
                  <Badge
                    variant={nextAppointment.attendanceStatus === 'PRESENT' ? 'success' : 'default'}
                    className="text-[10px]"
                  >
                    {nextAppointment.attendanceStatus === 'PRESENT' ? 'تم تسجيل الحضور' : 'موعد قادم'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Parent demo action buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenAppointmentModal && onOpenAppointmentModal(nextAppointment.id)}
                className="text-xs font-bold rounded-xl"
              >
                عرض تفاصيل الموعد
              </Button>

              <div className="relative group">
                <Button
                  disabled
                  size="sm"
                  variant="ghost"
                  className="text-xs text-slate-400 cursor-not-allowed rounded-xl"
                >
                  طلب تعديل الموعد
                </Button>
                <div className="hidden group-hover:block absolute bottom-full mb-1 end-0 bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-lg whitespace-nowrap z-30">
                  {t('common.comingSoon')}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Progress & Home Recommendations */}
      {latestSession && (
        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('dashboard.recentProgress')} والتوصيات المنزلية
              </h3>
            </div>
            <span className="text-xs text-slate-400">تاريخ آخر جلسة: {latestSession.date}</span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 block mb-1">الهدف الإكلينيكي للجلسة:</span>
              <p className="text-slate-600">{latestSession.sessionObjective}</p>
            </div>

            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100">
              <span className="font-bold text-teal-900 block mb-1">ملاحظات الأخصائي عن استجابة الطفل:</span>
              <p className="text-teal-800 leading-relaxed">{latestSession.notes}</p>
            </div>

            {latestSession.homeRecommendations && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  {t('dashboard.homeGuidance')} (شديد الأهمية):
                </span>
                <p className="text-amber-800 leading-relaxed font-medium">
                  {latestSession.homeRecommendations}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
