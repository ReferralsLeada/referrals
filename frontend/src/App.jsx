import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import VerificationSuccess from './pages/VerificationSuccess';
import VerificationPage from './pages/VerificationPage';
import AffiliateDashboard from './pages/Affiliate/Dashboard';
import AffiliateSignup from './pages/Affiliate/Signup';
import AffiliateLogin from './pages/Affiliate/Login';
import HomePage from './pages/HomePage';
function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<HomePage />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/verify/:userId/:token" element={<VerificationPage />} />
        <Route path="/admin/verification-success" element={<VerificationSuccess />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Affiliate routes */}
        <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
        <Route path="/affiliate/signup" element={<AffiliateSignup />} />
         <Route path="/affiliate/login" element={<AffiliateLogin />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;
