// src/components/Button.jsx
import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
  let baseClasses = 'px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50';
  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
      break;
    case 'secondary':
      variantClasses = 'bg-zinc-700 hover:bg-zinc-600 text-white focus:ring-zinc-500';
      break;
    case 'outline':
      variantClasses = 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500';
      break;
    case 'ghost':
      variantClasses = 'bg-transparent hover:bg-zinc-700 text-white focus:ring-zinc-500';
      break;
    default:
      variantClasses = 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
