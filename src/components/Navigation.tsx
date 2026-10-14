import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, BarChart3, Plus, ListChecks, Layers } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Active Applications', icon: ListChecks },
    { path: '/all', label: 'All Applications', icon: Layers },
    { path: '/add', label: 'Add Application', icon: Plus },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="bg-surface">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Briefcase className="h-7 w-7 text-accent" />
            <h1 className="text-xl font-bold text-ink">HireLog</h1>
          </div>

          <div className="flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  location.pathname === path
                    ? 'bg-accent-soft text-accent'
                    : 'text-muted hover:bg-canvas hover:text-ink'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
