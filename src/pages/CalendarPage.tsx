import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import {
  Calendar as CalendarIcon,
  Filter,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  MapPin
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { AppointmentDetailsModal } from '@/components/AppointmentDetailsModal';

export const CalendarPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { state } = useApp();
  const isRtl = i18n.language.startsWith('ar');

  // Selected date (Defaults to today)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Month navigation state
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Staff filter state (defaults to current staff if Therapist)
  const isTherapist = state.currentRole === 'THERAPIST';
  const defaultStaffFilter = isTherapist
    ? state.currentUserId.startsWith('staff-') ? state.currentUserId : 'staff-2'
    : 'ALL';
  const [selectedStaffId, setSelectedStaffId] = useState<string>(defaultStaffFilter);

  // Modal state
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Month navigation helpers
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentMonth(now);
    setSelectedDate(todayStr);
  };

  // Generate days in current month view
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return {
      dayNum,
      dateStr,
    };
  });

  // Filter appointments by selected staff and date
  const appointmentsOnDate = state.appointments.filter((apt) => {
    const dateMatches = apt.date === selectedDate;
    if (!dateMatches) return false;

    // Filter by staff
    if (selectedStaffId !== 'ALL' && !apt.staffIds.includes(selectedStaffId)) {
      return false;
    }

    // Filter by role (if Parent, only show their children)
    if (state.currentRole === 'PARENT') {
      const parentId = state.currentUserId.startsWith('parent-') ? state.currentUserId : 'parent-1';
      const myChildrenIds = state.children.filter((c) => c.parentId === parentId).map((c) => c.id);
      return apt.childIds.some((id) => myChildrenIds.includes(id));
    }

    return true;
  });

  // Format date header
  const formatSelectedDateHeader = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Month name
  const monthName = currentMonth.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{t('calendar.title')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            الأجندة والتقويم التفاعلي
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            تجربة تقويم مرنة مستوحاة من تطبيقات الهواتف الذكية؛ اختر اليوم لاستعراض الأجندة التفصيلية والتنبيهات.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={jumpToToday}
            className="bg-white/15 text-white hover:bg-white/25 border-white/20 text-xs font-bold"
          >
            الانتقال لليوم الحالي
          </Button>
        </div>
      </div>

      {/* Staff Filter (Hidden or simplified for Parent & Therapist) */}
      {!isTherapist && state.currentRole !== 'PARENT' && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-teal-600" />
            <span>{t('calendar.filterStaff')}:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedStaffId('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStaffId === 'ALL'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('calendar.allStaff')}
            </button>

            {state.staff.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStaffId(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedStaffId === s.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: s.color }}
                ></span>
                <span>{isRtl ? s.nameAr : s.nameEn}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Two-Column Calendar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Desktop) / Top (Mobile): Compact Date Selector */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 border-slate-200 bg-white">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 capitalize">
                {monthName}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  aria-label="Previous Month"
                >
                  {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  aria-label="Next Month"
                >
                  {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
              <span>ح</span>
              <span>ن</span>
              <span>ث</span>
              <span>ر</span>
              <span>خ</span>
              <span>ج</span>
              <span>س</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Padding empty slots */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-10" />
              ))}

              {/* Days */}
              {daysArray.map(({ dayNum, dateStr }) => {
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === todayStr;

                // Check appointment counts on this date
                const dayApts = state.appointments.filter((a) => a.date === dateStr);
                const hasConflict = dayApts.some((a) => a.hasConflict);

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center relative transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-md scale-105 z-10'
                        : isToday
                        ? 'bg-teal-50 text-teal-800 border border-teal-300'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{dayNum}</span>

                    {/* Appointment dots indicator */}
                    {dayApts.length > 0 && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected
                              ? 'bg-white'
                              : hasConflict
                              ? 'bg-amber-500'
                              : 'bg-teal-500'
                          }`}
                        />
                        {dayApts.length > 1 && (
                          <span
                            className={`w-1 h-1 rounded-full ${
                              isSelected ? 'bg-white/80' : 'bg-cyan-400'
                            }`}
                          />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                جلسات مجدولة
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                تداخل زمني تجريبي
              </span>
            </div>
          </Card>
        </div>

        {/* Right Column (Desktop) / Bottom (Mobile): Scrollable Daily Agenda */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 border-slate-200 bg-white">
            {/* Selected Date Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                  الأجندة اليومية
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                  {formatSelectedDateHeader(selectedDate)}
                </h2>
              </div>
              <Badge variant="outline" className="self-start sm:self-auto text-xs font-bold">
                {appointmentsOnDate.length} مواعيد مسجلة
              </Badge>
            </div>

            {/* Agenda List */}
            {appointmentsOnDate.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-2">
                <CalendarIcon className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-medium">{t('calendar.noAppointments')}</p>
                <p className="text-xs text-slate-400">
                  اختر يوماً آخر من التقويم أو قم بحجز موعد جديد.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointmentsOnDate.map((apt) => {
                  const child = state.children.find((c) => c.id === apt.childIds[0]);
                  const staff = state.staff.find((s) => s.id === apt.staffIds[0]);
                  const isTherapistRole = state.currentRole === 'THERAPIST';

                  return (
                    <div
                      key={apt.id}
                      onClick={() => setSelectedAppointmentId(apt.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:border-teal-300 relative ${
                        apt.hasConflict
                          ? 'bg-amber-50/40 border-amber-200'
                          : 'bg-gradient-to-r from-white to-slate-50/60 border-slate-200'
                      }`}
                    >
                      {/* Conflict Indicator */}
                      {apt.hasConflict && (
                        <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg w-fit">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>⚠ تداخل زمني (مسموح به للعرض التجريبي)</span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Time & Session Info */}
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex flex-col items-center justify-center font-bold shrink-0 shadow-xs">
                            <Clock className="w-4 h-4 mb-0.5 text-teal-600" />
                            <span className="text-xs" dir="ltr">{apt.startTime}</span>
                            <span className="text-[10px] text-teal-600 font-normal" dir="ltr">{apt.endTime}</span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={apt.sessionType === 'GROUP' ? 'info' : 'default'}
                                className="text-[10px]"
                              >
                                {apt.sessionType === 'GROUP' ? 'جلسة جماعية' : 'تخاطب فردي'}
                              </Badge>
                              <Badge
                                variant={
                                  apt.attendanceStatus === 'PRESENT'
                                    ? 'success'
                                    : apt.attendanceStatus === 'ABSENT'
                                    ? 'danger'
                                    : 'warning'
                                }
                                className="text-[10px]"
                              >
                                {apt.attendanceStatus === 'PRESENT'
                                  ? 'حاضر بالمركز'
                                  : apt.attendanceStatus === 'ABSENT'
                                  ? 'غائب'
                                  : 'في الانتظار'}
                              </Badge>
                            </div>

                            <h3 className="text-base font-bold text-slate-900">
                              الطفل: {isRtl ? child?.nameAr : child?.nameEn || apt.childIds[0]}
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                {isRtl ? staff?.nameAr : staff?.nameEn}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {apt.room || 'عيادة 1'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status & Payment (Payment hidden for Therapist) */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                          {!isTherapistRole && (
                            <Badge
                              variant={
                                apt.paymentStatus === 'PAID'
                                  ? 'success'
                                  : apt.paymentStatus === 'PARTIAL'
                                  ? 'warning'
                                  : 'danger'
                              }
                              className="text-xs px-2.5 py-0.5"
                            >
                              {apt.paymentStatus === 'PAID' ? 'مسدد' : apt.paymentStatus === 'PARTIAL' ? 'جزئي' : 'غير مسدد'}
                            </Badge>
                          )}

                          <span className="text-xs text-teal-700 font-bold hover:underline">
                            عرض التفاصيل والإجراءات ←
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointmentId={selectedAppointmentId}
        onClose={() => setSelectedAppointmentId(null)}
      />
    </div>
  );
};
