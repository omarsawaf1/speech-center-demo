import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/state/AppContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PublicHomePage } from '@/pages/PublicHomePage';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ChildrenPage } from '@/pages/ChildrenPage';
import { ChildDetailPage } from '@/pages/ChildDetailPage';
import { ParentsPage, ParentDetailPage } from '@/pages/ParentsPage';
import { StaffPage, StaffDetailPage } from '@/pages/StaffPage';
import { AppointmentsPage } from '@/pages/AppointmentsPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { AttendancePage } from '@/pages/AttendancePage';
import { PaymentsPage } from '@/pages/PaymentsPage';
import { SessionsPage } from '@/pages/SessionsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* 1. PUBLIC WEBSITE ROUTES */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicHomePage />} />
            <Route path="/about" element={<PublicHomePage />} />
            <Route path="/services" element={<PublicHomePage />} />
            <Route path="/how-it-works" element={<PublicHomePage />} />
            <Route path="/team" element={<PublicHomePage />} />
            <Route path="/pricing" element={<PublicHomePage />} />
            <Route path="/faq" element={<PublicHomePage />} />
            <Route path="/contact" element={<PublicHomePage />} />
          </Route>

          {/* Standalone Authentication / Role Portal Screen */}
          <Route path="/login" element={<LoginPage />} />

          {/* 2. AUTHENTICATED INTERNAL CENTER SYSTEM */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/my-schedule" element={<CalendarPage />} />
            <Route path="/children" element={<ChildrenPage />} />
            <Route path="/my-cases" element={<ChildrenPage />} />
            <Route path="/my-children" element={<ChildrenPage />} />
            <Route path="/children/:id" element={<ChildDetailPage />} />
            <Route path="/parents" element={<ParentsPage />} />
            <Route path="/parents/:id" element={<ParentDetailPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/staff/:id" element={<StaffDetailPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/billing" element={<PaymentsPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
