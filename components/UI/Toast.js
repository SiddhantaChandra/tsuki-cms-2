'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

// Create context for toast notifications
export const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
});

// Toast provider component
export function ToastProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('info'); // 'success', 'info', 'warning', 'error'
  const [autoHideDuration, setAutoHideDuration] = useState(5000);

  const showToast = (message, options = {}) => {
    const { title: titleOption, severity: severityOption, duration } = options;
    
    setMessage(message);
    if (titleOption) setTitle(titleOption);
    if (severityOption) setSeverity(severityOption);
    if (duration) setAutoHideDuration(duration);
    
    setOpen(true);
  };

  const hideToast = () => {
    setOpen(false);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    hideToast();
  };

  // Context value
  const contextValue = {
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleClose} 
          severity={severity} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

// Custom hook for using toast
export function useToast() {
  return useContext(ToastContext);
} 