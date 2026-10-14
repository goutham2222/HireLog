import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ApplicationForm } from './ApplicationForm';
import { ApplicationDetailsModal } from './ApplicationDetailsModal';
import { ApplicationStatus, JobApplication } from '../types';
import { useJobApplications } from '../hooks/useJobApplications';
import { ROLE_OPTIONS } from '../constants/roles';

const ALL_STATUSES: ApplicationStatus[] = ['applied', 'interview', 'rejected', 'accepted', 'pending'];

interface ApplicationsListProps {
  title: string;
  excludeStatuses?: ApplicationStatus[];
}

const includesText = (value: string | null | undefined, term: string) =>
  (value ?? '').toLowerCase().includes(term.toLowerCase());

const appliedTime = (value: string | null | undefined) => {
  const time = new Date(`${(value ?? '').slice(0, 10)}T00:00:00`).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const ApplicationsList: React.FC<ApplicationsListProps> = ({
  title,
  excludeStatuses = [],
}) => {
  const {
    applications,
    loading,
    error,
    updateApplication,
    deleteApplication,
  } = useJobApplications();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [roleFilter, setRoleFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [resumeFilter, setResumeFilter] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const statusOptions = ALL_STATUSES.filter(status => !excludeStatuses.includes(status));
  const selectedApplication = applications.find(app => app.id === selectedApplicationId) || null;

  const handleEditClick = () => {
    if (selectedApplicationId) setIsEditModalOpen(true);
  };

  const handleDeleteClick = async () => {
    if (!selectedApplicationId) return;
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      await deleteApplication(selectedApplicationId);
      setSelectedApplicationId(null);
      setActionError(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete this application.');
    }
  };

  const handleSave = async (data: Omit<JobApplication, 'id'>) => {
    if (!selectedApplication) return;
    await updateApplication({ ...selectedApplication, ...data });
    setIsEditModalOpen(false);
    setSelectedApplicationId(null);
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setSelectedApplicationId(null);
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(item => item !== status) : [...prev, status]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = applications
    .filter(app => !excludeStatuses.includes(app.status))
    .filter(app =>
      includesText(app.jobTitle, searchTerm) || includesText(app.company, searchTerm)
    )
    .filter(app => selectedStatuses.length === 0 || selectedStatuses.includes(app.status))
    .filter(app => roleFilter === 'All' || app.role === roleFilter)
    .filter(app => includesText(app.location, locationFilter))
    .filter(app => includesText(app.resumeUsed, resumeFilter))
    .sort((a, b) => {
      const dateA = appliedTime(a.appliedDate);
      const dateB = appliedTime(b.appliedDate);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="h-full overflow-hidden p-6 bg-gray-50 flex flex-col">
      <div className="shrink-0 flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <div className="flex gap-3">
          <button
            disabled={!selectedApplicationId || loading}
            onClick={handleEditClick}
            className={`px-4 py-2 rounded-md text-white ${
              selectedApplicationId && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Edit
          </button>
          <button
            disabled={!selectedApplicationId || loading}
            onClick={handleDeleteClick}
            className={`px-4 py-2 rounded-md text-white ${
              selectedApplicationId && !loading ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Delete
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">{error}</p>
      )}
      {actionError && (
        <p className="mb-4 text-sm text-red-600">{actionError}</p>
      )}

      <div className="shrink-0 flex flex-wrap items-center gap-4 mb-2">
        <input
          type="text"
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          placeholder="Search job title or company..."
          className="px-4 py-2 border rounded-md shadow-sm w-96"
        />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center justify-between px-4 py-2 border rounded-md shadow-sm bg-white w-64"
          >
            <span className="truncate">
              {selectedStatuses.length === 0
                ? 'Filter by Status'
                : selectedStatuses.length === 1
                ? selectedStatuses[0][0].toUpperCase() + selectedStatuses[0].slice(1)
                : 'Multiple statuses selected'}
            </span>
            <ChevronDown size={16} className="ml-2" />
          </button>
          {dropdownOpen && (
            <div className="absolute z-20 mt-2 w-64 bg-white border rounded-md shadow p-2 max-h-48 overflow-y-auto">
              {statusOptions.map(status => (
                <label key={status} className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-100 rounded">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={() => toggleStatus(status)}
                    className="form-checkbox"
                  />
                  <span className="capitalize">{status}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <select
          value={roleFilter}
          onChange={event => setRoleFilter(event.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm"
        >
          {ROLE_OPTIONS.map(role => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowMoreFilters(prev => !prev)}
          className="px-4 py-2 border rounded-md shadow-sm bg-white"
        >
          {showMoreFilters ? 'Hide Filters' : 'More Filters'}
        </button>
      </div>

      {showMoreFilters && (
        <div className="shrink-0 flex flex-wrap items-center gap-4 mb-4">
          <input
            type="text"
            value={locationFilter}
            onChange={event => setLocationFilter(event.target.value)}
            placeholder="Filter by Location..."
            className="px-4 py-2 border rounded-md shadow-sm w-64"
          />
          <input
            type="text"
            value={resumeFilter}
            onChange={event => setResumeFilter(event.target.value)}
            placeholder="Filter by Resume..."
            className="px-4 py-2 border rounded-md shadow-sm w-64"
          />
          <select
            value={sortOrder}
            onChange={event => setSortOrder(event.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm"
          >
            <option value="desc">Sort by Newest</option>
            <option value="asc">Sort by Oldest</option>
          </select>
        </div>
      )}

      <div className="mt-4 flex-1 min-h-0 overflow-y-auto border rounded-lg shadow bg-white">
        {loading ? (
          <p className="text-center text-gray-500 py-6">Loading applications...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 w-12">Select</th>
                <th className="px-4 py-3 text-left">Job Title</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Applied Date</th>
                <th className="px-4 py-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-6">
                    {error ? 'Applications could not be loaded.' : 'No applications found.'}
                  </td>
                </tr>
              ) : (
                filtered.map(app => (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedApplicationId(app.id)}
                    className={`border-b hover:bg-gray-50 cursor-pointer ${selectedApplicationId === app.id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        name="selectedApp"
                        checked={selectedApplicationId === app.id}
                        onChange={() => setSelectedApplicationId(app.id)}
                      />
                    </td>
                    <td className="px-4 py-3" title={app.jobTitle}>{app.jobTitle}</td>
                    <td className="px-4 py-3" title={app.company}>{app.company}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{app.appliedDate}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedApplicationId(app.id);
                          setIsDetailsModalOpen(true);
                        }}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isEditModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
            <ApplicationForm application={selectedApplication} onSave={handleSave} onCancel={handleCancel} />
          </div>
        </div>
      )}

      {isDetailsModalOpen && selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
};
