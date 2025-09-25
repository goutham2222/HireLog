// ApplicationForm.tsx
import React, { useState, useEffect } from 'react';
import { JobApplication } from '../types';
import { Save, X, FilePlus } from 'lucide-react';
import { ROLE_OPTIONS } from '../constants/roles';

interface ApplicationFormProps {
  application?: JobApplication;
  onSave: (application: Omit<JobApplication, 'id'>) => void;
  onCancel: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  application,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<JobApplication, 'id'>>({
    role: '',
    jobTitle: '',
    company: '',
    resumeUsed: '',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'applied',
    coverLetter: '',
    jobUrl: '',
    notes: '',
    salaryRange: '',
    location: '',
    contactPerson: '',
    followUpDate: '',
  });

  useEffect(() => {
    if (application) {
      setFormData({
        role: application.role,
        jobTitle: application.jobTitle,
        company: application.company,
        resumeUsed: application.resumeUsed,
        appliedDate: application.appliedDate,
        status: application.status,
        coverLetter: application.coverLetter || '',
        jobUrl: application.jobUrl || '',
        notes: application.notes || '',
        salaryRange: application.salaryRange || '',
        location: application.location || '',
        contactPerson: application.contactPerson || '',
        followUpDate: application.followUpDate || '',
      });
    }
  }, [application]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFilePick = async () => {
    const filePath = await window.api.pickResumeFile();
    if (filePath) {
      const fileName = filePath.split(/(\\|\/)/g).pop(); // Extract file name only
      setFormData(prev => ({ ...prev, resumeUsed: fileName || '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {application ? 'Edit Application' : 'Add New Application'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select a role</option>
              {ROLE_OPTIONS.filter(r => r !== 'All').map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Resume Used */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume Used *</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="resumeUsed"
                value={formData.resumeUsed}
                readOnly
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
              <button
                type="button"
                onClick={handleFilePick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FilePlus className="w-4 h-4 mr-2" />
                Browse
              </button>
            </div>
          </div>

          {/* Applied Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Applied Date *</label>
            <input
              type="date"
              name="appliedDate"
              value={formData.appliedDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              placeholder="e.g., $80,000 - $100,000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Remote"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Job URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job URL</label>
            <input
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="e.g., Jane Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Optional notes or summary of your cover letter"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Any relevant notes or reminders"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            <span>{application ? 'Update' : 'Save'} Application</span>
          </button>
        </div>
      </form>
    </div>
  );
};
