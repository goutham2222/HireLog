import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: typeof LucideIcon;
  iconClassName: string;
  description?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconClassName,
  description,
}) => {
  return (
    <div className="bg-surface rounded-xl p-6 border border-line">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="text-3xl font-bold text-ink mt-1">{value}</p>
          {description && (
            <p className="text-sm text-muted mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-canvas ${iconClassName}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
