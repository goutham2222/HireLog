import React from 'react';
import { useJobApplications } from '../hooks/useJobApplications';
import { StatsCard } from '../components/StatsCard';
import { calculateStats } from '../utils/statsUtils';
import {
  Calendar, TrendingUp, Clock, CheckCircle, Target,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { applications } = useJobApplications();
  const stats = calculateStats(applications);

  const statusData = [
    { name: 'Applied', value: stats.statusCounts.applied || 0, color: '#3B82F6' },
    { name: 'Interview', value: stats.statusCounts.interview || 0, color: '#F59E0B' },
    { name: 'Pending', value: stats.statusCounts.pending || 0, color: '#6B7280' },
    { name: 'Rejected', value: stats.statusCounts.rejected || 0, color: '#EF4444' },
    { name: 'Accepted', value: stats.statusCounts.accepted || 0, color: '#10B981' },
  ];

  const applicationTrend = stats.applicationsByDate.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Insights into your job application journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatsCard title="Total Applications" value={stats.totalApplications} icon={Target} color="bg-blue-600" />
        <StatsCard title="Today" value={stats.dailyCount} icon={Calendar} color="bg-green-600" />
        <StatsCard title="This Week" value={stats.weeklyCount} icon={TrendingUp} color="bg-purple-600" />
        <StatsCard title="This Month" value={stats.monthlyCount} icon={Clock} color="bg-orange-600" />
        <StatsCard title="Accepted" value={stats.statusCounts.accepted || 0} icon={CheckCircle} color="bg-emerald-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Application Trend */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Trend (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={applicationTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Status Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.applicationsByStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Success Rate */}
      {stats.totalApplications > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mt-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Success Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {((stats.statusCounts.interview || 0) / stats.totalApplications * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Interview Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {((stats.statusCounts.accepted || 0) / stats.totalApplications * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(stats.totalApplications / 30)}
              </div>
              <div className="text-sm text-gray-600">Avg. Applications/Day</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
