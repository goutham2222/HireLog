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
