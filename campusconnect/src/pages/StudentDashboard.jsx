import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  TrophyIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  // Progress calculation (using database schema fields)
  const requiredPoints = 100; // This could come from admin settings
  const progressPercentage = ((user?.total_points || 0) / requiredPoints) * 100;
  
  const [upcomingEvents] = useState([
    {
      id: 1,
      title: 'AI Workshop',
      club: 'Tech Club',
      date: 'Tomorrow',
      time: '2:00 PM - 4:00 PM',
      location: 'Computer Lab 1',
      points: 10,
      registered: true
    },
    {
      id: 2,
      title: 'Blood Donation Camp',
      club: 'NSS',
      date: 'Dec 28',
      time: '9:00 AM - 3:00 PM',
      location: 'Main Auditorium',
      points: 15,
      registered: false
    },
    {
      id: 3,
      title: 'Photography Contest',
      club: 'Photography Club',
      date: 'Dec 30',
      time: '10:00 AM - 5:00 PM',
      location: 'Campus Ground',
      points: 8,
      registered: false
    }
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      event: 'Cultural Fest Performance',
      points: 12,
      date: 'Dec 20, 2024',
      status: 'completed'
    },
    {
      id: 2,
      event: 'Environment Awareness Campaign',
      points: 8,
      date: 'Dec 18, 2024',
      status: 'completed'
    },
    {
      id: 3,
      event: 'Tech Talk on Machine Learning',
      points: 10,
      date: 'Dec 15, 2024',
      status: 'completed'
    }
  ]);

  const [aiRecommendations] = useState([
    {
      id: 1,
      title: 'Volunteer for Food Drive',
      reason: 'You need 15 more community service points',
      points: 12,
      match: 95
    },
    {
      id: 2,
      title: 'Join Research Symposium',
      reason: 'Based on your academic interests',
      points: 8,
      match: 88
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-600 mt-2">Track your activity points and discover new opportunities.</p>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Activity Points Progress</h2>
            <div className="text-3xl font-bold">
              {user?.total_points || 0} / {requiredPoints}
            </div>
            <p className="text-blue-100 mt-1">
              {requiredPoints - (user?.total_points || 0)} points remaining
            </p>
          </div>
          <div className="text-right">
            <TrophyIcon className="h-16 w-16 text-yellow-300 mb-2" />
            <div className="text-sm">
              {progressPercentage >= 100 ? 'Target Achieved!' : `${Math.round(progressPercentage)}% Complete`}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="bg-white bg-opacity-20 rounded-full h-3">
            <div 
              className="bg-yellow-300 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">by {event.club}</p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 mt-1 text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-green-600 font-medium">
                        <TrophyIcon className="h-4 w-4" />
                        <span>{event.points} pts</span>
                      </div>
                      
                      {event.registered ? (
                        <div className="flex items-center space-x-1 text-green-600 text-sm mt-2">
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>Registered</span>
                        </div>
                      ) : (
                        <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all events →
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.event}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-green-600 font-medium">
                      <TrophyIcon className="h-4 w-4" />
                      <span>+{activity.points}</span>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
              View full history →
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">AI Recommendations</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">Personalized event suggestions based on your interests and progress</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiRecommendations.map((rec) => (
              <div key={rec.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{rec.title}</h3>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {rec.match}% match
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-green-600 font-medium">
                    <TrophyIcon className="h-4 w-4" />
                    <span>{rec.points} points</span>
                  </div>
                  <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
