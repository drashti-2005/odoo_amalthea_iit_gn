import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
}

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
  outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    disabled = false,
    className = '',
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const variantClasses = variants[variant];
    const sizeClasses = sizes[size];
    
    const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 17,
        }}
        {...props}
      >
        {isLoading && (
          <motion.div
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        <motion.span
          initial={false}
          animate={{ opacity: isLoading ? 0.7 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
