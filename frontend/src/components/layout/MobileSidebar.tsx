import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
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

const sidebarVariants = {
  closed: {
    x: '-100%',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    }
  },
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    }
  }
};

const overlayVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.2,
    }
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.2,
    }
  }
};

const menuItemVariants = {
  closed: {
    x: -20,
    opacity: 0,
  },
  open: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    }
  })
};

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const filteredNavigation = navigationItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="text-xl font-bold text-gradient">
                  ExpenseFlow
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* User Info */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                    <div className="text-xs text-gray-400">{user?.company?.name}</div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {filteredNavigation.map((item, index) => (
                  <motion.div
                    key={item.path}
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                    custom={index}
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath(item.path)
                          ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                      {isActivePath(item.path) && (
                        <motion.div
                          layoutId="mobile-nav-indicator"
                          className="ml-auto w-2 h-2 bg-primary-600 rounded-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                  ExpenseFlow v1.0
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}