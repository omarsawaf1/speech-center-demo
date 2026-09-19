import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import {
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';

interface TherapistDashboardProps {
  onOpenAppointmentModal?: (appointmentId: string) => void;
}

export const TherapistDashboard: React.FC<TherapistDashboardProps> = ({ onOpenAppointmentModal }) => {
  const { t, i18n } = useTranslation();
  const { state, updateAppointment } = useApp();
  const navigate = useNavigate();
  const isRtl = i18n.language.startsWith('ar');

  // Identify therapist user (defaults to Sara Ahmed staff-2)
  const currentStaffId = state.currentUserId.startsWith('staff-') ? state.currentUserId : 'staff-2';
  const therapist = state.staff.find((s) => s.id === currentStaffId) || state.staff[1];

  const today = new Date().toISOString().split('T')[0];

  // Appointments for this therapist today
  const myTodayAppointments = state.appointments.filter(
    (a) => a.date === today && a.staffIds.includes(therapist.id)
  );

  // My assigned children
  const myChildren = state.children.filter((c) =>
    c.assignedStaffIds.includes(therapist.id)
  );

  // Sessions completed vs pending notes
  const completedToday = myTodayAppointments.filter((a) => a.sessionStatus === 'COMPLETED').length;
  const pendingNotesCount = myTodayAppointments.filter((a) => a.sessionStatus !== 'COMPLETED').length;

  // Next upcoming session
  const nextSession = myTodayAppointments.find((a) => a.sessionStatus !== 'COMPLETED') || myTodayAppointments[0];
  const nextChild = nextSession ? state.children.find((c) => c.id === nextSession.childIds[0]) : null;

  // Clinical outcome update (completed or not conducted)
  const handleMarkSessionComplete = (aptId: string) => {
    const apt = state.appointments.find((a) => a.id === aptId);
    if (!apt) return;
    updateAppointment({
      ...apt,
      sessionStatus: 'COMPLETED',
      status: 'COMPLETED',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{t('dashboard.therapistTitle')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t('dashboard.welcome', { name: isRtl ? therapist.nameAr : therapist.nameEn })}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            الجدول الإكلينيكي لجلسات اليوم، متابعة حضور الأطفال، وتدوين الملاحظات النمائية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/sessions')}
            variant="secondary"
            size="sm"
            className="bg-white/15 text-white hover:bg-white/25 border-white/20 text-xs font-bold gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>تدوين جلسة جديدة</span>
          </Button>
          <Button
            onClick={() => navigate('/calendar')}
            variant="secondary"
            size="sm"
            className="bg-teal-500 hover:bg-teal-400 text-white border-none text-xs font-bold gap-1.5 shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>جدولي بالتقويم</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards (Zero Financial metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sessions */}
        <Card className="p-5 border-teal-100 bg-gradient-to-br from-white to-teal-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">جلساتي اليوم</span>
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{myTodayAppointments.length}</span>
            <span className="text-xs text-teal-700 font-medium">جلسات مقررة</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            موزعة على مدار اليوم
          </div>
        </Card>

        {/* Completed */}
        <Card className="p-5 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">جلسات تم إنجازها</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-800">{completedToday}</span>
            <span className="text-xs text-emerald-600 font-medium">جلسات منتهية بنجاح</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            تم تسجيل استجابة الأطفال
          </div>
        </Card>

        {/* Pending Notes */}
        <Card className="p-5 border-amber-100 bg-gradient-to-br from-white to-amber-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">ملاحظات قيد التدوين</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-800">{pendingNotesCount}</span>
            <span className="text-xs text-amber-600 font-medium">جلسات اليوم</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            بحاجة لاستكمال تقرير المتابعة
          </div>
        </Card>

        {/* My Assigned Children */}
        <Card className="p-5 border-purple-100 bg-gradient-to-br from-white to-purple-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">حالاتي المسندة</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-900">{myChildren.length}</span>
            <span className="text-xs text-purple-700 font-medium">أطفال في خطتي</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            يتابعون خطط تأهيلية مستمرة
          </div>
        </Card>
      </div>

      {/* Next Upcoming Session Highlight Card */}
      {nextSession && nextChild && (
        <Card className="p-6 border-teal-200 bg-gradient-to-r from-teal-50/60 to-cyan-50/40 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex flex-col items-center justify-center font-bold shrink-0 shadow-md">
                <Clock className="w-5 h-5 mb-0.5" />
                <span className="text-xs">{nextSession.startTime}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                    الجلسة القادمة مباشرة
                  </span>
                  <Badge
                    variant={nextSession.attendanceStatus === 'PRESENT' ? 'success' : 'warning'}
                    className="text-[10px]"
                  >
                    حالة الوصول: {nextSession.attendanceStatus === 'PRESENT' ? 'الطفل متواجد بالمركز' : 'في الانتظار'}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  الطفل: {isRtl ? nextChild.nameAr : nextChild.nameEn}
                </h3>

                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  {nextSession.notes || nextChild.diagnosisSummary || 'الهدف: تدريب على مخارج الحروف والتهيئة الصوتية'}
                </p>
                <div className="text-[11px] text-slate-500 mt-1">
                  القاعة: {nextSession.room || 'عيادة التخاطب 1'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/sessions')}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>تدوين الملاحظات الإكلينيكية</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkSessionComplete(nextSession.id)}
                className="border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>اكتمال الجلسة</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenAppointmentModal && onOpenAppointmentModal(nextSession.id)}
                className="text-xs text-slate-600 rounded-xl"
              >
                تفاصيل الموعد
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Main Grid: Clinical Schedule List & My Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Clinical Schedule */}
        <Card className="lg:col-span-8 p-5 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                جدولي الإكلينيكي لليوم ({today})
              </h3>
              <p className="text-xs text-slate-500">
                جلسات التخاطب والتأهيل المسندة إليّ اليوم وحالة الحضور
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/calendar')}
              className="text-xs font-bold"
            >
              عرض التقويم
            </Button>
          </div>

          {myTodayAppointments.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              لا توجد جلسات مسجلة لك اليوم.
            </div>
          ) : (
            <div className="space-y-3">
              {myTodayAppointments.map((apt) => {
                const child = state.children.find((c) => c.id === apt.childIds[0]);
                const isCompleted = apt.sessionStatus === 'COMPLETED';
                const isChildPresent = apt.attendanceStatus === 'PRESENT';

                return (
                  <div
                    key={apt.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-white border-slate-200 hover:border-teal-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {apt.startTime}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">
                            {isRtl ? child?.nameAr : child?.nameEn}
                          </h4>
                          <Badge
                            variant={isChildPresent ? 'success' : 'default'}
                            className="text-[10px]"
                          >
                            {isChildPresent ? 'حضر للاستقبال' : 'في الانتظار'}
                          </Badge>
                          {apt.hasConflict && (
                            <Badge variant="danger" className="text-[10px]">
                              تداخل زمني
                            </Badge>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 mt-1">
                          {apt.notes || child?.diagnosisSummary || 'جلسة فردية منتظمة'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <Badge
                        variant={isCompleted ? 'success' : 'warning'}
                        className="text-xs"
                      >
                        {isCompleted ? 'مكتملة' : 'مجدولة'}
                      </Badge>

                      {!isCompleted && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkSessionComplete(apt.id)}
                          className="text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 rounded-xl"
                        >
                          إنهاء الجلسة
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenAppointmentModal && onOpenAppointmentModal(apt.id)}
                        className="text-xs text-slate-600 rounded-xl"
                      >
                        تفاصيل
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Assigned Children / Cases List */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>حالاتي المسندة</span>
              <span
                className="text-xs text-teal-700 font-normal cursor-pointer"
                onClick={() => navigate('/children')}
              >
                عرض الكل ({myChildren.length})
              </span>
            </h3>

            <div className="space-y-3">
              {myChildren.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => navigate(`/children/${ch.id}`)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50/60 border border-slate-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      {isRtl ? ch.nameAr : ch.nameEn}
                    </h4>
                    <Badge variant="outline" className="text-[10px]">
                      {ch.status === 'ACTIVE' ? 'نشط' : 'تقييم'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {ch.diagnosisSummary || 'تأخر لغوي نمائي'}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
