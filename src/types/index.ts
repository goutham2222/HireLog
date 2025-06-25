export interface JobApplication {
  id: string;
  role: string;
  jobTitle: string;
  company: string;
  resumeUsed: string;
  appliedDate: string;
  status: 'applied' | 'interview' | 'rejected' | 'accepted' | 'pending';
  coverLetter: string;
  jobUrl?: string;
  notes?: string;
  salary?: string;
  location?: string;
  contactPerson?: string;
  followUpDate?: string;
}

export interface DashboardStats {
  totalApplications: number;
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
  statusCounts: Record<string, number>;
  applicationsByDate: Array<{ date: string; count: number }>;
  applicationsByStatus: Array<{ status: string; count: number }>;
}