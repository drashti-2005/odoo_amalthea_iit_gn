import { useState, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { MobileSidebar } from '../components/layout/MobileSidebar';
import PasswordChangeModal from '../components/forms/PasswordChangeModal';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const authContext = useContext(AuthContext);

  // Check if the user needs to change their password
  useEffect(() => {
    const passwordChangeRequired = localStorage.getItem('passwordChangeRequired') === 'true';
    const user = authContext?.user;
    
    if (user && (passwordChangeRequired || user.passwordChangeRequired)) {
      setShowPasswordModal(true);
    }
  }, [authContext?.user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Password Change Modal */}
      {showPasswordModal && (
        <PasswordChangeModal 
          isOpen={showPasswordModal} 
          onClose={() => setShowPasswordModal(false)}
          token={authContext?.token || ''} 
        />
      )}
      
      {/* Desktop Navbar */}
      <Navbar onMobileMenuToggle={() => setSidebarOpen(true)} />

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <motion.main
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        {children}
      </motion.main>
    </div>
  );
}
