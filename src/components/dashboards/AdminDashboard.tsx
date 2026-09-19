import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import {
  Users,
  Calendar,
  CreditCard,
  UserCheck,
  AlertTriangle,
  PlusCircle,
  FileBarChart2,
  Activity,
  UserPlus
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';

interface AdminDashboardProps {
  onOpenAppointmentModal?: (appointmentId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenAppointmentModal }) => {
  const { t, i18n } = useTranslation();
  const { state } = useApp();
  const navigate = useNavigate();
  const isRtl = i18n.language.startsWith('ar');

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = state.appointments.filter((a) => a.date === today);

  // Conflicts
  const conflictAppointments = todayAppointments.filter((a) => a.hasConflict);

  // Financial calculations
  const totalInvoiced = state.payments.reduce((acc, p) => acc + p.amount, 0);
  const totalCollected = state.payments.reduce((acc, p) => acc + p.paidAmount, 0);
  const outstandingBalance = totalInvoiced - totalCollected;

  // Active children
  const activeChildrenCount = state.children.filter((c) => c.status === 'ACTIVE').length;
  const assessmentChildrenCount = state.children.filter((c) => c.status === 'ASSESSMENT').length;

  // Attendance
  const presentCount = state.attendance.filter(
    (att) => att.participantType === 'CHILD' && att.status === 'PRESENT'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{t('dashboard.adminTitle')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t('dashboard.welcome', { name: 'د. خالد منصور' })}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            نظرة عامة على عمليات المركز، التدفق المالي، الحضور اليومي، وتنبيهات التداخل الزمني.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => navigate('/appointments')}
            variant="secondary"
            size="sm"
            className="bg-white/10 text-white hover:bg-white/20 border-white/20 text-xs font-bold gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>حجز موعد</span>
          </Button>

          <Button
            onClick={() => navigate('/children')}
            variant="secondary"
            size="sm"
            className="bg-white/10 text-white hover:bg-white/20 border-white/20 text-xs font-bold gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>تسجيل طفل</span>
          </Button>

          <Button
            onClick={() => navigate('/reports')}
            variant="secondary"
            size="sm"
            className="bg-teal-500 hover:bg-teal-400 text-white border-none text-xs font-bold gap-1.5 shadow-sm"
          >
            <FileBarChart2 className="w-4 h-4" />
            <span>التقارير</span>
          </Button>
        </div>
      </div>

      {/* Visual Conflict Alert Banner */}
      {conflictAppointments.length > 0 && (
        <div className="bg-amber-50 border-s-4 border-amber-500 p-4 rounded-xl shadow-xs flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                {t('dashboard.conflictAlert')}
              </h3>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                يوجد {conflictAppointments.length} موعد متداخل مع مواعيد أخرى اليوم في نفس العيادة أو لنفس الأخصائي. تم السماح به للاستعراض التجريبي لتحديد سياسة المركز النهائية.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/calendar')}
            className="shrink-0 text-xs font-bold border-amber-300 text-amber-800 hover:bg-amber-100"
          >
            عرض بالتقويم
          </Button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Children */}
        <Card className="p-5 border-teal-100 bg-gradient-to-br from-white to-teal-50/40 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('dashboard.totalChildren')}</span>
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{state.children.length}</span>
            <span className="text-xs text-teal-700 font-medium">({activeChildrenCount} نشط)</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>تحت التقييم: {assessmentChildrenCount}</span>
            <span className="text-teal-700 font-semibold cursor-pointer" onClick={() => navigate('/children')}>
              إدارة القائمة ←
            </span>
          </div>
        </Card>

        {/* Today's Appointments */}
        <Card className="p-5 border-cyan-100 bg-gradient-to-br from-white to-cyan-50/40 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('dashboard.todayAppointments')}</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{todayAppointments.length}</span>
            <span className="text-xs text-cyan-700 font-medium">جلسات مجدولة</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>مكتملة: {todayAppointments.filter((a) => a.sessionStatus === 'COMPLETED').length}</span>
            <span className="text-cyan-700 font-semibold cursor-pointer" onClick={() => navigate('/calendar')}>
              فتح التقويم ←
            </span>
          </div>
        </Card>

        {/* Present Children */}
        <Card className="p-5 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('dashboard.presentChildren')}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-800">{presentCount}</span>
            <span className="text-xs text-emerald-600 font-medium">أطفال حضروا</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>سجل الحضور الإداري</span>
            <span className="text-emerald-700 font-semibold cursor-pointer" onClick={() => navigate('/attendance')}>
              دفتر الحضور ←
            </span>
          </div>
        </Card>

        {/* Financial Overview */}
        <Card className="p-5 border-purple-100 bg-gradient-to-br from-white to-purple-50/40 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">المتحصلات والمديونيات</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-purple-900">{totalCollected.toLocaleString()}</span>
            <span className="text-xs text-slate-500 font-bold">{t('common.currency')}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span className="text-amber-700 font-medium">متبقي: {outstandingBalance.toLocaleString()} {t('common.currency')}</span>
            <span className="text-purple-700 font-semibold cursor-pointer" onClick={() => navigate('/payments')}>
              الخزينة ←
            </span>
          </div>
        </Card>
      </div>

      {/* Main Operations Grid: Today's Schedule & Center Staff */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Schedule Table */}
        <Card className="lg:col-span-8 p-5 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('dashboard.todaySchedule')}
              </h3>
              <p className="text-xs text-slate-500">
                استعراض جدول الجلسات الإكلينيكية لليوم الحالي
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/calendar')}
              className="text-xs font-semibold"
            >
              عرض التقويم الكامل
            </Button>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              لا توجد جلسات مسجلة لليوم.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-3 text-start">التوقيت</th>
                    <th className="pb-3 text-start">الطفل</th>
                    <th className="pb-3 text-start">الأخصائي</th>
                    <th className="pb-3 text-start">العيادة / القاعة</th>
                    <th className="pb-3 text-start">حالة الحضور</th>
                    <th className="pb-3 text-start">انعقاد الجلسة</th>
                    <th className="pb-3 text-end">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todayAppointments.map((apt) => {
                    const child = state.children.find((c) => c.id === apt.childIds[0]);
                    const staff = state.staff.find((s) => s.id === apt.staffIds[0]);
                    return (
                      <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 font-semibold text-slate-700">
                          {apt.startTime} - {apt.endTime}
                          {apt.hasConflict && (
                            <span className="ms-1.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                              تعارض
                            </span>
                          )}
                        </td>
                        <td className="py-3 font-bold text-slate-900">
                          {isRtl ? child?.nameAr : child?.nameEn || apt.childIds[0]}
                        </td>
                        <td className="py-3 text-slate-700">
                          {isRtl ? staff?.nameAr : staff?.nameEn || apt.staffIds[0]}
                        </td>
                        <td className="py-3 text-slate-500">
                          {apt.room || 'عيادة 1'}
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={
                              apt.attendanceStatus === 'PRESENT'
                                ? 'success'
                                : apt.attendanceStatus === 'ABSENT'
                                ? 'danger'
                                : 'default'
                            }
                            className="text-[10px]"
                          >
                            {apt.attendanceStatus === 'PRESENT' ? 'حاضر' : apt.attendanceStatus === 'ABSENT' ? 'غائب' : 'في الانتظار'}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={
                              apt.sessionStatus === 'COMPLETED'
                                ? 'success'
                                : apt.sessionStatus === 'CANCELLED'
                                ? 'danger'
                                : 'warning'
                            }
                            className="text-[10px]"
                          >
                            {apt.sessionStatus === 'COMPLETED' ? 'مكتملة' : apt.sessionStatus === 'CANCELLED' ? 'ملغاة' : 'مجدولة'}
                          </Badge>
                        </td>
                        <td className="py-3 text-end">
                          <button
                            onClick={() => onOpenAppointmentModal && onOpenAppointmentModal(apt.id)}
                            className="text-teal-700 hover:text-teal-900 font-semibold hover:underline"
                          >
                            تفاصيل
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Staff on Duty & Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Staff on Duty */}
          <Card className="p-5 border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>{t('dashboard.staffOnDuty')}</span>
              <span className="text-xs text-teal-700 font-normal cursor-pointer" onClick={() => navigate('/staff')}>
                عرض الكل ({state.staff.length})
              </span>
            </h3>
            <div className="space-y-3">
              {state.staff.slice(0, 4).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.nameAr.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {isRtl ? s.nameAr : s.nameEn}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {t('specialties.' + s.specialty)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={s.active ? 'success' : 'default'} className="text-[10px]">
                    {s.active ? 'مناوب' : 'إجازة'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent System Activity */}
          <Card className="p-5 border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>آخر النشاطات بالمركز</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
                <div>
                  <p className="font-semibold text-slate-800">تسجيل حضور الطفل يوسف الشناوي</p>
                  <span className="text-[10px] text-slate-400">اليوم 09:50 ص - الاستقبال</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                <div>
                  <p className="font-semibold text-slate-800">سداد دفعة نقدية 600 ج.م (مريم خليل)</p>
                  <span className="text-[10px] text-slate-400">اليوم 09:15 ص - الخزينة</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                <div>
                  <p className="font-semibold text-slate-800">تدوين ملاحظة إكلينيكية (أ. سارة أحمد)</p>
                  <span className="text-[10px] text-slate-400">أمس 11:00 ص - عيادة التخاطب 1</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
