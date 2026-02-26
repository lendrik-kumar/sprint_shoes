import React from 'react';

/**
 * Primary Button Component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - button, secondary, danger, success
 * @param {string} props.size - sm, md, lg
 * @param {boolean} props.fullWidth - Stretched to full width
 * @param {boolean} props.loading - Show loading state
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const baseClasses =
    'font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300 disabled:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400',
    outline:
      'border-2 border-black text-black hover:bg-black hover:text-white disabled:border-gray-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading && <span className="animate-spin">⏳</span>}
      {children}
    </button>
  );
}

/**
 * Badge Component - Small label/tag
 */
export function Badge({ children, variant = 'gray', className = '' }) {
  const variantClasses = {
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-100 text-red-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Text Input Component
 */
export function Input({ label, error, required = false, icon: Icon, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />}
        <input
          className={`
            w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Select Component
 */
export function Select({ label, error, required = false, options = [], className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Textarea Component
 */
export function Textarea({ label, error, required = false, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Alert Component
 */
export function Alert({ message, type = 'info', onClose, className = '' }) {
  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div
      className={`
        p-4 rounded-lg border ${typeClasses[type]} flex justify-between items-center
        ${className}
      `}
    >
      <p>{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-xl font-bold cursor-pointer">
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * Modal/Dialog Component
 */
export function Modal({ isOpen, title, children, onClose, actions = [], size = 'md' }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-lg ${sizeClasses[size]} w-full mx-4`}>
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-6">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {actions.length > 0 && (
          <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'secondary'}
                onClick={action.onClick}
                size="sm"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Spinner/Loading Component
 */
export function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`inline-block animate-spin ${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full border-4 border-gray-300 border-t-black rounded-full" />
    </div>
  );
}

/**
 * Card Component - Container with consistent styling
 */
export function Card({ children, className = '', onClick, hoverable = false }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-gray-200 rounded-lg p-6 shadow-sm
        ${hoverable ? 'hover:shadow-lg cursor-pointer transition-shadow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Divider Component
 */
export function Divider({ text, className = '' }) {
  if (!text) {
    return <div className={`border-t border-gray-300 ${className}`} />;
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 border-t border-gray-300" />
      <span className="text-sm text-gray-500 font-medium">{text}</span>
      <div className="flex-1 border-t border-gray-300" />
    </div>
  );
}

/**
 * Pagination Component
 */
export function Pagination({ current, total, onPageChange, className = '' }) {
  const pages = Math.ceil(total / 10); // Assuming 10 items per page

  if (pages <= 1) return null;

  const getPages = () => {
    const pageArray = [];
    const startPage = Math.max(1, current - 2);
    const endPage = Math.min(pages, current + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageArray.push(i);
    }

    return pageArray;
  };

  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
      <Button
        size="sm"
        variant={current === 1 ? 'secondary' : 'outline'}
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
      >
        ← Prev
      </Button>

      {getPages().map((page) => (
        <Button
          key={page}
          size="sm"
          variant={page === current ? 'primary' : 'secondary'}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        size="sm"
        variant={current === pages ? 'secondary' : 'outline'}
        onClick={() => onPageChange(current + 1)}
        disabled={current === pages}
      >
        Next →
      </Button>
    </div>
  );
}

export default {
  Button,
  Badge,
  Input,
  Select,
  Textarea,
  Alert,
  Modal,
  Spinner,
  Card,
  Divider,
  Pagination,
};
