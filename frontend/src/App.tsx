import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import { DashboardRouter } from './pages/dashboard/DashboardRouter';
import { ExpensesList } from './pages/expenses/ExpensesList';
import { UploadReceiptPage } from './pages/expenses/UploadReceiptPage';
import { UsersPage } from './pages/admin/UsersPage';
import './App.css'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

// Public Route Component (redirect to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : <>{children}</>;
}

// Main App Component
function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/reset-password/:token" 
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        } 
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardRouter />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Expense Routes */}
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ExpensesList />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/expenses/upload"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UploadReceiptPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/expenses/new"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardRouter />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Approval Routes */}
      <Route
        path="/approvals"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Pending Approvals</h1>
                <p className="text-gray-600 mt-2">Review and approve expenses</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UsersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/rules"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Approval Rules</h1>
                <p className="text-gray-600 mt-2">Configure approval workflows</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <p className="text-gray-600 mt-2">Manage expense categories</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Reports Route */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Reports</h1>
                <p className="text-gray-600 mt-2">View expense reports and analytics</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
