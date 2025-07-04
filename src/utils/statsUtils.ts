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
}

export function calculateStats(applications: JobApplication[]): DashboardStats {
  const statusCounts: StatusCounts = {
    applied: 0,
    interview: 0,
    rejected: 0,
    accepted: 0,
    pending: 0,
  };

  const applicationsByDateMap = new Map<string, number>();
  const now = new Date();

  for (const app of applications) {
    // Count status
    if (statusCounts[app.status]) {
      statusCounts[app.status]++;
    } else {
      statusCounts[app.status] = 1;
    }

    // Count by appliedDate
    const dateKey = new Date(app.appliedDate).toDateString();
    applicationsByDateMap.set(dateKey, (applicationsByDateMap.get(dateKey) || 0) + 1);
  }

  const applicationsByDate = Array.from(applicationsByDateMap.entries()).map(([date, count]) => ({
    date: new Date(date),
    count,
  }));

  const totalApplications = applications.length;

  const isSameDay = (date: Date) =>
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isSameWeek = (date: Date) => {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return date >= startOfWeek && date <= endOfWeek;
  };

  const isSameMonth = (date: Date) =>
    date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

  const dailyCount = applicationsByDate
    .filter((entry) => isSameDay(entry.date))
    .reduce((sum, entry) => sum + entry.count, 0);

  const weeklyCount = applicationsByDate
    .filter((entry) => isSameWeek(entry.date))
    .reduce((sum, entry) => sum + entry.count, 0);

  const monthlyCount = applicationsByDate
    .filter((entry) => isSameMonth(entry.date))
    .reduce((sum, entry) => sum + entry.count, 0);

  const applicationsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    status: status as ApplicationStatus,
    count,
  }));

  return {
    statusCounts,
    applicationsByDate,
    totalApplications,
    dailyCount,
    weeklyCount,
    monthlyCount,
    applicationsByStatus,
  };
}
