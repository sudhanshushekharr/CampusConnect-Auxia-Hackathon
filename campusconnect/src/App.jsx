import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventRegistrationProvider } from './components/EventRegistrationManager';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ClubLeaderDashboard from './pages/ClubLeaderDashboard';
import Unauthorized from './pages/Unauthorized';

// Component to handle role-based dashboard routing
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'club_leader':
      return <ClubLeaderDashboard />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />} 
        />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardRouter />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/club-leader"
          element={
            <ProtectedRoute allowedRoles={['club_leader']}>
              <Layout>
                <ClubLeaderDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Error Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Default Route */}
        <Route 
          path="/" 
          element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />
        
        {/* Catch all route */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <EventRegistrationProvider>
        <AppContent />
      </EventRegistrationProvider>
    </AuthProvider>
  );
}

export default App;