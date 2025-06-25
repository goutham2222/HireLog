import React from 'react';
import { JobApplication } from '../types';
import { Calendar, Building, FileText, ExternalLink, Edit3, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: JobApplication['status']) => void;
}

const statusColors = {
  applied: 'bg-blue-100 text-blue-800',
  interview: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-gray-100 text-gray-800',
  rejected: 'bg-red-100 text-red-800',
  accepted: 'bg-green-100 text-green-800',
};

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {application.jobTitle}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Building className="h-4 w-4 mr-1" />
            <span className="font-medium">{application.company}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(application.appliedDate)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={application.status}
            onChange={(e) => onStatusChange(application.id, e.target.value as JobApplication['status'])}
            className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${
              statusColors[application.status]
            }`}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="accepted">Accepted</option>
          </select>
          
          <button
            onClick={() => onEdit(application)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete(application.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Role:</span>
          <p className="font-medium text-gray-900">{application.role}</p>
        </div>
        
        <div>
          <span className="text-gray-500">Resume:</span>
          <div className="flex items-center">
            <FileText className="h-3 w-3 mr-1" />
            <p className="font-medium text-gray-900">{application.resumeUsed}</p>
          </div>
        </div>
        
        {application.salary && (
          <div>
            <span className="text-gray-500">Salary:</span>
            <p className="font-medium text-gray-900">{application.salary}</p>
          </div>
        )}
        
        {application.location && (
          <div>
            <span className="text-gray-500">Location:</span>
            <p className="font-medium text-gray-900">{application.location}</p>
          </div>
        )}
      </div>
      
      {application.jobUrl && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <a
            href={application.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View Job Posting
          </a>
        </div>
      )}
    </div>
  );
};