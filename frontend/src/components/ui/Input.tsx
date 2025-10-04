import { forwardRef, type InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const inputClasses = `
      input-field
      ${error ? 'border-red-500 focus:ring-red-500' : ''}
      ${className}
    `.trim();

    return (
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <motion.input
          ref={ref}
          className={inputClasses}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          {...(props as any)}
        />
        
        {error && (
          <motion.p
            className="mt-1 text-sm text-red-600"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-600">{helperText}</p>
        )}
      </motion.div>
    );
  }
);

Input.displayName = 'Input';
