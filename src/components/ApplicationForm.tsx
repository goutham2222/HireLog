// ApplicationForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { JobApplication } from '../types';
import { Save, X, FilePlus } from 'lucide-react';
import { ROLE_OPTIONS } from '../constants/roles';
import { formatLocalDateInput } from '../utils/dateUtils';

const fieldClass = 'w-full px-4 py-2 border border-line rounded-lg bg-surface text-ink';
const labelClass = 'block text-sm font-medium text-ink mb-2';

interface ApplicationFormProps {
  application?: JobApplication;
  onSave: (application: Omit<JobApplication, 'id'>) => void | Promise<void>;
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
    appliedDate: formatLocalDateInput(),
    status: 'applied',
    coverLetter: '',
    jobUrl: '',
    notes: '',
    salaryRange: '',
    location: '',
    contactPerson: '',
    followUpDate: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (application) {
      setFormData({
        role: application.role,
        jobTitle: application.jobTitle,
        company: application.company,
        resumeUsed: application.resumeUsed,
        appliedDate: application.appliedDate?.slice(0, 10) || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(formData);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save this application.');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6 border border-line">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-ink">
          {application ? 'Edit Application' : 'Add New Application'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-muted hover:text-ink transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role */}
          <div>
            <label className={labelClass}>Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className={fieldClass}
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
            <label className={labelClass}>Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              className={fieldClass}
            />
          </div>

          {/* Company */}
          <div>
            <label className={labelClass}>Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className={fieldClass}
            />
          </div>

          {/* Resume Used */}
          <div>
            <label className={labelClass}>Resume Used *</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="resumeUsed"
                value={formData.resumeUsed}
                readOnly
                required
                className={`${fieldClass} bg-canvas text-muted`}
              />
              <button
                type="button"
                onClick={handleFilePick}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover flex items-center"
              >
                <FilePlus className="w-4 h-4 mr-2" />
                Browse
              </button>
            </div>
          </div>

          {/* Applied Date */}
          <div>
            <label className={labelClass}>Applied Date *</label>
            <input
              type="date"
              name="appliedDate"
              value={formData.appliedDate}
              onChange={handleChange}
              required
              className={fieldClass}
            />
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={fieldClass}
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
            <label className={labelClass}>Salary Range</label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              placeholder="e.g., $80,000 - $100,000"
              className={fieldClass}
            />
          </div>

          {/* Location */}
          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Remote"
              className={fieldClass}
            />
          </div>

          {/* Job URL */}
          <div>
            <label className={labelClass}>Job URL</label>
            <input
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              placeholder="https://..."
              className={fieldClass}
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className={labelClass}>Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="e.g., Jane Doe"
              className={fieldClass}
            />
          </div>

          {/* Follow-up Date */}
          <div>
            <label className={labelClass}>Follow-up Date</label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label className={labelClass}>Cover Letter</label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={3}
            className={fieldClass}
            placeholder="Optional notes or summary of your cover letter"
          />
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className={fieldClass}
            placeholder="Any relevant notes or reminders"
          />
        </div>

        {/* Buttons */}
        {saveError && <p className="text-sm text-status-rejected">{saveError}</p>}

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-6 py-2 border border-line text-ink rounded-lg hover:bg-canvas disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            <span>{saving ? 'Saving...' : `${application ? 'Update' : 'Save'} Application`}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
