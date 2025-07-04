import React from 'react';
import { JobApplication } from '../types';
import { FileText } from 'lucide-react';

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: JobApplication['status']) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {application.role}
          </h3>
          <p className="text-gray-600">{application.company}</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => onEdit(application)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(application.id)}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <span className="text-gray-500">Job Title:</span>
          <p className="font-medium text-gray-900">{application.jobTitle}</p>
        </div>
        <div>
          <span className="text-gray-500">Status:</span>
          <select
            className="block w-full mt-1 border border-gray-300 rounded-md"
            value={application.status}
            onChange={(e) =>
              onStatusChange(application.id, e.target.value as JobApplication['status'])
            }
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="accepted">Accepted</option>
          </select>
        </div>
        <div>
          <span className="text-gray-500">Applied Date:</span>
          <p>{application.appliedDate}</p>
        </div>
        <div>
          <span className="text-gray-500">Location:</span>
          <p>{application.location}</p>
        </div>
        <div>
          <span className="text-gray-500">Resume:</span>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <p>{application.resumeUsed}</p>
          </div>
        </div>
        {application.salaryRange && (
          <div>
            <span className="text-gray-500">Salary:</span>
            <p>{application.salaryRange}</p>
          </div>
        )}
      </div>
    </div>
  );
};
