import React, { useState } from 'react';
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

  const [roleFilter, setRoleFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('');

  const filteredApplications = applications.filter(app => {
    const roleMatch = roleFilter === 'All' || app.role === roleFilter;
    const companyMatch = app.company.toLowerCase().includes(companyFilter.toLowerCase());
    return roleMatch && companyMatch;
  });

  const stats = calculateStats(filteredApplications);

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
    <div className="min-h-screen h-full overflow-y-auto w-full bg-gray-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm"
          >
            <option value="All">All Roles</option>
            <option value="Data Engineer">Data Engineer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="UX/UI Designer">UX/UI Designer</option>
            <option value="Business Analyst">Business Analyst</option>
            <option value="Machine Learning Engineer">Machine Learning Engineer</option>
            <option value="Cloud Engineer">Cloud Engineer</option>
            <option value="Mobile Developer">Mobile Developer</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            value={companyFilter}
            onChange={e => setCompanyFilter(e.target.value)}
            placeholder="Filter by Company..."
            className="px-4 py-2 border rounded-md shadow-sm w-64"
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard title="Total Applications" value={stats.totalApplications} icon={Target} color="bg-blue-600" />
          <StatsCard title="Today" value={stats.dailyCount} icon={Calendar} color="bg-green-600" />
          <StatsCard title="This Week" value={stats.weeklyCount} icon={TrendingUp} color="bg-purple-600" />
          <StatsCard title="This Month" value={stats.monthlyCount} icon={Clock} color="bg-orange-600" />
          <StatsCard title="Accepted" value={stats.statusCounts.accepted || 0} icon={CheckCircle} color="bg-emerald-600" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Status Distribution</h2>
            <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6">
              <ResponsiveContainer width="100%" height={240} minWidth={240}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm">
                {statusData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span>{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
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

        {/* Success Metrics */}
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
                  {stats.averageApplicationsPerDay.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Avg. Applications/Day</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
