import React, { useState } from 'react';
import { Plus, Mic, Upload, Calendar, Users, Bell, Settings } from 'lucide-react';
import { DelegationFormData } from '../types/delegation';

interface DelegationFormProps {
  onSubmit: (data: DelegationFormData) => void;
  onCancel: () => void;
}

const DelegationForm: React.FC<DelegationFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<DelegationFormData>({
    taskName: '',
    assignedTo: '',
    plannedDate: '',
    priority: 'Medium',
    message: '',
    attachments: [],
    assignedPC: '',
    groupName: '',
    notifyTo: '',
    auditor: '',
    makeAttachmentMandatory: false,
    makeNoteMandatory: false,
    notifyDoer: '',
    setReminder: false,
    reminderMode: 'Email',
    reminderFrequency: 'Daily',
    reminderBeforeDays: 1,
    reminderStartingTime: '09:00',
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const handleInputChange = (field: keyof DelegationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileArray]
      }));
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    // Simulate recording duration
    const interval = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    
    setTimeout(() => {
      clearInterval(interval);
      setIsRecording(false);
    }, 5000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Plus className="w-6 h-6 text-blue-600" />
          Add Delegation
        </h2>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign By
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option>Developer</option>
              <option>Manager</option>
              <option>Team Lead</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.taskName}
              onChange={(e) => handleInputChange('taskName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => handleInputChange('assignedTo', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Select One</option>
              <option value="mondal">Mondal</option>
              <option value="jane-smith">Jane Smith</option>
              <option value="mike-johnson">Mike Johnson</option>
            </select>
          </div>
        </div>

        {/* Date and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Planned Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.plannedDate}
              onChange={(e) => handleInputChange('plannedDate', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Message and Recording */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Add your message here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Audio Recording</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="text-sm text-red-500 mb-2">Use microphone for recording</div>
              <div className="flex items-center justify-center gap-4">
                <div className="text-sm">
                  {formatTime(recordingDuration)} / {formatTime(recordingDuration)}
                </div>
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={isRecording}
                  className={`p-2 rounded-full transition-colors ${
                    isRecording 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  REC
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="attachment-mandatory"
              checked={formData.makeAttachmentMandatory}
              onChange={(e) => handleInputChange('makeAttachmentMandatory', e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="attachment-mandatory" className="text-sm font-medium text-gray-700">
              Make Attachment Mandatory When Work Done
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="note-mandatory"
              checked={formData.makeNoteMandatory}
              onChange={(e) => handleInputChange('makeNoteMandatory', e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="note-mandatory" className="text-sm font-medium text-gray-700">
              Make Note Mandatory When Work Done
            </label>
          </div>
        </div>

        {/* File Upload and PC Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Media Upload</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Choose File</span> or drag and drop
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  *File upload limit: 500MB
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign PC</label>
            <select
              value={formData.assignedPC}
              onChange={(e) => handleInputChange('assignedPC', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select One</option>
              <option value="pc-001">PC-001</option>
              <option value="pc-002">PC-002</option>
              <option value="pc-003">PC-003</option>
            </select>
          </div>
        </div>

        {/* Group and Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
            <select
              value={formData.groupName}
              onChange={(e) => handleInputChange('groupName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select One</option>
              <option value="development">Development Team</option>
              <option value="design">Design Team</option>
              <option value="marketing">Marketing Team</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notify To (If Task Not Done)</label>
            <select
              value={formData.notifyTo}
              onChange={(e) => handleInputChange('notifyTo', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select One</option>
              <option value="manager">Manager</option>
              <option value="team-lead">Team Lead</option>
              <option value="hr">HR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Auditor</label>
            <select
              value={formData.auditor}
              onChange={(e) => handleInputChange('auditor', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select One</option>
              <option value="auditor-1">Auditor 1</option>
              <option value="auditor-2">Auditor 2</option>
            </select>
          </div>
        </div>

        {/* Notify Doer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Notify Doer (When task done)
          </label>
          <input
            type="text"
            value={formData.notifyDoer}
            onChange={(e) => handleInputChange('notifyDoer', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter notification details"
          />
        </div>

        {/* Reminder Settings */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              id="set-reminder"
              checked={formData.setReminder}
              onChange={(e) => handleInputChange('setReminder', e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="set-reminder" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Set Reminder
            </label>
          </div>

          {formData.setReminder && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Mode</label>
                <select
                  value={formData.reminderMode}
                  onChange={(e) => handleInputChange('reminderMode', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="Push">Push</option>
                  <option value="All">All</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Frequency</label>
                <select
                  value={formData.reminderFrequency}
                  onChange={(e) => handleInputChange('reminderFrequency', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Before Days</label>
                <input
                  type="number"
                  value={formData.reminderBeforeDays}
                  onChange={(e) => handleInputChange('reminderBeforeDays', parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Starting Time</label>
                <input
                  type="time"
                  value={formData.reminderStartingTime}
                  onChange={(e) => handleInputChange('reminderStartingTime', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Delegation
          </button>
        </div>
      </form>
    </div>
  );
};

export default DelegationForm;