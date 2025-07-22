import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { PieChart } from './ui/PieChart';

const Analytics: React.FC = () => {
  type Performer = { name: string; completed: number };
  type Activity = { task: string; user: string; date: string };
  const [analyticsData, setAnalyticsData] = useState<{
    totalDelegations: number;
    completedDelegations: number;
    pendingDelegations: number;
    overdueDelegations: number;
    topPerformers: Performer[];
    recentActivity: Activity[];
  }>({
    totalDelegations: 0,
    completedDelegations: 0,
    pendingDelegations: 0,
    overdueDelegations: 0,
    topPerformers: [],
    recentActivity: []
  });
  useEffect(() => {
    fetch('https://delegation-backend.onrender.com/analytics')
      .then(res => res.json())
      .then(data => setAnalyticsData(data));
  }, []);
  const pieData = [
    { label: 'Completed', value: analyticsData.completedDelegations, color: '#22c55e' }, // green
    { label: 'Pending', value: analyticsData.pendingDelegations, color: '#eab308' }, // yellow
    { label: 'Overdue', value: analyticsData.overdueDelegations, color: '#ef4444' }, // red
  ];
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col items-center mb-8">
        <PieChart data={pieData} size={180} />
        <div className="flex gap-4 mt-4">
          {pieData.map((slice, idx) => (
            <div key={slice.label} className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full" style={{ background: slice.color }}></span>
              <span className="text-sm text-gray-700">{slice.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Delegations</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{analyticsData.totalDelegations}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-green-600">{analyticsData.completedDelegations}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-yellow-600">{analyticsData.pendingDelegations}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-red-600">{analyticsData.overdueDelegations}</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analyticsData.topPerformers.map((performer, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{performer.name}</span>
                  <span className="font-semibold">{performer.completed} completed</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analyticsData.recentActivity.map((activity, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{activity.task}</span>
                  <span className="text-gray-500">{activity.user} ({activity.date})</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
