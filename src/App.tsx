import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { Home } from './pages/public/Home';
import { Login } from './pages/public/Login';
import { Donate } from './pages/public/Donate';
import { About } from './pages/public/About';
import { History } from './pages/public/History';
import { Committee as PublicCommittee } from './pages/public/Committee';
import { Events } from './pages/public/Events';
import { Gallery } from './pages/public/Gallery';
import { Contact } from './pages/public/Contact';

import { Dashboard } from './pages/admin/Dashboard';
import { Financials } from './pages/admin/Financials';
import { Donations } from './pages/admin/Donations';
import { Assets } from './pages/admin/Assets';
import { Committee } from './pages/admin/Committee';
import { Settings } from './pages/admin/Settings';
import { EventsAdmin } from './pages/admin/EventsAdmin';
import { GalleryAdmin } from './pages/admin/GalleryAdmin';
import { MessagesAdmin } from './pages/admin/MessagesAdmin';
import { UsersAdmin } from './pages/admin/UsersAdmin';
import { ReportsAdmin } from './pages/admin/ReportsAdmin';
import { VisibilitySettings } from './pages/admin/VisibilitySettings';

import { AuthProvider, useAuth } from './lib/api';
import { VisibilityProvider, useVisibility } from './lib/VisibilityContext';

// Protected Route Guard
function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F1E5] font-serif">
        <div className="w-16 h-16 animate-spin rounded-full border-4 border-[#9B2226] border-t-transparent mb-4"></div>
        <p className="text-[#3E2723] text-sm font-bold uppercase tracking-widest font-sans">Connecting to Mandir Server...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-[#F7F1E5] font-serif">
        <div className="w-16 h-16 bg-white rounded-full border border-red-200 flex items-center justify-center mb-6 text-3xl">⚠️</div>
        <h2 className="text-3xl font-bold italic text-red-800 mb-2">Access Restricted</h2>
        <p className="text-gray-600 max-w-md font-sans text-xs uppercase tracking-wider leading-relaxed">
          Your active login role ({user.role}) does not have permission to view this administrative board. Please contact the Super Administrator.
        </p>
      </div>
    );
  }

  return <Outlet />;
}

// Public Route Guard for Visibility Control
function PublicRouteGuard({ settingKey, children }: { settingKey: string; children: React.ReactNode }) {
  const { isSectionVisible, settings, loading } = useVisibility();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
        <div className="w-10 h-10 animate-spin rounded-full border-4 border-[#9B2226] border-t-transparent mb-4"></div>
        <p className="text-[#3E2723] text-xs uppercase tracking-widest font-sans font-bold">Verifying Mandir Grace...</p>
      </div>
    );
  }

  const setting = settings[settingKey];
  const isVisible = isSectionVisible(settingKey);

  if (!isVisible) {
    if (setting && setting.visibilityMode === 'disable_route_accessible') {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-[#FDFBF7] font-serif">
          <div className="w-16 h-16 bg-white rounded-full border border-[#CFB53B] flex items-center justify-center mb-6 text-3xl shadow-sm">📿</div>
          <h2 className="text-3xl font-bold italic text-[#9B2226] mb-2">Temporarily Offline</h2>
          <p className="text-gray-600 max-w-md font-sans text-xs uppercase tracking-wider leading-relaxed">
            This module has been temporarily offline by Mandir Administrators. Please verify with the office.
          </p>
        </div>
      );
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <VisibilityProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="about" element={<PublicRouteGuard settingKey="about_enabled"><About /></PublicRouteGuard>} />
              <Route path="history" element={<PublicRouteGuard settingKey="temple_history_enabled"><History /></PublicRouteGuard>} />
              <Route path="committee" element={<PublicRouteGuard settingKey="committee_enabled"><PublicCommittee /></PublicRouteGuard>} />
              <Route path="events" element={<PublicRouteGuard settingKey="events_enabled"><Events /></PublicRouteGuard>} />
              <Route path="donate" element={<PublicRouteGuard settingKey="donations_enabled"><Donate /></PublicRouteGuard>} />
              <Route path="gallery" element={<PublicRouteGuard settingKey="gallery_enabled"><Gallery /></PublicRouteGuard>} />
              <Route path="contact" element={<PublicRouteGuard settingKey="contact_enabled"><Contact /></PublicRouteGuard>} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="finances" element={<Financials />} />
                <Route path="donations" element={<Donations />} />
                <Route path="assets" element={<Assets />} />
                <Route path="committee" element={<Committee />} />
                <Route path="events" element={<EventsAdmin />} />
                <Route path="gallery" element={<GalleryAdmin />} />
                <Route path="messages" element={<MessagesAdmin />} />
                <Route path="users" element={<UsersAdmin />} />
                <Route path="reports" element={<ReportsAdmin />} />
                <Route path="settings" element={<Settings />} />
                <Route path="visibility" element={<VisibilitySettings />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </VisibilityProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
