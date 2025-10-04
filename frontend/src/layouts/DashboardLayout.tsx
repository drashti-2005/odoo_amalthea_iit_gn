import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'manager', 'employee'] },
  { path: '/expenses', label: 'My Expenses', icon: '💰', roles: ['employee', 'manager'] },
  { path: '/expenses/new', label: 'New Expense', icon: '➕', roles: ['employee', 'manager'] },
  { path: '/approvals', label: 'Approvals', icon: '✅', roles: ['manager', 'admin'] },
  { path: '/reports', label: 'Reports', icon: '📈', roles: ['admin', 'manager'] },
  { path: '/users', label: 'Users', icon: '👥', roles: ['admin'] },
  { path: '/rules', label: 'Approval Rules', icon: '⚙️', roles: ['admin'] },
  { path: '/categories', label: 'Categories', icon: '📂', roles: ['admin'] },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredNavigation = navigationItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center">
              <h1 className="text-xl font-bold text-gradient">ExpenseFlow</h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavigation.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.div
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActivePath(item.path)
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
              Sign Out
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div className="ml-4 lg:ml-0">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {filteredNavigation.find(item => isActivePath(item.path))?.label || 'Dashboard'}
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:block text-sm text-gray-600">
                  {user?.company?.name}
                </div>
                
                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9.09c0-3.09-2.42-5.59-5.41-5.59S4.18 6 4.18 9.09V12l-5 5h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
