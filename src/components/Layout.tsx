import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navigation />
      <main className="flex-1 overflow-y-auto container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
