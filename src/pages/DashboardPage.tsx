import React, { useState } from 'react';
import { useApp } from '@/state/AppContext';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { ReceptionDashboard } from '@/components/dashboards/ReceptionDashboard';
import { TherapistDashboard } from '@/components/dashboards/TherapistDashboard';
import { ParentDashboard } from '@/components/dashboards/ParentDashboard';
import { AppointmentDetailsModal } from '@/components/AppointmentDetailsModal';

export const DashboardPage: React.FC = () => {
  const { state } = useApp();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Conditionally render genuinely different role dashboards */}
      {state.currentRole === 'ADMINISTRATOR' && (
        <AdminDashboard onOpenAppointmentModal={setSelectedAppointmentId} />
      )}

      {state.currentRole === 'RECEPTIONIST' && (
        <ReceptionDashboard onOpenAppointmentModal={setSelectedAppointmentId} />
      )}

      {state.currentRole === 'THERAPIST' && (
        <TherapistDashboard onOpenAppointmentModal={setSelectedAppointmentId} />
      )}

      {state.currentRole === 'PARENT' && (
        <ParentDashboard onOpenAppointmentModal={setSelectedAppointmentId} />
      )}

      {/* Shared Appointment Details Modal */}
      <AppointmentDetailsModal
        appointmentId={selectedAppointmentId}
        onClose={() => setSelectedAppointmentId(null)}
      />
    </div>
  );
};
