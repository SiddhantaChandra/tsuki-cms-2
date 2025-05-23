'use client';

import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'dark',
});

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState('dark'); // Initialize with dark for SSR/initial client render

  useEffect(() => {
    // This effect runs only on the client after hydration
    let determinedMode = 'dark'; // Default to dark if no other preference is found
    try {
      const storedMode = localStorage.getItem('themeMode');
      if (storedMode) {
        determinedMode = storedMode; // localStorage overrides everything
      } else if (window.matchMedia) {
        // Check system preference only if no localStorage override
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            determinedMode = 'light'; // Explicitly set to light if system prefers light
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            determinedMode = 'dark'; // System prefers dark
        }
        // If system prefers neither explicitly (e.g. no-preference), it stays dark (our overall default)
      }
    } catch (error) {
      console.error("Error determining theme mode on client: ", error);
      // Fallback to dark on error
    }
    
    if (determinedMode !== mode) {
        setMode(determinedMode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs once on mount

  const colorModeApi = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          try {
            localStorage.setItem('themeMode', newMode);
          } catch (error) {
             console.error("Could not access localStorage: ", error);
          }
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorModeApi}>
      {children}
    </ColorModeContext.Provider>
  );
}

export const useColorMode = () => useContext(ColorModeContext); 