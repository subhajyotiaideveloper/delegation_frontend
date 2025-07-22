import React from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Paperclip, 
  Bell,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Delegation } from '../types/delegation';

interface DelegationDetailProps {
  delegation: Delegation;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => void;
}

const DelegationDetail: React.FC<DelegationDetailProps> = ({ 
  delegation, 
  onClose, 
  onStatusUpdate 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${getPriorityColor(delegation.priority)}`}></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{delegation.taskName}</h2>
              <p className="text-sm text-gray-500">ID: {delegation.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-700">Status</div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(delegation.status)}`}>
                    {delegation.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onStatusUpdate(delegation.id, 'In Progress')}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Start
                  </button>
                  <button
                    onClick={() => onStatusUpdate(delegation.id, 'Completed')}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700">Priority</div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                delegation.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                delegation.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                delegation.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {delegation.priority}
              </span>
            </div>
          </div>

          {/* Assignment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Assigned By</div>
                  <div className="text-sm text-gray-900">{delegation.assignedBy?.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-500">{delegation.assignedBy?.role || ''}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Assigned To</div>
                  <div className="text-sm text-gray-900">{delegation.assignedTo?.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-500">{delegation.assignedTo?.role || ''}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Planned Date</div>
                  <div className="text-sm text-gray-900">{formatDate(delegation.plannedDate)}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Created At</div>
                  <div className="text-sm text-gray-900">{formatDateTime(delegation.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          {delegation.message && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <div className="text-sm font-medium text-gray-700">Message</div>
              </div>
              <p className="text-sm text-gray-900">{delegation.message}</p>
            </div>
          )}

          {/* Attachments */}
          {delegation.attachments && delegation.attachments.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Paperclip className="w-5 h-5 text-gray-400" />
                <div className="text-sm font-medium text-gray-700">Attachments</div>
              </div>
              <div className="space-y-2">
                {delegation.attachments.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded border">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{file.name}</span>
                    <span className="text-xs text-gray-500">({Math.round(file.size / 1024)} KB)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {delegation.assignedPC && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-700">Assigned PC</div>
                <div className="text-sm text-gray-900 mt-1">{delegation.assignedPC}</div>
              </div>
            )}

            {delegation.groupName && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-700">Group</div>
                <div className="text-sm text-gray-900 mt-1">{delegation.groupName}</div>
              </div>
            )}

            {delegation.notifyTo && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-700">Notify To</div>
                <div className="text-sm text-gray-900 mt-1">{delegation.notifyTo.name}</div>
              </div>
            )}

            {delegation.auditor && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-700">Auditor</div>
                <div className="text-sm text-gray-900 mt-1">{delegation.auditor.name}</div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-3">Task Settings</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                {delegation.makeAttachmentMandatory ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm text-gray-900">Attachment Mandatory</span>
              </div>
              <div className="flex items-center space-x-2">
                {delegation.makeNoteMandatory ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm text-gray-900">Note Mandatory</span>
              </div>
              <div className="flex items-center space-x-2">
                {delegation.setReminder ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm text-gray-900">Reminder Set</span>
              </div>
            </div>
          </div>

          {/* Reminder Details */}
          {delegation.setReminder && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <div className="text-sm font-medium text-blue-900">Reminder Settings</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-blue-700">Mode:</div>
                  <div className="text-blue-900">{delegation.reminderMode}</div>
                </div>
                <div>
                  <div className="text-blue-700">Frequency:</div>
                  <div className="text-blue-900">{delegation.reminderFrequency}</div>
                </div>
                <div>
                  <div className="text-blue-700">Before Days:</div>
                  <div className="text-blue-900">{delegation.reminderBeforeDays}</div>
                </div>
                <div>
                  <div className="text-blue-700">Starting Time:</div>
                  <div className="text-blue-900">{delegation.reminderStartingTime}</div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {delegation.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Notes</div>
              <p className="text-sm text-gray-900">{delegation.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DelegationDetail;