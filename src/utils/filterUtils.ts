import { JobApplication } from '../types';

interface FilterOptions {
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

export function applyFilters(apps: JobApplication[], filters: FilterOptions): JobApplication[] {
  let filtered = [...apps];

  if (filters.searchTerm) {
    const lower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      app =>
        app.jobTitle.toLowerCase().includes(lower) ||
        app.company.toLowerCase().includes(lower)
    );
  }

  if (filters.role) {
    filtered = filtered.filter(app =>
      app.role.toLowerCase().includes(filters.role.toLowerCase())
    );
  }

  if (filters.company) {
    filtered = filtered.filter(app =>
      app.company.toLowerCase().includes(filters.company.toLowerCase())
    );
  }

  if (filters.location) {
    filtered = filtered.filter(app =>
      app.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.resume) {
    filtered = filtered.filter(app =>
      app.resumeUsed?.toLowerCase().includes(filters.resume.toLowerCase())
    );
  }

  if (filters.dateStart) {
    const start = new Date(filters.dateStart);
    filtered = filtered.filter(app => new Date(app.appliedDate) >= start);
  }

  if (filters.dateEnd) {
    const end = new Date(filters.dateEnd);
    filtered = filtered.filter(app => new Date(app.appliedDate) <= end);
  }

  if (filters.status !== 'All') {
    filtered = filtered.filter(app => app.status === filters.status);
  }

  filtered.sort((a, b) => {
    const aDate = new Date(a.appliedDate).getTime();
    const bDate = new Date(b.appliedDate).getTime();
    return filters.sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
  });

  return filtered;
}
