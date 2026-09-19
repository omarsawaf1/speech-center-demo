import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppAction, DemoRole, Child, Parent, Staff, Appointment, Attendance, Payment, Session } from '@/types';
import { initialAppState } from '@/mockDatabase/initialData';

const STORAGE_KEY = 'speech_center_mock_state_v1';

// Reducer implementation
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, currentRole: action.payload };

    case 'SET_USER_ID':
      return { ...state, currentUserId: action.payload };

    case 'SET_STATE':
      return { ...state, ...action.payload };

    case 'ADD_CHILD':
      return { ...state, children: [action.payload, ...state.children] };

    case 'UPDATE_CHILD':
      return {
        ...state,
        children: state.children.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };

    case 'DELETE_CHILD':
      return {
        ...state,
        children: state.children.filter((c) => c.id !== action.payload),
      };

    case 'ADD_PARENT':
      return { ...state, parents: [action.payload, ...state.parents] };

    case 'UPDATE_PARENT':
      return {
        ...state,
        parents: state.parents.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };

    case 'DELETE_PARENT':
      return {
        ...state,
        parents: state.parents.filter((p) => p.id !== action.payload),
      };

    case 'ADD_STAFF':
      return { ...state, staff: [action.payload, ...state.staff] };

    case 'UPDATE_STAFF':
      return {
        ...state,
        staff: state.staff.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };

    case 'DELETE_STAFF':
      return {
        ...state,
        staff: state.staff.filter((s) => s.id !== action.payload),
      };

    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [action.payload, ...state.appointments] };

    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map((a) => (a.id === action.payload.id ? action.payload : a)),
      };

    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter((a) => a.id !== action.payload),
      };

    case 'RECORD_ATTENDANCE':
      return { ...state, attendance: [action.payload, ...state.attendance] };

    case 'UPDATE_ATTENDANCE':
      return {
        ...state,
        attendance: state.attendance.map((att) => (att.id === action.payload.id ? action.payload : att)),
      };

    case 'ADD_PAYMENT':
      return { ...state, payments: [action.payload, ...state.payments] };

    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };

    case 'ADD_SESSION':
      return { ...state, sessions: [action.payload, ...state.sessions] };

    case 'RESET_DEMO_DATA':
      return action.payload;

    default:
      return state;
  }
}

// Initial state loader from localStorage
function getInitialState(): AppState {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState) {
      const parsed = JSON.parse(serializedState);
      return {
        ...initialAppState,
        ...parsed,
        isLoading: false,
      };
    }
  } catch (err) {
    console.warn('Could not parse localStorage mock state, falling back to initial data', err);
  }
  return initialAppState;
}

// Context definition
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  resetDemoData: () => void;
  setRole: (role: DemoRole) => void;
  // Direct instant actions helpers
  addChild: (child: Child) => void;
  updateChild: (child: Child) => void;
  deleteChild: (id: string) => void;
  addParent: (parent: Parent) => void;
  updateParent: (parent: Parent) => void;
  deleteParent: (id: string) => void;
  addStaff: (staff: Staff) => void;
  updateStaff: (staff: Staff) => void;
  deleteStaff: (id: string) => void;
  addAppointment: (apt: Appointment) => void;
  updateAppointment: (apt: Appointment) => void;
  deleteAppointment: (id: string) => void;
  recordAttendance: (att: Attendance) => void;
  updateAttendance: (att: Attendance) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (payment: Payment) => void;
  addSession: (session: Session) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  // Sync to localStorage on every state change immediately (except isLoading)
  useEffect(() => {
    try {
      const { isLoading: _, ...stateToPersist } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (err) {
      console.error('Failed to persist mock state to localStorage:', err);
    }
  }, [state]);

  const resetDemoData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAppState));
    } catch (err) {
      console.error('Failed to reset demo data in localStorage:', err);
    }
    dispatch({ type: 'RESET_DEMO_DATA', payload: { ...initialAppState } });
  };

  const setRole = (role: DemoRole) => {
    // Optionally switch default mock user ID when role changes
    let currentUserId = state.currentUserId;
    if (role === 'ADMINISTRATOR') currentUserId = 'staff-1';
    else if (role === 'THERAPIST') currentUserId = 'staff-2';
    else if (role === 'RECEPTIONIST') currentUserId = 'staff-5';
    else if (role === 'PARENT') currentUserId = 'parent-1';

    dispatch({ type: 'SET_ROLE', payload: role });
    dispatch({ type: 'SET_USER_ID', payload: currentUserId });
  };

  const value: AppContextType = {
    state,
    dispatch,
    resetDemoData,
    setRole,
    addChild: (child) => dispatch({ type: 'ADD_CHILD', payload: child }),
    updateChild: (child) => dispatch({ type: 'UPDATE_CHILD', payload: child }),
    deleteChild: (id) => dispatch({ type: 'DELETE_CHILD', payload: id }),
    addParent: (parent) => dispatch({ type: 'ADD_PARENT', payload: parent }),
    updateParent: (parent) => dispatch({ type: 'UPDATE_PARENT', payload: parent }),
    deleteParent: (id) => dispatch({ type: 'DELETE_PARENT', payload: id }),
    addStaff: (staff) => dispatch({ type: 'ADD_STAFF', payload: staff }),
    updateStaff: (staff) => dispatch({ type: 'UPDATE_STAFF', payload: staff }),
    deleteStaff: (id) => dispatch({ type: 'DELETE_STAFF', payload: id }),
    addAppointment: (apt) => dispatch({ type: 'ADD_APPOINTMENT', payload: apt }),
    updateAppointment: (apt) => dispatch({ type: 'UPDATE_APPOINTMENT', payload: apt }),
    deleteAppointment: (id) => dispatch({ type: 'DELETE_APPOINTMENT', payload: id }),
    recordAttendance: (att) => dispatch({ type: 'RECORD_ATTENDANCE', payload: att }),
    updateAttendance: (att) => dispatch({ type: 'UPDATE_ATTENDANCE', payload: att }),
    addPayment: (payment) => dispatch({ type: 'ADD_PAYMENT', payload: payment }),
    updatePayment: (payment) => dispatch({ type: 'UPDATE_PAYMENT', payload: payment }),
    addSession: (session) => dispatch({ type: 'ADD_SESSION', payload: session }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
