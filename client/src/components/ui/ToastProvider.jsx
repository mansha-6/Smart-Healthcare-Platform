import React, { useState, createContext, useContext } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({ title: '', description: '', type: 'success' });

  const showToast = (title, description, type = 'success') => {
    setMessage({ title, description, type });
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right">
        {children}
        <Toast.Root 
          open={open} 
          onOpenChange={setOpen} 
          className={`rounded-md shadow-lg p-4 flex items-start gap-3 border-l-4 transition-all duration-300 data-[state=open]:animate-slideIn data-[state=closed]:animate-hide
            ${message.type === 'error' ? 'bg-white border-red-500' : 'bg-white border-green-500'}
          `}
        >
          <div className="flex-1">
            <Toast.Title className="font-semibold text-gray-900 text-sm">{message.title}</Toast.Title>
            <Toast.Description className="text-sm text-gray-500 mt-1">{message.description}</Toast.Description>
          </div>
          <Toast.Close className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 w-full max-w-sm z-[100]" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
