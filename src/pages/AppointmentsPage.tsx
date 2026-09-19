import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import { Card, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { formatTime } from '@/lib/utils';
import { CalendarDays, AlertTriangle, Plus, Search } from 'lucide-react';
import { Button } from '@/components/Button';
import { AppointmentDetailsModal } from '@/components/AppointmentDetailsModal';

export const AppointmentsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { state } = useApp();
  const [filterDate, setFilterDate] = useState<string>('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const isRtl = i18n.language.startsWith('ar');
  const role = state.currentRole;

  // Scope appointments by role (e.g. Parent sees only own child)
  let scopedAppointments = [...state.appointments];
  if (role === 'PARENT') {
    const parentId = state.currentUserId.startsWith('parent-') ? state.currentUserId : 'parent-1';
    const myChildren = state.children.filter((c) => c.parentId === parentId).map((c) => c.id);
    scopedAppointments = state.appointments.filter((a) => a.childIds.some((id) => myChildren.includes(id)));
  } else if (role === 'THERAPIST') {
    const staffId = state.currentUserId.startsWith('staff-') ? state.currentUserId : 'staff-2';
    scopedAppointments = state.appointments.filter((a) => a.staffIds.includes(staffId));
  }

  const filteredAppointments = scopedAppointments.filter((apt) => {
    if (!filterDate) return true;
    return apt.date === filterDate;
  });

  const getChildName = (id: string) => {
    const c = state.children.find((ch) => ch.id === id);
    return isRtl ? c?.nameAr : c?.nameEn;
  };

  const getStaffName = (id: string) => {
    const s = state.staff.find((st) => st.id === id);
    return isRtl ? s?.nameAr : s?.nameEn;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>{t('nav.appointments')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {role === 'PARENT' ? 'جدول مواعيد وجلسات أطفالي' : 'إدارة جدول المواعيد والحجوزات'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            {isRtl
              ? 'جدولة المواعيد مع دعم الجلسات الفردية، الجماعية، وتقييم الاستشاريين المشترك.'
              : 'Flexible scheduling supporting 1:1, group sessions, and multi-staff assessments.'}
          </p>
        </div>

        {role !== 'PARENT' && role !== 'THERAPIST' && (
          <Button
            onClick={() => alert(isRtl ? 'حجز موعد تفصيلي متاح في العرض' : 'Booking modal')}
            variant="secondary"
            size="sm"
            className="bg-white/15 text-white hover:bg-white/25 border-white/20 text-xs font-bold gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t('appointments.newAppointment')}</span>
          </Button>
        )}
      </div>

      {/* Filter / Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-700 font-bold">
          <Search className="w-4 h-4 text-teal-600" />
          <span>{isRtl ? 'تصفية حسب التاريخ:' : 'Filter by date:'}</span>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="text-xs text-teal-700 hover:underline font-bold"
            >
              {isRtl ? 'إلغاء التصفية' : 'Clear filter'}
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-bold">
          {filteredAppointments.length} مواعيد
        </div>
      </div>

      {/* Appointments List */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 text-start">{t('appointments.date')} & {t('appointments.time')}</th>
                  <th className="py-3 px-4 text-start">{t('appointments.child')}</th>
                  <th className="py-3 px-4 text-start">{t('appointments.specialist')}</th>
                  <th className="py-3 px-4 text-start">{t('appointments.type')}</th>
                  <th className="py-3 px-4 text-start">{t('appointments.room')}</th>
                  <th className="py-3 px-4 text-start">{t('common.status')}</th>
                  <th className="py-3 px-4 text-end">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((apt) => (
                  <tr 
                    key={apt.id} 
                    onClick={() => setSelectedAppointmentId(apt.id)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      <div className="font-bold text-slate-900">{apt.date}</div>
                      <div className="text-[11px] text-slate-400">
                        {formatTime(apt.startTime, i18n.language)} - {formatTime(apt.endTime, i18n.language)}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {apt.childIds.map(getChildName).join(' + ')}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {apt.staffIds.map(getStaffName).join(' + ')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {apt.sessionType === 'GROUP' ? 'جماعي' : 'فردي'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {apt.room || 'عيادة 1'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant={apt.sessionStatus === 'COMPLETED' ? 'success' : 'default'}>
                          {apt.sessionStatus === 'COMPLETED' ? 'مكتملة' : 'مجدولة'}
                        </Badge>
                        {apt.hasConflict && (
                          <Badge variant="warning" className="gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>تداخل زمني</span>
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <button className="text-teal-700 hover:text-teal-900 font-bold hover:underline">
                        عرض ←
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointmentId={selectedAppointmentId}
        onClose={() => setSelectedAppointmentId(null)}
      />
    </div>
  );
};
