import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const sizeClasses = {
  sm: 'max-w-sm w-full',
  md: 'max-w-md w-full',
  lg: 'max-w-2xl w-full',
  xl: 'max-w-4xl w-full',
  '2xl': 'max-w-6xl w-full',
};

export function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal Container with forced centering */}
          <div 
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center p-4 sm:p-6 lg:p-8"
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              minHeight: '100vh',
              minWidth: '100vw'
            }}
          >
            <motion.div
              className={`bg-white rounded-xl shadow-2xl ${sizeClasses[size]} overflow-hidden relative border border-gray-200`}
              style={{
                maxWidth: size === 'xl' ? '896px' : size === '2xl' ? '1152px' : size === 'lg' ? '512px' : '448px',
                width: '100%',
                maxHeight: '90vh',
                margin: 'auto'
              }}
              initial={{ opacity: 0, scale: 0.9, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? "modal-title" : undefined}
            >
              {title && (
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <h2 id="modal-title" className="text-xl font-semibold text-gray-900">{title}</h2>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-full"
                      aria-label="Close modal"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-8rem)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
