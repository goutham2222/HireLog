import React, { useState } from 'react';
import { useJobApplications } from '../hooks/useJobApplications';
import { StatsCard } from '../components/StatsCard';
import { calculateStats } from '../utils/statsUtils';
import {
  Calendar, TrendingUp, Clock, CheckCircle, Target,
} from 'lucide-react';
import {
  CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis,
} from 'recharts';
import { ROLE_OPTIONS } from '../constants/roles';

const statusColors: Record<string, string> = {
  Applied: 'var(--color-applied)',
  Interview: 'var(--color-interview)',
  Pending: 'var(--color-pending)',
  Rejected: 'var(--color-rejected)',
  Accepted: 'var(--color-accepted)',
};

export const AnalyticsPage: React.FC = () => {
  const { applications, loading, error } = useJobApplications();

  const [roleFilter, setRoleFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('');

  const filteredApplications = applications.filter(app => {
    const roleMatch = roleFilter === 'All' || app.role === roleFilter;
    const companyMatch = (app.company ?? '').toLowerCase().includes(companyFilter.toLowerCase());
    return roleMatch && companyMatch;
  });

  const stats = calculateStats(filteredApplications);
  const statusMax = Math.max(stats.totalApplications, 1);

  const statusData = [
    { name: 'Applied', value: stats.statusCounts.applied || 0 },
    { name: 'Interview', value: stats.statusCounts.interview || 0 },
    { name: 'Pending', value: stats.statusCounts.pending || 0 },
    { name: 'Rejected', value: stats.statusCounts.rejected || 0 },
    { name: 'Accepted', value: stats.statusCounts.accepted || 0 },
  ];

  const applicationTrend = stats.trendLast30Days.map(item => ({
    date: item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count
  }));

  const interviewRate = stats.totalApplications > 0
    ? ((stats.statusCounts.interview || 0) / stats.totalApplications * 100).toFixed(1)
    : '0.0';
  const offerRate = stats.totalApplications > 0
    ? ((stats.statusCounts.accepted || 0) / stats.totalApplications * 100).toFixed(1)
    : '0.0';

  const controlClass = 'px-4 py-2 border border-line rounded-lg bg-surface text-ink shadow-sm';

  if (loading) {
    return (
      <div className="h-full overflow-y-auto w-full bg-canvas px-4 py-10 text-muted">
        Loading applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto w-full bg-canvas px-4 py-10 text-status-rejected">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto w-full bg-canvas px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className={controlClass}
          >
            {ROLE_OPTIONS.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={companyFilter}
            onChange={e => setCompanyFilter(e.target.value)}
            placeholder="Filter by Company..."
            className={`${controlClass} w-64`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatsCard title="Total Applications" value={stats.totalApplications} icon={Target} iconClassName="text-accent" />
          <StatsCard title="Today" value={stats.dailyCount} icon={Calendar} iconClassName="text-accent" />
          <StatsCard title="This Week" value={stats.weeklyCount} icon={TrendingUp} iconClassName="text-accent" />
          <StatsCard title="This Month" value={stats.monthlyCount} icon={Clock} iconClassName="text-accent" />
          <StatsCard title="Accepted" value={stats.statusCounts.accepted || 0} icon={CheckCircle} iconClassName="text-status-accepted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-surface rounded-xl p-6 border border-line">
            <h2 className="text-xl font-semibold text-ink mb-4">Application Trend (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={applicationTrend}>
                <CartesianGrid stroke="var(--color-line)" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--color-muted)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted)' }} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-surface rounded-xl p-6 border border-line">
            <h2 className="text-xl font-semibold text-ink mb-4">Status</h2>
            <div className="flex flex-col gap-4">
              {statusData.map(entry => (
                <div key={entry.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-ink">{entry.name}</span>
                    <span className="text-muted">{entry.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-canvas">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${(entry.value / statusMax) * 100}%`,
                        backgroundColor: statusColors[entry.name],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface rounded-xl p-6 border border-line text-center">
            <div className="text-3xl font-bold text-accent">{interviewRate}%</div>
            <div className="text-sm text-muted mt-1">Interview Rate</div>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-line text-center">
            <div className="text-3xl font-bold text-status-accepted">{offerRate}%</div>
            <div className="text-sm text-muted mt-1">Offer Rate</div>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-line text-center">
            <div className="text-3xl font-bold text-status-interview">{stats.followUpsDue}</div>
            <div className="text-sm text-muted mt-1">Follow-ups Due in 7 Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};
