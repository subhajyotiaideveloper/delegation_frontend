import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Search,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Delegation } from '../types/delegation';

interface CalendarProps {
  delegations: Delegation[];
  onCreateTask: () => void;
  onTaskClick: (delegation: Delegation) => void;
}

const Calendar: React.FC<CalendarProps> = ({ delegations, onCreateTask, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const today = new Date();
  
  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDate = new Date(firstDayOfMonth);
      prevDate.setDate(prevDate.getDate() - (firstDayOfWeek - i));
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        isSelected
      });
    }
    
    // Add empty cells to complete the grid (42 cells total for 6 weeks)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(lastDayOfMonth);
      nextDate.setDate(nextDate.getDate() + i);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }
    
    return days;
  }, [currentDate, selectedDate, today, firstDayOfWeek, daysInMonth, lastDayOfMonth]);

  // Filter delegations based on search and status
  const filteredDelegations = useMemo(() => {
    return delegations.filter(delegation => {
      const taskName = delegation.taskName || '';
      const assignedToName = delegation.assignedTo?.name || '';
      const matchesSearch =
        taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignedToName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || delegation.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [delegations, searchTerm, filterStatus]);

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return filteredDelegations.filter(delegation => 
      delegation.plannedDate === dateString
    );
  };

  // Navigation functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-3 h-3" />;
      case 'In Progress': return <Clock className="w-3 h-3" />;
      case 'Pending': return <AlertTriangle className="w-3 h-3" />;
      case 'Overdue': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                {formatMonthYear(currentDate)}
              </h2>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Today
            </button>
            <button
              onClick={onCreateTask}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {weekDays.map((day) => (
            <div key={day} className="p-4 text-center">
              <div className="text-sm font-medium text-gray-700">{day}</div>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const tasksForDay = getTasksForDate(day.date);
            const hasOverdue = tasksForDay.some(task => task.status === 'Overdue');
            const hasCompleted = tasksForDay.some(task => task.status === 'Completed');
            const hasInProgress = tasksForDay.some(task => task.status === 'In Progress');

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-b border-r border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${day.isSelected ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedDate(day.date)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${day.isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs' : ''}`}>
                    {day.date.getDate()}
                  </span>
                  {tasksForDay.length > 0 && (
                    <div className="flex space-x-1">
                      {hasOverdue && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                      {hasInProgress && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      {hasCompleted && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                    </div>
                  )}
                </div>

                {/* Tasks for this day */}
                <div className="space-y-1">
                  {tasksForDay.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                      className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(task.status)}
                        <span className="truncate">{task.taskName}</span>
                      </div>
                    </div>
                  ))}
                  {tasksForDay.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{tasksForDay.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tasks for {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {getTasksForDate(selectedDate).length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tasks scheduled for this date</p>
              <button
                onClick={onCreateTask}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {getTasksForDate(selectedDate).map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{task.taskName}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{task.assignedTo.name}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                          task.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {task.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Calendar Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Overdue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;