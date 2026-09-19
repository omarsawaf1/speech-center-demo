import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { ClipboardCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Attendance } from '@/types';

export const AttendancePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { state, recordAttendance, updateAttendance, updateAppointment } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const isRtl = i18n.language.startsWith('ar');
  const canEditAttendance = state.currentRole === 'ADMINISTRATOR' || state.currentRole === 'RECEPTIONIST';

  // Appointments for the selected date
  const dayAppointments = state.appointments.filter((a) => a.date === selectedDate);

  const getChildName = (id: string) => {
    const c = state.children.find((ch) => ch.id === id);
    return isRtl ? c?.nameAr : c?.nameEn;
  };

  const getStaffName = (id: string) => {
    const s = state.staff.find((st) => st.id === id);
    return isRtl ? s?.nameAr : s?.nameEn;
  };

  const getAttendanceRecord = (appointmentId: string, participantId: string) => {
    return state.attendance.find(
      (att) => att.appointmentId === appointmentId && att.participantId === participantId
    );
  };

  const handleSetAttendance = (
    appointmentId: string,
    participantId: string,
    participantType: 'CHILD' | 'STAFF',
    status: 'PRESENT' | 'ABSENT' | 'LATE'
  ) => {
    if (!canEditAttendance) return;

    const existing = getAttendanceRecord(appointmentId, participantId);
    if (existing) {
      updateAttendance({
        ...existing,
        status,
        arrivalTime: status === 'PRESENT' || status === 'LATE' ? new Date().toLocaleTimeString() : undefined,
      });
    } else {
      const newRecord: Attendance = {
        id: `att-${Date.now()}-${participantId}`,
        appointmentId,
        participantId,
        participantType,
        status,
        arrivalTime: status === 'PRESENT' || status === 'LATE' ? new Date().toLocaleTimeString() : undefined,
        recordedAt: new Date().toISOString(),
      };
      recordAttendance(newRecord);
    }

    if (participantType === 'CHILD') {
      const apt = state.appointments.find((a) => a.id === appointmentId);
      if (apt) {
        updateAppointment({
          ...apt,
          attendanceStatus: status,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-brand-600" />
            <span>{t('nav.attendance')}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isRtl
              ? 'تسجيل حضور منفصل لكل من الأطفال والأخصائيين لكل موعد'
              : 'Decoupled attendance tracking for both children and specialists'}
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <Clock className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-semibold text-slate-700 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Appointments Attendance Cards */}
      <div className="space-y-4">
        {dayAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-slate-400 text-xs">
              {isRtl ? 'لا توجد مواعيد مسجلة في هذا اليوم' : 'No appointments scheduled for this date'}
            </CardContent>
          </Card>
        ) : (
          dayAppointments.map((apt) => (
            <Card key={apt.id}>
              <CardHeader className="bg-slate-50/70 py-3 px-5">
                <div className="flex flex-wrap items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded">
                      {apt.startTime} - {apt.endTime}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {apt.room || (isRtl ? 'العيادة الرئيسية' : 'Main Clinic')}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[11px]">
                    {apt.sessionType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {/* Children Attendance Row */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {t('attendance.childAttendance')}
                  </h4>
                  <div className="space-y-2">
                    {apt.childIds.map((childId) => {
                      const record = getAttendanceRecord(apt.id, childId);
                      const status = record?.status || 'UNMARKED';
                      return (
                        <div
                          key={childId}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 gap-2"
                        >
                          <div>
                            <p className="font-bold text-xs text-slate-800">
                              {getChildName(childId)}
                            </p>
                            {record?.arrivalTime && (
                              <p className="text-[10px] text-slate-400">
                                {isRtl ? 'وقت الحضور:' : 'Arrived at:'} {record.arrivalTime}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSetAttendance(apt.id, childId, 'CHILD', 'PRESENT')}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                                status === 'PRESENT'
                                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{t('attendance.present')}</span>
                            </button>
                            <button
                              onClick={() => handleSetAttendance(apt.id, childId, 'CHILD', 'ABSENT')}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                                status === 'ABSENT'
                                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-rose-50'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{t('attendance.absent')}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Staff Attendance Row */}
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {t('attendance.staffAttendance')}
                  </h4>
                  <div className="space-y-2">
                    {apt.staffIds.map((staffId) => {
                      const record = getAttendanceRecord(apt.id, staffId);
                      const status = record?.status || 'UNMARKED';
                      return (
                        <div
                          key={staffId}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 gap-2"
                        >
                          <div>
                            <p className="font-bold text-xs text-slate-800">
                              {getStaffName(staffId)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSetAttendance(apt.id, staffId, 'STAFF', 'PRESENT')}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                                status === 'PRESENT'
                                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{t('attendance.present')}</span>
                            </button>
                            <button
                              onClick={() => handleSetAttendance(apt.id, staffId, 'STAFF', 'ABSENT')}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                                status === 'ABSENT'
                                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-rose-50'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{t('attendance.absent')}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
