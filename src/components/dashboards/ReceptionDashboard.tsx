import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import {
  UserCheck,
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  Plus,
  Phone,
  User
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';

interface ReceptionDashboardProps {
  onOpenAppointmentModal?: (appointmentId: string) => void;
}

export const ReceptionDashboard: React.FC<ReceptionDashboardProps> = ({ onOpenAppointmentModal }) => {
  const { t, i18n } = useTranslation();
  const { state, updateAppointment, recordAttendance, addPayment } = useApp();
  const navigate = useNavigate();
  const isRtl = i18n.language.startsWith('ar');

  const [searchQuery, setSearchQuery] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = state.appointments.filter((a) => a.date === today);

  // Front desk counters
  const presentCount = todayAppointments.filter((a) => a.attendanceStatus === 'PRESENT').length;
  const pendingAttendanceCount = todayAppointments.filter((a) => a.attendanceStatus === 'PENDING').length;
  const pendingPaymentsCount = todayAppointments.filter((a) => a.paymentStatus !== 'PAID').length;

  // Filter today's queue by search query
  const filteredAppointments = todayAppointments.filter((apt) => {
    const child = state.children.find((c) => c.id === apt.childIds[0]);
    const staff = state.staff.find((s) => s.id === apt.staffIds[0]);
    const query = searchQuery.toLowerCase();
    return (
      (child?.nameAr && child.nameAr.toLowerCase().includes(query)) ||
      (child?.nameEn && child.nameEn.toLowerCase().includes(query)) ||
      (staff?.nameAr && staff.nameAr.toLowerCase().includes(query)) ||
      apt.startTime.includes(query)
    );
  });

  // Quick 1-click arrival / check-in action
  const handleQuickCheckin = (aptId: string, childId: string) => {
    const apt = state.appointments.find((a) => a.id === aptId);
    if (!apt) return;

    // Update appointment attendanceStatus
    updateAppointment({
      ...apt,
      attendanceStatus: 'PRESENT',
    });

    // Record attendance entry
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    recordAttendance({
      id: `att-${Date.now()}`,
      appointmentId: aptId,
      participantId: childId,
      participantType: 'CHILD',
      status: 'PRESENT',
      arrivalTime: timeStr,
      notes: 'تم تسجيل الوصول من مكتب الاستقبال',
      recordedAt: now.toISOString(),
    });

    setSuccessToast(`تم تسجيل وصول الطفل بنجاح وتحديث حالته إلى "حاضر بالمركز"`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Quick 1-click payment settlement
  const handleQuickPay = (aptId: string) => {
    const apt = state.appointments.find((a) => a.id === aptId);
    if (!apt) return;

    const child = state.children.find((c) => c.id === apt.childIds[0]);
    const parentId = child?.parentId || 'parent-1';

    updateAppointment({
      ...apt,
      paymentStatus: 'PAID',
    });

    addPayment({
      id: `pay-${Date.now()}`,
      childId: apt.childIds[0],
      parentId: parentId,
      appointmentId: apt.id,
      amount: apt.amount || 350,
      paidAmount: apt.amount || 350,
      date: today,
      paymentMethod: 'CASH',
      status: 'PAID',
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      notes: 'تحصيل نقدي في مكتب الاستقبال',
      createdAt: new Date().toISOString(),
    });

    setSuccessToast(`تم تسجيل سداد الجلسة (${apt.amount || 350} ج.م) بنجاح وإصدار إيصال`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-white/80 hover:text-white text-xs font-bold">
            إغلاق
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-cyan-800 via-teal-700 to-cyan-700 text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2 text-cyan-200 text-xs font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></span>
            <span>{t('dashboard.receptionTitle')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            مكتب الاستقبال وإدارة الدخول
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100 mt-1 max-w-xl">
            متابعة وصول الأطفال، تسجيل الحضور الفوري في غرفة الانتظار، وتحصيل المدفوعات.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/appointments')}
            variant="secondary"
            size="sm"
            className="bg-white/15 text-white hover:bg-white/25 border-white/20 text-xs font-bold gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>حجز موعد فوري</span>
          </Button>
          <Button
            onClick={() => navigate('/attendance')}
            variant="secondary"
            size="sm"
            className="bg-cyan-500 hover:bg-cyan-400 text-white border-none text-xs font-bold gap-1.5 shadow-sm"
          >
            <UserCheck className="w-4 h-4" />
            <span>دفتر الحضور اليومي</span>
          </Button>
        </div>
      </div>

      {/* Reception KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* In Center Now */}
        <Card className="p-5 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">حضروا للمركز اليوم</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-800">{presentCount}</span>
            <span className="text-xs text-emerald-600 font-medium">أطفال في صالة الانتظار/العيادات</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            تم تسجيل حضورهم الإداري
          </div>
        </Card>

        {/* Pending Arrival */}
        <Card className="p-5 border-amber-100 bg-gradient-to-br from-white to-amber-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">مواعيد في انتظار الوصول</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-800">{pendingAttendanceCount}</span>
            <span className="text-xs text-amber-600 font-medium">مواعيد لم يتم تسجيلها بعد</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            اضغط "تسجيل وصول" عند دخول الطفل
          </div>
        </Card>

        {/* Pending Payments */}
        <Card className="p-5 border-purple-100 bg-gradient-to-br from-white to-purple-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">مدفوعات اليوم المعلقة</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-900">{pendingPaymentsCount}</span>
            <span className="text-xs text-purple-700 font-medium">جلسات بحاجة للتحصيل</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            يمكن تسجيل السداد فوراً من الجدول أدناه
          </div>
        </Card>
      </div>

      {/* Front Desk Live Queue */}
      <Card className="p-6 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              قائمة مواعيد اليوم واستقبال الأطفال
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              إجراءات سريعة لتسجيل الحضور، التحصيل المالي، والاطلاع على المواعيد
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث باسم الطفل أو الأخصائي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
            />
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            لا توجد مواعيد مطابقة للبحث لليوم.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map((apt) => {
              const child = state.children.find((c) => c.id === apt.childIds[0]);
              const staff = state.staff.find((s) => s.id === apt.staffIds[0]);
              const parent = state.parents.find((p) => p.id === child?.parentId);
              const isPresent = apt.attendanceStatus === 'PRESENT';
              const isPaid = apt.paymentStatus === 'PAID';

              return (
                <div
                  key={apt.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isPresent
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-teal-200'
                  }`}
                >
                  {/* Child & Time Info */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
                      {apt.startTime}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {isRtl ? child?.nameAr : child?.nameEn}
                        </h4>
                        <Badge
                          variant={isPresent ? 'success' : 'warning'}
                          className="text-[10px]"
                        >
                          {isPresent ? 'حاضر بالمركز' : 'قيد الانتظار'}
                        </Badge>
                        {apt.hasConflict && (
                          <Badge variant="danger" className="text-[10px]">
                            تداخل موعد
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          الأخصائي: {isRtl ? staff?.nameAr : staff?.nameEn}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          ولي الأمر: {parent?.phone || 'غير مسجل'}
                        </span>
                        <span>
                          القاعة: {apt.room || 'عيادة 1'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status & Quick Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <Badge
                      variant={isPaid ? 'success' : apt.paymentStatus === 'PARTIAL' ? 'warning' : 'danger'}
                      className="text-xs px-2.5 py-1"
                    >
                      {isPaid ? 'مسدد بالكامل' : apt.paymentStatus === 'PARTIAL' ? 'مسدد جزئياً' : 'غير مسدد'}
                    </Badge>

                    {/* Quick checkin button */}
                    {!isPresent && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleQuickCheckin(apt.id, apt.childIds[0])}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1 rounded-xl"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تسجيل وصول</span>
                      </Button>
                    )}

                    {/* Quick Pay button */}
                    {!isPaid && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickPay(apt.id)}
                        className="border-purple-300 text-purple-800 hover:bg-purple-50 text-xs font-bold gap-1 rounded-xl"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                        <span>تحصيل ({apt.amount || 350} ج.م)</span>
                      </Button>
                    )}

                    {/* Details modal trigger */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenAppointmentModal && onOpenAppointmentModal(apt.id)}
                      className="text-xs text-slate-600 hover:text-slate-900 rounded-xl"
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
    </div>
  );
};
