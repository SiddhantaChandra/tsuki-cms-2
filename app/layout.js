import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from './ThemeRegistry';
import { ColorModeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/components/UI/Toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tsuki CMS",
  description: "Content Management System for Tsuki",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ColorModeProvider>
          <ThemeRegistry>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeRegistry>
        </ColorModeProvider>
      </body>
    </html>
  );
}
