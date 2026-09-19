import { z } from 'zod';

// ==========================================
// 1. Roles & Permissions (Mock Demonstration)
// ==========================================

export type DemoRole = 'ADMINISTRATOR' | 'RECEPTIONIST' | 'THERAPIST' | 'PARENT';

export type StaffRole = 'ADMIN' | 'RECEPTIONIST' | 'THERAPIST' | 'SPECIALIST' | 'DOCTOR';

export type StaffSpecialty =
  | 'SPEECH_THERAPY'           // تخاطب ونطق
  | 'SKILLS_DEVELOPMENT'        // تنمية مهارات
  | 'BEHAVIOR_MODIFICATION'     // تعديل سلوك
  | 'OCCUPATIONAL_THERAPY'      // علاج وظيفي
  | 'PSYCHOLOGY'                // إرشاد نفسي
  | 'PHONETICS'                 // أمراض صوت
  | 'ADMINISTRATION';           // إدارة واستقبال

// ==========================================
// 2. Domain Models & Zod Schemas
// ==========================================

// Parent / Guardian
export const ParentSchema = z.object({
  id: z.string(),
  nameAr: z.string().min(2, 'الاسم بالعربية مطلوب'),
  nameEn: z.string().min(2, 'English name is required'),
  relationship: z.enum(['FATHER', 'MOTHER', 'GUARDIAN', 'OTHER']),
  phone: z.string().min(10, 'رقم الهاتف يجب ألا يقل عن 10 أرقام'),
  secondaryPhone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  nationalId: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
});

export type Parent = z.infer<typeof ParentSchema>;

// Child
export const ChildSchema = z.object({
  id: z.string(),
  nameAr: z.string().min(2, 'الاسم بالعربية مطلوب'),
  nameEn: z.string().min(2, 'English name is required'),
  birthDate: z.string(),
  gender: z.enum(['MALE', 'FEMALE']),
  parentId: z.string().min(1, 'ولي الأمر مطلوب'),
  assignedStaffIds: z.array(z.string()).default([]),
  diagnosisSummary: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ASSESSMENT', 'GRADUATED']).default('ACTIVE'),
  emergencyContact: z.string().optional(),
  createdAt: z.string(),
});

export type Child = z.infer<typeof ChildSchema>;

// Staff / Specialist
export const StaffSchema = z.object({
  id: z.string(),
  nameAr: z.string().min(2, 'الاسم بالعربية مطلوب'),
  nameEn: z.string().min(2, 'English name is required'),
  role: z.enum(['ADMIN', 'RECEPTIONIST', 'THERAPIST', 'SPECIALIST', 'DOCTOR']),
  specialty: z.enum([
    'SPEECH_THERAPY',
    'SKILLS_DEVELOPMENT',
    'BEHAVIOR_MODIFICATION',
    'OCCUPATIONAL_THERAPY',
    'PSYCHOLOGY',
    'PHONETICS',
    'ADMINISTRATION',
  ]),
  phone: z.string().min(10),
  email: z.string().email(),
  active: z.boolean().default(true),
  color: z.string().default('#0d9488'), // For calendar visualization
  joinedDate: z.string(),
});

export type Staff = z.infer<typeof StaffSchema>;

// Appointment (Flexible: supports 1:1, 1:N, N:1, N:M)
export const AppointmentSchema = z.object({
  id: z.string(),
  childIds: z.array(z.string()).min(1, 'يجب تحديد طفل واحد على الأقل'),
  staffIds: z.array(z.string()).min(1, 'يجب تحديد أخصائي واحد على الأقل'),
  date: z.string(), // YYYY-MM-DD
  startTime: z.string(), // HH:mm
  endTime: z.string(), // HH:mm
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'RESCHEDULED', 'COMPLETED', 'NO_SHOW']).default('SCHEDULED'),
  sessionStatus: z.enum(['SCHEDULED', 'COMPLETED', 'NOT_CONDUCTED', 'CANCELLED']).default('SCHEDULED'),
  attendanceStatus: z.enum(['PENDING', 'PRESENT', 'ABSENT', 'NO_SHOW', 'LATE', 'EXCUSED']).default('PENDING'),
  paymentStatus: z.enum(['PAID', 'PARTIAL', 'UNPAID']).default('UNPAID'),
  amount: z.number().default(350),
  sessionType: z.enum(['INDIVIDUAL', 'GROUP', 'EVALUATION', 'CONSULTATION']).default('INDIVIDUAL'),
  room: z.string().optional(),
  notes: z.string().optional(),
  hasConflict: z.boolean().optional(), // Flagged conflict, not blocked
  createdAt: z.string(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

// Attendance (Conceptually separate from the appointment)
export const AttendanceSchema = z.object({
  id: z.string(),
  appointmentId: z.string(),
  participantId: z.string(), // childId or staffId
  participantType: z.enum(['CHILD', 'STAFF']),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']).default('PRESENT'),
  arrivalTime: z.string().optional(),
  notes: z.string().optional(),
  recordedAt: z.string(),
});

export type Attendance = z.infer<typeof AttendanceSchema>;

// Payment
export const PaymentSchema = z.object({
  id: z.string(),
  childId: z.string(),
  parentId: z.string(),
  appointmentId: z.string().optional(),
  amount: z.number().min(0),
  paidAmount: z.number().min(0),
  date: z.string(),
  paymentMethod: z.enum(['CASH', 'CARD', 'INSTAPAY', 'FAWRY', 'BANK_TRANSFER']).default('CASH'),
  status: z.enum(['PAID', 'PARTIAL', 'UNPAID', 'REFUNDED']).default('PAID'),
  invoiceNumber: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
});

export type Payment = z.infer<typeof PaymentSchema>;

// Session History & Plain Notes
export const SessionSchema = z.object({
  id: z.string(),
  childId: z.string(),
  staffId: z.string(),
  appointmentId: z.string().optional(),
  date: z.string(),
  durationMinutes: z.number().default(45),
  sessionObjective: z.string(),
  notes: z.string(), // Plain text notes (no rich text or DOMPurify)
  progressAssessment: z.enum(['EXCELLENT', 'GOOD', 'AVERAGE', 'NEEDS_WORK']).default('GOOD'),
  homeRecommendations: z.string().optional(),
  createdAt: z.string(),
});

export type Session = z.infer<typeof SessionSchema>;

// ==========================================
// 3. Central Application Mock State
// ==========================================

export interface AppState {
  currentRole: DemoRole;
  currentUserId: string;
  children: Child[];
  parents: Parent[];
  staff: Staff[];
  appointments: Appointment[];
  attendance: Attendance[];
  payments: Payment[];
  sessions: Session[];
  isLoading: boolean;
}

export type AppAction =
  | { type: 'SET_ROLE'; payload: DemoRole }
  | { type: 'SET_USER_ID'; payload: string }
  | { type: 'SET_STATE'; payload: Partial<AppState> }
  | { type: 'ADD_CHILD'; payload: Child }
  | { type: 'UPDATE_CHILD'; payload: Child }
  | { type: 'DELETE_CHILD'; payload: string }
  | { type: 'ADD_PARENT'; payload: Parent }
  | { type: 'UPDATE_PARENT'; payload: Parent }
  | { type: 'DELETE_PARENT'; payload: string }
  | { type: 'ADD_STAFF'; payload: Staff }
  | { type: 'UPDATE_STAFF'; payload: Staff }
  | { type: 'DELETE_STAFF'; payload: string }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'RECORD_ATTENDANCE'; payload: Attendance }
  | { type: 'UPDATE_ATTENDANCE'; payload: Attendance }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment }
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'RESET_DEMO_DATA'; payload: AppState };
