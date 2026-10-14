import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';

export const Layout: React.FC = () => {
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-canvas">
      <header className="shrink-0 z-50 bg-surface border-b border-line">
        <Navigation />
      </header>

      <main ref={mainRef} className="flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
