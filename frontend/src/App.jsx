import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import HeroPage from './pages/public/HeroPage';
import VolunteerForm from './pages/public/VolunteerForm';
import NeighborForm from './pages/public/NeighborForm';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/dashboard/Dashboard';
import VolunteersPage from './pages/dashboard/VolunteersPage';
import VolunteerDetail from './pages/dashboard/VolunteerDetail';
import NeighborsPage from './pages/dashboard/NeighborsPage';
import NeighborDetail from './pages/dashboard/NeighborDetail';
import MatchesPage from './pages/dashboard/MatchesPage';
import StaffPage from './pages/dashboard/StaffPage';
import StaffDetail from './pages/dashboard/StaffDetail';

function ProtectedRoute({ children }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/staff/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/staff/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { checkAuth } = useAuthStore();
  useEffect(() => { checkAuth(); }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { fontFamily: 'DM Sans, sans-serif', borderRadius: '10px', fontSize: '14px' }
      }} />
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/volunteer" element={<VolunteerForm />} />
        <Route path="/neighbor" element={<NeighborForm />} />
        <Route path="/staff/login" element={<LoginPage />} />
        <Route path="/staff/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/volunteers" element={<ProtectedRoute><VolunteersPage /></ProtectedRoute>} />
        <Route path="/dashboard/volunteers/:id" element={<ProtectedRoute><VolunteerDetail /></ProtectedRoute>} />
        <Route path="/dashboard/neighbors" element={<ProtectedRoute><NeighborsPage /></ProtectedRoute>} />
        <Route path="/dashboard/neighbors/:id" element={<ProtectedRoute><NeighborDetail /></ProtectedRoute>} />
        <Route path="/dashboard/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
        <Route path="/dashboard/staff" element={<AdminRoute><StaffPage /></AdminRoute>} />
        <Route path="/dashboard/staff/:id" element={<AdminRoute><StaffDetail /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
