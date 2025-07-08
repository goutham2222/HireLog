export type ApplicationStatus = 'applied' | 'interview' | 'rejected' | 'accepted' | 'pending';

export interface JobApplication {
  id: string;
  role: string;
  jobTitle: string;
  company: string;
  resumeUsed: string;
  appliedDate: string;
  status: ApplicationStatus;
  coverLetter: string;
  jobUrl: string;
  notes: string;
  salaryRange: string;
  location: string;
  contactPerson: string;
  followUpDate: string;
}

export interface DashboardStats {
  totalApplications: number;
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
  statusCounts: Record<ApplicationStatus, number>;
  applicationsByStatus: { status: ApplicationStatus; count: number }[];
  applicationsByDate: { date: string; count: number }[];
}

export interface FilterOptions {
  searchTerm: string;
  status: string;
  sortOrder: 'asc' | 'desc';
  role: string;
  company: string;
  location: string;
  resume: string;
  dateStart: string;
  dateEnd: string;
}
