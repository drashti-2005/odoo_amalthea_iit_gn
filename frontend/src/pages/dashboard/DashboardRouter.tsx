import { useAuth } from '../../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { EmployeeDashboard } from './EmployeeDashboard';

export function DashboardRouter() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading user information...</p>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      // For now, managers use the admin dashboard, but you can create a separate ManagerDashboard later
      return <AdminDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    default:
      return (
        <div className="p-6 text-center">
          <p className="text-red-500">Invalid user role: {user.role}</p>
        </div>
      );
  }
}