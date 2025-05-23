'use client';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useColorMode } from '@/context/ThemeContext';

// A basic theme can be defined here. You can customize it later.
const defaultTheme = createTheme();

export default function ThemeRegistry({ children }) {
  const { mode } = useColorMode();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: { main: '#1976d2' }, // Example Blue for light
                // background: { default: '#ffffff', paper: '#f5f5f5' },
              }
            : {
                primary: { main: '#90caf9' }, // Example Lighter Blue for dark
                // background: { default: '#121212', paper: '#1e1e1e' },
              }),
        },
        // You can add other theme customizations here if needed
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
} 