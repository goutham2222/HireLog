import { JobApplication, DashboardStats } from '../types';
import { isToday, isThisWeek, isThisMonth, getLast30Days } from './dateUtils';

export const calculateStats = (applications: JobApplication[]): DashboardStats => {
  const totalApplications = applications.length;
  
  const dailyCount = applications.filter(app => isToday(app.appliedDate)).length;
  const weeklyCount = applications.filter(app => isThisWeek(app.appliedDate)).length;
  const monthlyCount = applications.filter(app => isThisMonth(app.appliedDate)).length;
  
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const last30Days = getLast30Days();
  const applicationsByDate = last30Days.map(date => ({
    date,
    count: applications.filter(app => app.appliedDate === date).length
  }));
  
  const applicationsByStatus = [
    { status: 'Applied', count: statusCounts.applied || 0 },
    { status: 'Interview', count: statusCounts.interview || 0 },
    { status: 'Pending', count: statusCounts.pending || 0 },
    { status: 'Rejected', count: statusCounts.rejected || 0 },
    { status: 'Accepted', count: statusCounts.accepted || 0 },
  ];
  
  return {
    totalApplications,
    dailyCount,
    weeklyCount,
    monthlyCount,
    statusCounts,
    applicationsByDate,
    applicationsByStatus,
  };
};