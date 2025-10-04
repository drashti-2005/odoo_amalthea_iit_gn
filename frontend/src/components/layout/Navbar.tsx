import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface NavbarProps {
  onMobileMenuToggle: () => void;
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

export function Navbar({ onMobileMenuToggle }: NavbarProps) {
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
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-4 h-16 items-center">
          {/* Logo Section - Cols 1-3 */}
          <div className="col-span-3 flex items-center">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-2"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/dashboard" className="text-xl font-bold text-gradient">
              ExpenseFlow
            </Link>
          </div>

          {/* Navigation Links - Cols 4-8 (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-6 items-center justify-center space-x-1">
            {filteredNavigation.slice(0, 4).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </span>
                {isActivePath(item.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User Section - Cols 9-12 */}
          <div className="col-span-9 lg:col-span-3 flex items-center justify-end space-x-4">
            {/* User Info */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">{user?.name}</span>
              <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
            </div>

            {/* User Avatar */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium cursor-pointer"
              >
                {user?.name?.charAt(0).toUpperCase()}
              </motion.div>
            </div>

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:inline-flex"
            >
              Logout
            </Button>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="sm:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Logout</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}