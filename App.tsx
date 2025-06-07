
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import PageContainer from './components/common/PageContainer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FanHomePage from './pages/FanHomePage';
import RequestShoutoutPage from './pages/RequestShoutoutPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRequestDetailsPage from './pages/AdminRequestDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/common/LoadingSpinner';
import { UserRole } from './types';
import { APP_NAME } from './constants';

const ProtectedRoute: React.FC<{ roles?: UserRole[] }> = ({ roles }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
         <LoadingSpinner message="Autenticando..." />
        </div>
      </PageContainer>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.includes(UserRole.ADMIN) && !isAdmin) {
     return <Navigate to="/home" replace />; // Fan trying to access admin route
  }
  
  if (roles && roles.includes(UserRole.FAN) && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />; // Admin trying to access fan route
  }

  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Fan Routes */}
            <Route element={<ProtectedRoute roles={[UserRole.FAN]} />}>
              <Route path="/home" element={<FanHomePage />} />
              <Route path="/my-requests" element={<UserProfilePage />} />
              <Route path="/request-shoutout" element={<RequestShoutoutPage />} />
              <Route path="/request-shoutout/:packageId" element={<RequestShoutoutPage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute roles={[UserRole.ADMIN]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/request/:id" element={<AdminRequestDetailsPage />} />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white text-center p-4">
          © {new Date().getFullYear()} {APP_NAME}. Todos los derechos reservados.
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
