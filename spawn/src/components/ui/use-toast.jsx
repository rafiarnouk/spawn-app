import { useState, useEffect } from 'react';

export function toast({ title, description, variant = "default", duration = 3000 }) {
  // Get existing toasts from localStorage or initialize empty array
  const existingToasts = JSON.parse(localStorage.getItem('toasts') || '[]');
  
  // Create a new toast with a unique ID
  const newToast = {
    id: Date.now(),
    title,
    description,
    variant,
    duration,
    timestamp: new Date().toISOString()
  };
  
  // Add the new toast to the array and save back to localStorage
  const updatedToasts = [...existingToasts, newToast];
  localStorage.setItem('toasts', JSON.stringify(updatedToasts));
  
  // Dispatch a custom event to notify any listeners that a new toast was added
  window.dispatchEvent(new CustomEvent('toast-added', { detail: newToast }));
  
  // After the duration, remove the toast
  setTimeout(() => {
    const toasts = JSON.parse(localStorage.getItem('toasts') || '[]');
    const filteredToasts = toasts.filter(toast => toast.id !== newToast.id);
    localStorage.setItem('toasts', JSON.stringify(filteredToasts));
    window.dispatchEvent(new CustomEvent('toast-removed', { detail: newToast }));
  }, duration);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  
  useEffect(() => {
    // Load initial toasts
    const storedToasts = JSON.parse(localStorage.getItem('toasts') || '[]');
    setToasts(storedToasts);
    
    // Listen for toast events
    const handleToastAdded = (e) => {
      setToasts(prev => [...prev, e.detail]);
    };
    
    const handleToastRemoved = (e) => {
      setToasts(prev => prev.filter(toast => toast.id !== e.detail.id));
    };
    
    window.addEventListener('toast-added', handleToastAdded);
    window.addEventListener('toast-removed', handleToastRemoved);
    
    return () => {
      window.removeEventListener('toast-added', handleToastAdded);
      window.removeEventListener('toast-removed', handleToastRemoved);
    };
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`rounded-md shadow-lg p-4 transform transition-all duration-300 animate-in fade-in slide-in-from-right-full max-w-md ${
            toast.variant === 'destructive' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200'
          }`}
        >
          {toast.title && (
            <div className="font-semibold">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm mt-1">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
} 