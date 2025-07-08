import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export const Layout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Sticky header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <Navigation />
      </header>

      {/* Scrollable content below header */}
      <main className="flex-1 overflow-y-auto pt-20 px-4">
        <Outlet />
      </main>
    </div>
  );
};
