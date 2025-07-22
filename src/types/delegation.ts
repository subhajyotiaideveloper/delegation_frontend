export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface Delegation {
  id: string;
  taskName: string;
  assignedBy: User;
  assignedTo: User;
  plannedDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  audioRecording?: string;
  attachments: File[];
  assignedPC?: string;
  groupName?: string;
  notifyTo?: User;
  auditor?: User;
  makeAttachmentMandatory: boolean;
  makeNoteMandatory: boolean;
  notifyDoer: string;
  setReminder: boolean;
  reminderMode?: 'Email' | 'SMS' | 'Push' | 'All';
  reminderFrequency?: 'Daily' | 'Weekly' | 'Monthly';
  reminderBeforeDays?: number;
  reminderStartingTime?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface DelegationFormData {
  taskName: string;
  assignedTo: string;
  plannedDate: string;
  priority: string;
  message: string;
  audioRecording?: string;
  attachments: File[];
  assignedPC?: string;
  groupName?: string;
  notifyTo?: string;
  auditor?: string;
  makeAttachmentMandatory: boolean;
  makeNoteMandatory: boolean;
  notifyDoer: string;
  setReminder: boolean;
  reminderMode?: string;
  reminderFrequency?: string;
  reminderBeforeDays?: number;
  reminderStartingTime?: string;
}