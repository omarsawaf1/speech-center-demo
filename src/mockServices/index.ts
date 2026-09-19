import { useApp } from '@/state/AppContext';
import { Child, Parent, Staff, Appointment, Attendance, Payment, Session } from '@/types';

/**
 * Hook providing a clean, decoupled service interface for the UI.
 * All operations return Promises with instant resolution (no artificial CRUD lag),
 * mimicking real async API services for easy drop-in backend replacement later.
 */
export function useMockServices() {
  const {
    state,
    addChild,
    updateChild: updateChildState,
    deleteChild: deleteChildState,
    addParent,
    updateParent: updateParentState,
    deleteParent: deleteParentState,
    addStaff,
    updateStaff: updateStaffState,
    deleteStaff: deleteStaffState,
    addAppointment,
    updateAppointment: updateAppointmentState,
    deleteAppointment: deleteAppointmentState,
    recordAttendance: recordAttendanceState,
    updateAttendance: updateAttendanceState,
    addPayment,
    updatePayment: updatePaymentState,
    addSession,
    resetDemoData,
  } = useApp();

  // Child Service
  const childService = {
    getAll: async (): Promise<Child[]> => {
      return [...state.children];
    },
    getById: async (id: string): Promise<Child | undefined> => {
      return state.children.find((c) => c.id === id);
    },
    create: async (data: Omit<Child, 'id' | 'createdAt'>): Promise<Child> => {
      const newChild: Child = {
        ...data,
        id: `child-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      addChild(newChild);
      return newChild;
    },
    update: async (child: Child): Promise<Child> => {
      updateChildState(child);
      return child;
    },
    delete: async (id: string): Promise<boolean> => {
      deleteChildState(id);
      return true;
    },
  };

  // Parent Service
  const parentService = {
    getAll: async (): Promise<Parent[]> => {
      return [...state.parents];
    },
    getById: async (id: string): Promise<Parent | undefined> => {
      return state.parents.find((p) => p.id === id);
    },
    create: async (data: Omit<Parent, 'id' | 'createdAt'>): Promise<Parent> => {
      const newParent: Parent = {
        ...data,
        id: `parent-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      addParent(newParent);
      return newParent;
    },
    update: async (parent: Parent): Promise<Parent> => {
      updateParentState(parent);
      return parent;
    },
    delete: async (id: string): Promise<boolean> => {
      deleteParentState(id);
      return true;
    },
  };

  // Staff Service
  const staffService = {
    getAll: async (): Promise<Staff[]> => {
      return [...state.staff];
    },
    getById: async (id: string): Promise<Staff | undefined> => {
      return state.staff.find((s) => s.id === id);
    },
    create: async (data: Omit<Staff, 'id'>): Promise<Staff> => {
      const newStaff: Staff = {
        ...data,
        id: `staff-${Date.now()}`,
      };
      addStaff(newStaff);
      return newStaff;
    },
    update: async (staff: Staff): Promise<Staff> => {
      updateStaffState(staff);
      return staff;
    },
    delete: async (id: string): Promise<boolean> => {
      deleteStaffState(id);
      return true;
    },
  };

  // Appointment Service
  const appointmentService = {
    getAll: async (): Promise<Appointment[]> => {
      return [...state.appointments];
    },
    getById: async (id: string): Promise<Appointment | undefined> => {
      return state.appointments.find((a) => a.id === id);
    },
    getByDate: async (date: string): Promise<Appointment[]> => {
      return state.appointments.filter((a) => a.date === date);
    },
    create: async (data: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> => {
      const newApt: Appointment = {
        ...data,
        id: `apt-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      addAppointment(newApt);
      return newApt;
    },
    update: async (apt: Appointment): Promise<Appointment> => {
      updateAppointmentState(apt);
      return apt;
    },
    delete: async (id: string): Promise<boolean> => {
      deleteAppointmentState(id);
      return true;
    },
  };

  // Attendance Service
  const attendanceService = {
    getAll: async (): Promise<Attendance[]> => {
      return [...state.attendance];
    },
    getByAppointmentId: async (appointmentId: string): Promise<Attendance[]> => {
      return state.attendance.filter((att) => att.appointmentId === appointmentId);
    },
    record: async (data: Omit<Attendance, 'id' | 'recordedAt'>): Promise<Attendance> => {
      const newAtt: Attendance = {
        ...data,
        id: `att-${Date.now()}`,
        recordedAt: new Date().toISOString(),
      };
      recordAttendanceState(newAtt);
      return newAtt;
    },
    update: async (att: Attendance): Promise<Attendance> => {
      updateAttendanceState(att);
      return att;
    },
  };

  // Payment Service
  const paymentService = {
    getAll: async (): Promise<Payment[]> => {
      return [...state.payments];
    },
    getByChildId: async (childId: string): Promise<Payment[]> => {
      return state.payments.filter((p) => p.childId === childId);
    },
    create: async (data: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> => {
      const newPayment: Payment = {
        ...data,
        id: `pay-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      addPayment(newPayment);
      return newPayment;
    },
    update: async (payment: Payment): Promise<Payment> => {
      updatePaymentState(payment);
      return payment;
    },
  };

  // Session Service
  const sessionService = {
    getAll: async (): Promise<Session[]> => {
      return [...state.sessions];
    },
    getByChildId: async (childId: string): Promise<Session[]> => {
      return state.sessions.filter((s) => s.childId === childId);
    },
    create: async (data: Omit<Session, 'id' | 'createdAt'>): Promise<Session> => {
      const newSession: Session = {
        ...data,
        id: `sess-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      addSession(newSession);
      return newSession;
    },
  };

  return {
    childService,
    parentService,
    staffService,
    appointmentService,
    attendanceService,
    paymentService,
    sessionService,
    resetDemoData,
  };
}
