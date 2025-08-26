import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EventList from '../components/EventList';
import GeolocationAttendance from '../components/GeolocationAttendance';
import { mockEvents } from '../data/mockData';
import { eventsAPI } from '../services/api';
import {
  TrophyIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
  SparklesIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'events', 'history'
  const [registeredEvents, setRegisteredEvents] = useState([1, 4]); // Mock registered event IDs
  const [showLocationAttendance, setShowLocationAttendance] = useState(false);
  const [selectedEventForAttendance, setSelectedEventForAttendance] = useState(null);
  
  // Progress calculation
  const requiredPoints = 100; 
  const progressPercentage = ((user?.total_points || 0) / requiredPoints) * 100;
  
  // Upcoming events
  const allUpcomingEvents = mockEvents.filter(event => event.status === 'upcoming');
  
  const eventsWithRegistration = allUpcomingEvents.map(event => ({
    ...event,
    isRegistered: registeredEvents.includes(event.eid),
    registeredStudents: registeredEvents.includes(event.eid) ? [user?.sid] : []
  }));

  // Event handlers
  const handleRegister = async (eid) => {
    try {
      console.log('Attempting to register for event:', eid);
      
      // Try backend API first
      try {
        const response = await eventsAPI.register(eid);
        if (response.success) {
          setRegisteredEvents(prev => {
            const updated = [...prev, eid];
            console.log('Successfully registered via API:', updated);
            return updated;
          });
          return;
        }
      } catch (apiError) {
        console.warn('Backend API not available, using mock registration:', apiError);
      }
      
      // Fallback to mock behavior
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRegisteredEvents(prev => {
        const updated = [...prev, eid];
        console.log('Updated registered events (mock):', updated);
        return updated;
      });
      console.log('Successfully registered for event:', eid);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleUnregister = async (eid) => {
    try {
      // Try backend API first
      try {
        const response = await eventsAPI.unregister(eid);
        if (response.success) {
          setRegisteredEvents(prev => prev.filter(id => id !== eid));
          console.log('Successfully unregistered via API:', eid);
          return;
        }
      } catch (apiError) {
        console.warn('Backend API not available, using mock unregistration:', apiError);
      }
      
      // Fallback to mock behavior
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRegisteredEvents(prev => prev.filter(id => id !== eid));
      console.log('Unregistered from event:', eid);
    } catch (error) {
      console.error('Unregistration failed:', error);
    }
  };

  const handleMarkAttendance = (event) => {
    setSelectedEventForAttendance(event);
    setShowLocationAttendance(true);
  };

  const handleAttendanceMarked = (attendanceData) => {
    console.log('Attendance marked with location data:', attendanceData);
    // Here you would typically update the user's points and attendance records
    // For now, we'll just close the modal
    setTimeout(() => {
      setShowLocationAttendance(false);
      setSelectedEventForAttendance(null);
    }, 2000);
  };
  
  const [mockUpcomingEvents] = useState([
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

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: TrophyIcon },
              { id: 'events', name: 'Discover Events', icon: MagnifyingGlassIcon },
              { id: 'history', name: 'My Events', icon: CalendarIcon }
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
          {/* Upcoming + Recent */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {eventsWithRegistration.slice(0, 3).map((event) => (
                    <div key={event.eid} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{event.ename}</h3>
                          <p className="text-sm text-gray-600 mt-1">by {event.clubName}</p>
                          
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
                          
                          {event.isRegistered ? (
                            <div className="flex items-center space-x-1 text-green-600 text-sm mt-2">
                              <CheckCircleIcon className="h-4 w-4" />
                              <span>Registered</span>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleRegister(event.eid)}
                              className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                              Register
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentView('events')}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
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
      )}

      {/* Event Discovery View */}
      {currentView === 'events' && (
        <div>
          <EventList
            events={eventsWithRegistration}
            title="Discover Events"
            onRegister={handleRegister}
            onUnregister={handleUnregister}
            onViewDetails={(event) => console.log('View details:', event)}
            showFilters={true}
            emptyMessage="No events available at the moment"
          />
        </div>
      )}

      {/* My Events History View */}
      {currentView === 'history' && (
        <div>
          <EventList
            events={mockEvents.filter(event => registeredEvents.includes(event.eid))}
            title="My Registered Events"
            onRegister={handleRegister}
            onUnregister={handleUnregister}
            onMarkAttendance={handleMarkAttendance}
            onViewDetails={(event) => console.log('View details:', event)}
            showFilters={false}
            showAttendanceButton={true}
            emptyMessage="You haven't registered for any events yet"
          />
        </div>
      )}

      {/* Geolocation Attendance Modal */}
      {showLocationAttendance && selectedEventForAttendance && (
        <GeolocationAttendance
          event={selectedEventForAttendance}
          onClose={() => {
            setShowLocationAttendance(false);
            setSelectedEventForAttendance(null);
          }}
          onAttendanceMarked={handleAttendanceMarked}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
