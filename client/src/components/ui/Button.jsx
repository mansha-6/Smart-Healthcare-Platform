import React from 'react';

export const Button = ({ children, className, ...props }) => {
  return (
    <button 
      className={`px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-sky-600 transition-colors disabled:opacity-50 ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
