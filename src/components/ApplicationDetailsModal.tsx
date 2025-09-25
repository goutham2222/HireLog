import React from 'react';
import { JobApplication } from '../types';

interface ApplicationDetailsModalProps {
  application: JobApplication | null;
  onClose: () => void;
}

export const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  application,
  onClose,
}) => {
  if (!application) return null;

  // Fields to display in the grid (Cover Letter excluded here)
  const fields: { label: string; key: keyof JobApplication; isLink?: boolean }[] = [
    { label: 'Job Title', key: 'jobTitle' },
    { label: 'Company', key: 'company' },
    { label: 'Applied Date', key: 'appliedDate' },
    { label: 'Status', key: 'status' },
    { label: 'Location', key: 'location' },
    { label: 'Resume Used', key: 'resumeUsed' },
    { label: 'Salary', key: 'salaryRange' }, // legacy field
    { label: 'Job URL', key: 'jobUrl', isLink: true },
    { label: 'Follow Up Date', key: 'followUpDate' },
    { label: 'Contact Person', key: 'contactPerson' },
    { label: 'Notes', key: 'notes' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative">
        {/* Close (X) button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Application Details</h2>

        {/* Grid for standard fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-h-[65vh] overflow-y-auto pr-2">
          {fields.map(({ label, key, isLink }) => {
            const value = application[key];
            if (!value) return null;

            return (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-semibold text-gray-600 mb-1">{label}</span>
                {isLink ? (
                  <a
                    href={String(value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View Posting
                  </a>
                ) : (
                  <span className="text-gray-900 break-words">{value}</span>
                )}
              </div>
            );
          })}

          {/* Special case: Cover Letter always at bottom */}
          {application.coverLetter && (
            <div className="col-span-1 sm:col-span-2 flex flex-col mt-4">
              <span className="text-sm font-semibold text-gray-600 mb-1">Cover Letter</span>
              <div className="text-gray-900 whitespace-pre-line border rounded-md p-3 bg-gray-50">
                {application.coverLetter}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
