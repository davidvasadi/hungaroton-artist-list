import React from 'react';
import ClientThemeProvider from '../src/components/ClientThemeProvider';

export const metadata = {
  title: 'Hungaroton Artist List',
  description: 'Artist list application with pagination and filters',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <body>
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
