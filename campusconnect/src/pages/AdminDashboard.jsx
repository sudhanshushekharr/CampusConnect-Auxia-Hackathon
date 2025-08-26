import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StudentManagement from '../components/StudentManagement';
import ClubManagement from '../components/ClubManagement';
import EventManagement from '../components/EventManagement';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import FraudDetection from '../components/FraudDetection';
import {
  UsersIcon,
  BuildingOfficeIcon,
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  UserGroupIcon,
  EyeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Mock data for admin dashboard
  const [stats] = useState({
    totalStudents: 1250,
    totalClubs: 25,
    totalEvents: 156,
    totalPoints: 12450,
    activeEvents: 8,
    pendingApprovals: 5
  });

  const [recentActivities] = useState([
    { id: 1, type: 'event_created', message: 'Tech Club created "AI Workshop"', time: '2 hours ago' },
    { id: 2, type: 'student_registered', message: 'John Doe registered for Blood Donation Camp', time: '3 hours ago' },
    { id: 3, type: 'points_awarded', message: '15 points awarded to Sarah Wilson', time: '5 hours ago' },
    { id: 4, type: 'club_registered', message: 'New club "Photography Club" registered', time: '1 day ago' }
  ]);

  const [flaggedActivities] = useState([
    { id: 1, message: 'Suspicious check-in pattern detected for Student ID: STU001', severity: 'high' },
    { id: 2, message: 'Multiple same-location check-ins from different devices', severity: 'medium' },
    { id: 3, message: 'Event capacity exceeded: Blood Donation Camp', severity: 'low' }
  ]);

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} /> {/* Icon is used here */}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-600 mt-2">Here's what's happening at your campus today.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
              { id: 'students', name: 'Manage Students', icon: UsersIcon },
              { id: 'clubs', name: 'Manage Clubs', icon: UserGroupIcon },
              { id: 'events', name: 'View Events', icon: CalendarIcon },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
              { id: 'fraud', name: 'Fraud Detection', icon: ShieldCheckIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  currentView === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content based on current view */}
      {currentView === 'dashboard' && (
        <div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Total Students" 
              value={stats.totalStudents.toLocaleString()} 
              icon={UsersIcon}
              color="blue"
            />
            <StatCard 
              title="Active Clubs" 
              value={stats.totalClubs} 
              icon={BuildingOfficeIcon}
              color="green"
            />
            <StatCard 
              title="Total Events" 
              value={stats.totalEvents} 
              icon={CalendarIcon}
              color="purple"
            />
            <StatCard 
              title="Points Awarded" 
              value={stats.totalPoints.toLocaleString()} 
              icon={TrophyIcon}
              color="yellow"
            />
            <StatCard 
              title="Active Events" 
              value={stats.activeEvents} 
              icon={ChartBarIcon}
              color="indigo"
            />
            <StatCard 
              title="Pending Approvals" 
              value={stats.pendingApprovals} 
              icon={ExclamationTriangleIcon}
              color="red"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all activities →
                </button>
              </div>
            </div>

            {/* AI Fraud Detection Alerts */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">AI Fraud Detection</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {flaggedActivities.map((alert) => {
                    const severityColors = {
                      high: 'bg-red-50 border-red-200 text-red-800',
                      medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
                      low: 'bg-blue-50 border-blue-200 text-blue-800'
                    };
                    
                    return (
                      <div key={alert.id} className={`p-3 rounded-lg border ${severityColors[alert.severity]}`}>
                        <div className="flex items-start space-x-2">
                          <ExclamationTriangleIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{alert.message}</p>
                            <span className="text-xs uppercase font-semibold">
                              {alert.severity} priority
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all alerts →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => setCurrentView('students')}
                className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <UsersIcon className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">Manage Students</p>
                <p className="text-sm text-gray-500">View and manage student accounts</p>
              </button>
              <button 
                onClick={() => setCurrentView('clubs')}
                className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <BuildingOfficeIcon className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-medium text-gray-900">Manage Clubs</p>
                <p className="text-sm text-gray-500">Approve and manage clubs</p>
              </button>
              <button 
                onClick={() => setCurrentView('events')}
                className="p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <CalendarIcon className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">View Events</p>
                <p className="text-sm text-gray-500">Monitor all campus events</p>
              </button>
              <button 
                onClick={() => setCurrentView('analytics')}
                className="p-4 text-left border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
              >
                <ChartBarIcon className="h-6 w-6 text-yellow-600 mb-2" />
                <p className="font-medium text-gray-900">Analytics</p>
                <p className="text-sm text-gray-500">View detailed reports</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === 'students' && <StudentManagement />}
      {currentView === 'clubs' && <ClubManagement />}
      {currentView === 'events' && <EventManagement />}
      {currentView === 'analytics' && <AnalyticsDashboard />}
      {currentView === 'fraud' && <FraudDetection />}
    </div>
  );
};

export default AdminDashboard;
