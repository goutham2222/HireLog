// src/pages/ApplicationsPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { ApplicationForm } from '../components/ApplicationForm';
import { JobApplication } from '../types';
import { useJobApplications } from '../hooks/useJobApplications';
import { ApplicationDetailsModal } from '../components/ApplicationDetailsModal';
import { ROLE_OPTIONS } from '../constants/roles';

const statusOptions = ['applied', 'interview', 'rejected', 'accepted', 'pending'];

export const ActiveApplicationsPage: React.FC = () => {
  const {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    exportApplications,
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedApplication = applications.find(app => app.id === selectedApplicationId) || null;

  const handleEditClick = () => {
    if (selectedApplicationId) setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    if (selectedApplicationId && confirm("Are you sure you want to delete this application?")) {
      deleteApplication(selectedApplicationId);
      setSelectedApplicationId(null);
    }
  };

  const handleSave = async (data: Omit<JobApplication, 'id'>) => {
    if (selectedApplication) {
      const updated: JobApplication = { ...selectedApplication, ...data };
      await updateApplication(updated);
    } else {
      await addApplication(data);
    }
    setIsEditModalOpen(false);
    setSelectedApplicationId(null);
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setSelectedApplicationId(null);
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = applications
    .filter(app => app.status !== 'rejected') // Everything other than rejected
    .filter(app =>
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(app =>
      selectedStatuses.length === 0 ? true : selectedStatuses.includes(app.status)
    )
    .filter(app => (roleFilter === 'All' ? true : app.role === roleFilter))
    .filter(app => app.location.toLowerCase().includes(locationFilter.toLowerCase()))
    .filter(app => app.resumeUsed.toLowerCase().includes(resumeFilter.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.appliedDate).getTime();
      const dateB = new Date(b.appliedDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="min-h-screen w-full p-6 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        <div className="flex gap-3">
          <button
            disabled={!selectedApplicationId}
            onClick={handleEditClick}
            className={`px-4 py-2 rounded-md text-white ${
              selectedApplicationId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Edit
          </button>
          <button
            disabled={!selectedApplicationId}
            onClick={handleDeleteClick}
            className={`px-4 py-2 rounded-md text-white ${
              selectedApplicationId ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Filters Line 1 */}
      <div className="flex flex-wrap items-center gap-4 mb-2">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search job title or company..."
          className="px-4 py-2 border rounded-md shadow-sm w-96"
        />

        {/* Status Dropdown */}
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

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
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

      {/* Filters Line 2 (Toggle Visible) */}
      {showMoreFilters && (
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <input
            type="text"
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            placeholder="Filter by Location..."
            className="px-4 py-2 border rounded-md shadow-sm w-64"
          />
          <input
            type="text"
            value={resumeFilter}
            onChange={e => setResumeFilter(e.target.value)}
            placeholder="Filter by Resume..."
            className="px-4 py-2 border rounded-md shadow-sm w-64"
          />
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm"
          >
            <option value="desc">Sort by Newest</option>
            <option value="asc">Sort by Oldest</option>
          </select>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg shadow bg-white flex flex-col max-h-[420px] overflow-y-auto">
        <table className="w-full text-sm table-fixed">
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
                <td colSpan={5} className="text-center text-gray-500 py-6">No applications found.</td>
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
                  <td className="px-4 py-3">{app.jobTitle}</td>
                  <td className="px-4 py-3">{app.company}</td>
                  <td className="px-4 py-3">{app.appliedDate}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
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
      </div>

      {/* Export Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => exportApplications('json', filtered)}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Export JSON
        </button>
        <button
          onClick={() => exportApplications('csv', filtered)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
            <ApplicationForm application={selectedApplication} onSave={handleSave} onCancel={handleCancel} />
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
};
