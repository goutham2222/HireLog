import { JobApplication, ApplicationStatus } from '../types';

type StatusCounts = Record<ApplicationStatus, number>;

export interface DashboardStats {
  statusCounts: StatusCounts;
  applicationsByDate: { date: Date; count: number }[];
  totalApplications: number;
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
  applicationsByStatus: { status: ApplicationStatus; count: number }[];
  averageApplicationsPerDay: number;
}

const normalizeToLocalMidnight = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export function calculateStats(applications: JobApplication[]): DashboardStats {
  const statusCounts: StatusCounts = {
    applied: 0,
    interview: 0,
    rejected: 0,
    accepted: 0,
    pending: 0,
  };

  const applicationsByDateMap = new Map<number, number>();
  const now = normalizeToLocalMidnight(new Date());

  for (const app of applications) {
    const parsed = new Date(app.appliedDate + 'T00:00:00');
    const normalized = normalizeToLocalMidnight(parsed);
    const timeKey = normalized.getTime();

    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    applicationsByDateMap.set(timeKey, (applicationsByDateMap.get(timeKey) || 0) + 1);
  }

  const applicationsByDate = Array.from(applicationsByDateMap.entries()).map(([timestamp, count]) => ({
    date: new Date(timestamp),
    count,
  }));

  const isSameDay = (d: Date) => d.getTime() === now.getTime();

  const isSameWeek = (d: Date) => {
    const dayOfWeek = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return d >= monday && d <= sunday;
  };

  const isSameMonth = (d: Date) =>
    d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();

  const dailyCount = applicationsByDate
    .filter(entry => isSameDay(entry.date))
    .reduce((sum, entry) => sum + entry.count, 0);

  const weeklyCount = applicationsByDate
    .filter(entry => isSameWeek(entry.date))
    .reduce((sum, entry) => sum + entry.count, 0);

  const monthlyCount = applicationsByDate
    .filter(entry => isSameMonth(entry.date))
    .reduce((sum, entry) => sum + entry.count, 0);

  const applicationsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    status: status as ApplicationStatus,
    count,
  }));

  const uniqueDates = new Set(applicationsByDate.map(d => d.date.getTime()));
  const averageApplicationsPerDay = uniqueDates.size > 0
    ? applications.length / uniqueDates.size
    : 0;

  return {
    statusCounts,
    applicationsByDate,
    totalApplications: applications.length,
    dailyCount,
    weeklyCount,
    monthlyCount,
    applicationsByStatus,
    averageApplicationsPerDay,
  };
}
