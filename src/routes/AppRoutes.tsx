import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { FieldVisitsPage } from '../pages/FieldVisitsPage';
import { AttendancePage } from '../pages/AttendancePage';
import { EmployeesPage } from '../pages/EmployeesPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/field-visits" element={<FieldVisitsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
