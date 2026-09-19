import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import {
  X,
  Calendar,
  User,
  Users,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Phone
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';

interface AppointmentDetailsModalProps {
  appointmentId: string | null;
  onClose: () => void;
}

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  appointmentId,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const { state, updateAppointment, recordAttendance, addPayment } = useApp();
  const navigate = useNavigate();
  const isRtl = i18n.language.startsWith('ar');

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!appointmentId) return null;

  const appointment = state.appointments.find((a) => a.id === appointmentId);
  if (!appointment) return null;

  const child = state.children.find((c) => c.id === appointment.childIds[0]);
  const parent = state.parents.find((p) => p.id === child?.parentId);
  const staff = state.staff.find((s) => s.id === appointment.staffIds[0]);

  const role = state.currentRole;
  const isTherapist = role === 'THERAPIST';
  const isParent = role === 'PARENT';
  const isReceptionist = role === 'RECEPTIONIST';
  const isAdmin = role === 'ADMINISTRATOR';

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Administrative check-in
  const handleCheckin = () => {
    updateAppointment({
      ...appointment,
      attendanceStatus: 'PRESENT',
    });
    recordAttendance({
      id: `att-${Date.now()}`,
      appointmentId: appointment.id,
      participantId: appointment.childIds[0],
      participantType: 'CHILD',
      status: 'PRESENT',
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      notes: 'تم تسجيل الوصول الإداري',
      recordedAt: new Date().toISOString(),
    });
    showFeedback('تم تسجيل حضور ووصول الطفل بنجاح');
  };

  // Administrative mark absent
  const handleMarkAbsent = () => {
    updateAppointment({
      ...appointment,
      attendanceStatus: 'ABSENT',
    });
    showFeedback('تم تسجيل غياب الطفل');
  };

  // Clinical completion
  const handleSessionComplete = () => {
    updateAppointment({
      ...appointment,
      sessionStatus: 'COMPLETED',
      status: 'COMPLETED',
    });
    showFeedback('تم تسجيل اكتمال الجلسة الإكلينيكية بنجاح');
  };

  // Clinical not conducted
  const handleSessionNotConducted = () => {
    updateAppointment({
      ...appointment,
      sessionStatus: 'NOT_CONDUCTED',
    });
    showFeedback('تم تسجيل عدم انعقاد الجلسة');
  };

  // Payment settlement
  const handleSettlePayment = () => {
    updateAppointment({
      ...appointment,
      paymentStatus: 'PAID',
    });
    addPayment({
      id: `pay-${Date.now()}`,
      childId: appointment.childIds[0],
      parentId: child?.parentId || 'parent-1',
      appointmentId: appointment.id,
      amount: appointment.amount || 350,
      paidAmount: appointment.amount || 350,
      date: appointment.date,
      paymentMethod: 'CASH',
      status: 'PAID',
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      notes: 'سداد كامل للجلسة',
      createdAt: new Date().toISOString(),
    });
    showFeedback(`تم تسجيل سداد المبلغ (${appointment.amount || 350} ج.م) بنجاح`);
  };

  // Cancel appointment
  const handleCancelAppointment = () => {
    updateAppointment({
      ...appointment,
      status: 'CANCELLED',
      sessionStatus: 'CANCELLED',
    });
    showFeedback('تم إلغاء الموعد');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {t('appointments.modalTitle')}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>{appointment.date}</span>
                <span>•</span>
                <span dir="ltr">{appointment.startTime} - {appointment.endTime}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message banner */}
        {feedbackMessage && (
          <div className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Scheduling Conflict Alert */}
          {appointment.hasConflict && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-xs">تنبيه تعارض زمني (قيد مراجعة السياسات):</span>
                <span className="text-[11px] text-amber-800">
                  يتداخل هذا الموعد مع جلسة أخرى في نفس التوقيت أو القاعة. تم السماح به للاستعراض التجريبي لاكتشاف متطلبات المركز.
                </span>
              </div>
            </div>
          )}

          {/* Status Ribbons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            {/* Booking Status */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">حالة الحجز</span>
              <Badge
                variant={
                  appointment.status === 'COMPLETED'
                    ? 'success'
                    : appointment.status === 'CANCELLED'
                    ? 'danger'
                    : 'default'
                }
                className="text-[10px]"
              >
                {appointment.status === 'COMPLETED' ? 'منتهي' : appointment.status === 'CANCELLED' ? 'ملغي' : 'مؤكد'}
              </Badge>
            </div>

            {/* Attendance Status (Administrative) */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">حضور الطفل الإداري</span>
              <Badge
                variant={
                  appointment.attendanceStatus === 'PRESENT'
                    ? 'success'
                    : appointment.attendanceStatus === 'ABSENT'
                    ? 'danger'
                    : 'warning'
                }
                className="text-[10px]"
              >
                {appointment.attendanceStatus === 'PRESENT' ? 'حاضر بالمركز' : appointment.attendanceStatus === 'ABSENT' ? 'غائب' : 'في الانتظار'}
              </Badge>
            </div>

            {/* Clinical Session Status */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">انعقاد الجلسة الإكلينيكية</span>
              <Badge
                variant={
                  appointment.sessionStatus === 'COMPLETED'
                    ? 'success'
                    : appointment.sessionStatus === 'NOT_CONDUCTED'
                    ? 'danger'
                    : 'warning'
                }
                className="text-[10px]"
              >
                {appointment.sessionStatus === 'COMPLETED' ? 'مكتملة بنجاح' : appointment.sessionStatus === 'NOT_CONDUCTED' ? 'لم تعقد' : 'مجدولة'}
              </Badge>
            </div>

            {/* Payment Status (Hidden completely for Therapist) */}
            {!isTherapist && (
              <div>
                <span className="text-[10px] text-slate-400 font-bold block mb-1">حالة السداد</span>
                <Badge
                  variant={
                    appointment.paymentStatus === 'PAID'
                      ? 'success'
                      : appointment.paymentStatus === 'PARTIAL'
                      ? 'warning'
                      : 'danger'
                  }
                  className="text-[10px]"
                >
                  {appointment.paymentStatus === 'PAID' ? 'مسدد' : appointment.paymentStatus === 'PARTIAL' ? 'جزئي' : 'غير مسدد'}
                </Badge>
              </div>
            )}
          </div>

          {/* Child & Parent Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-xs font-bold text-slate-400 block mb-2">بيانات الطفل</span>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {isRtl ? child?.nameAr : child?.nameEn || appointment.childIds[0]}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {child?.diagnosisSummary || 'تأخر لغوي ونطق'}
                  </p>
                </div>
                {!isParent && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      onClose();
                      navigate(`/children/${child?.id}`);
                    }}
                    className="text-xs text-teal-700 hover:text-teal-900"
                  >
                    الملف
                  </Button>
                )}
              </div>
            </div>

            {/* Specialist Details */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-xs font-bold text-slate-400 block mb-2">الأخصائي المعالج</span>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {isRtl ? staff?.nameAr : staff?.nameEn || appointment.staffIds[0]}
                </h4>
                <p className="text-xs text-teal-700 mt-0.5">
                  {t('specialties.' + staff?.specialty)}
                </p>
              </div>
            </div>
          </div>

          {/* Logistics & Parent Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>القاعة / العيادة: <strong>{appointment.room || 'عيادة التخاطب 1'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span>نوع الجلسة: <strong>{appointment.sessionType === 'GROUP' ? 'جلسة جماعية' : 'جلسة فردية 1:1'}</strong></span>
              </div>
            </div>

            {!isTherapist && parent && (
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>ولي الأمر: <strong>{isRtl ? parent.nameAr : parent.nameEn}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span dir="ltr">{parent.phone}</span>
                </div>
              </div>
            )}
          </div>

          {/* Clinical/Operational Notes */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-1">الملاحظات والهدف:</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {appointment.notes || 'تدريب على مخرج حرف الراء والتهيئة الصوتية وتوسيع المدى السمعي.'}
            </p>
          </div>

          {/* Financial details (Hidden for Therapist) */}
          {!isTherapist && (
            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">رسوم الجلسة المستحقة</span>
                <div className="text-lg font-extrabold text-teal-800">
                  {appointment.amount || 350} {t('common.currency')}
                </div>
              </div>
              <Badge
                variant={appointment.paymentStatus === 'PAID' ? 'success' : 'danger'}
                className="text-xs"
              >
                {appointment.paymentStatus === 'PAID' ? 'مسددة بالكامل' : 'مستحقة للدفع'}
              </Badge>
            </div>
          )}
        </div>

        {/* Modal Footer / Role-Specific Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            صلاحيات الدور المعروض: <strong className="text-slate-600">{t('roles.' + role)}</strong>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Receptionist Actions */}
            {isReceptionist && (
              <>
                {appointment.attendanceStatus !== 'PRESENT' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleCheckin}
                    className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold gap-1 rounded-xl"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تسجيل وصول</span>
                  </Button>
                )}

                {appointment.paymentStatus !== 'PAID' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSettlePayment}
                    className="border-purple-300 text-purple-800 hover:bg-purple-50 text-xs font-bold gap-1 rounded-xl"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                    <span>تحصيل ({appointment.amount || 350} ج.م)</span>
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelAppointment}
                  className="text-rose-600 hover:bg-rose-50 text-xs rounded-xl"
                >
                  إلغاء الموعد
                </Button>
              </>
            )}

            {/* Therapist Actions */}
            {isTherapist && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleSessionComplete}
                  className="bg-teal-600 hover:bg-teal-700 text-xs font-bold gap-1 rounded-xl"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تسجيل اكتمال الجلسة</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSessionNotConducted}
                  className="border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-bold rounded-xl"
                >
                  لم تعقد الجلسة
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    onClose();
                    navigate('/sessions');
                  }}
                  className="text-xs rounded-xl"
                >
                  تدوين الملاحظات
                </Button>
              </>
            )}

            {/* Admin Actions */}
            {isAdmin && (
              <>
                {appointment.attendanceStatus !== 'PRESENT' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCheckin}
                    className="text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 rounded-xl"
                  >
                    تسجيل حضور
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleMarkAbsent}
                    className="text-xs text-rose-700 border-rose-300 hover:bg-rose-50 rounded-xl"
                  >
                    تعديل إلى غائب
                  </Button>
                )}

                {appointment.paymentStatus !== 'PAID' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSettlePayment}
                    className="text-xs text-purple-700 border-purple-300 hover:bg-purple-50 rounded-xl"
                  >
                    تسجيل سداد
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelAppointment}
                  className="text-rose-600 hover:bg-rose-50 text-xs rounded-xl"
                >
                  إلغاء الموعد
                </Button>
              </>
            )}

            {/* Parent Actions (Disabled / Future) */}
            {isParent && (
              <div className="relative group">
                <Button
                  disabled
                  size="sm"
                  variant="outline"
                  className="text-xs text-slate-400 cursor-not-allowed rounded-xl"
                >
                  طلب إعادة جدولة (قريباً)
                </Button>
                <div className="hidden group-hover:block absolute bottom-full mb-1 end-0 bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-lg whitespace-nowrap z-30">
                  {t('common.comingSoon')}
                </div>
              </div>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              className="text-xs rounded-xl"
            >
              إغلاق
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
