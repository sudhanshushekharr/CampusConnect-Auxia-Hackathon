import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import EventCreationForm from '../components/EventCreationForm';
import EventList from '../components/EventList';
import { mockEvents } from '../data/mockData';
import {
  PlusIcon,
  UsersIcon,
  CalendarIcon,
  TrophyIcon,
  EyeIcon,
  ChartBarIcon,
  CheckCircleIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const ClubLeaderDashboard = () => {
  const { user } = useAuth();
  const [showEventForm, setShowEventForm] = useState(false);
  const [currentView, setCurrentView] = useState('overview'); // 'overview', 'events', 'analytics';
  const [events, setEvents] = useState(
    mockEvents.filter(event => event.cid === user?.clubData?.cid)
  );
  
  const [clubStats] = useState({
    totalMembers: 45,
    activeEvents: events.filter(e => e.status === 'upcoming').length,
    totalEvents: events.length,
    pointsAwarded: events.reduce((sum, e) => sum + (e.points * (e.registrations || 0)), 0)
  });

  const [upcomingEvents] = useState([
    {
      id: 1,
      title: 'AI Workshop',
      date: 'Tomorrow',
      time: '2:00 PM - 4:00 PM',
      location: 'Computer Lab 1',
      registrations: 25,
      capacity: 30,
      points: 10,
      status: 'active'
    },
    {
      id: 2,
      title: 'Tech Talk Series',
      date: 'Dec 30',
      time: '3:00 PM - 5:00 PM',
      location: 'Auditorium',
      registrations: 8,
      capacity: 50,
      points: 8,
      status: 'upcoming'
    }
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'registration',
      message: 'John Doe registered for AI Workshop',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'checkin',
      message: 'Sarah Wilson checked in to Coding Competition',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'event_completed',
      message: 'Web Development Workshop completed successfully',
      time: '3 days ago'
    }
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

  // Event handlers

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-600 mt-2">
          Managing {user?.clubData?.cname} • Student ID: {user?.sid} • USN: {user?.usn}
        </p>
      </div>

      {/* Club Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Club Members" 
          value={clubStats.totalMembers} 
          icon={UsersIcon}
          color="blue"
        />
        <StatCard 
          title="Active Events" 
          value={clubStats.activeEvents} 
          icon={CalendarIcon}
          color="green"
        />
        <StatCard 
          title="Total Events" 
          value={clubStats.totalEvents} 
          icon={ChartBarIcon}
          color="purple"
        />
        <StatCard 
          title="Points Awarded" 
          value={clubStats.pointsAwarded} 
          icon={TrophyIcon}
          color="yellow"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'events', name: 'Events', icon: CalendarIcon },
              { id: 'analytics', name: 'Analytics', icon: TrophyIcon }
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
        
        {/* Quick Actions */}
        {currentView === 'overview' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => setShowEventForm(true)}
                className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create Event</span>
              </button>

              <button 
                onClick={() => setCurrentView('analytics')}
                className="flex items-center justify-center space-x-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ChartBarIcon className="h-5 w-5" />
                <span>View Analytics</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content based on current view */}
      {currentView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events Summary */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div key={event.eid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event.ename}</p>
                      <p className="text-sm text-gray-500">{event.date} • {event.registrations}/{event.capacity} registered</p>
                    </div>
                    <div className="flex items-center space-x-2">

                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
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
                {recentActivities.map((activity) => {
                  const getActivityIcon = (type) => {
                    switch (type) {
                      case 'registration':
                        return <UsersIcon className="h-5 w-5 text-blue-500" />;
                      case 'checkin':
                        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
                      case 'event_completed':
                        return <TrophyIcon className="h-5 w-5 text-yellow-500" />;
                      default:
                        return <CalendarIcon className="h-5 w-5 text-gray-500" />;
                    }
                  };

                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Management View */}
      {currentView === 'events' && (
        <div>
          <EventList
            events={events}
            title={`${user?.clubData?.cname} Events`}
            onEdit={(event) => console.log('Edit event:', event)}
            onViewDetails={(event) => console.log('View details:', event)}
            showFilters={true}
          />
        </div>
      )}

      {/* Analytics View */}
      {currentView === 'analytics' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Registration Trends</h3>
              <div className="space-y-3">
                {events.filter(e => e.status === 'upcoming').map(event => (
                  <div key={event.eid}>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{event.ename}</span>
                      <span className="font-medium">{event.registrations}/{event.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Points Distribution</h3>
              <div className="space-y-2">
                {events.map(event => (
                  <div key={event.eid} className="flex justify-between text-sm">
                    <span className="text-gray-600">{event.ename}</span>
                    <span className="font-medium text-green-600">{event.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Creation Modal */}
      <EventCreationForm
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        onEventCreated={(newEvent) => {
          setEvents(prev => [...prev, newEvent]);
          console.log('Event created:', newEvent);
        }}
      />

      {/* Remaining original content below */}
      <div style={{ display: 'none' }}>
        {/* Hide old content temporarily */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.date} • {event.time}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <UsersIcon className="h-4 w-4" />
                        <span>{event.registrations}/{event.capacity}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrophyIcon className="h-4 w-4" />
                        <span>{event.points} pts</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MapPinIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress bar for registrations */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Registrations</span>
                      <span>{Math.round((event.registrations / event.capacity) * 100)}% filled</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                      ></div>
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
              {recentActivities.map((activity) => {
                const getActivityIcon = (type) => {
                  switch (type) {
                    case 'registration':
                      return <UsersIcon className="h-5 w-5 text-blue-500" />;
                    case 'checkin':
                      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
                    case 'event_completed':
                      return <TrophyIcon className="h-5 w-5 text-yellow-500" />;
                    default:
                      return <CalendarIcon className="h-5 w-5 text-gray-500" />;
                  }
                };

                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all activities →
            </button>
          </div>
        </div>
      </div>

      {/* Event Management Tips */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Management Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Location-Based Attendance</h3>
              <p className="text-sm text-gray-600 mt-1">Secure geolocation-based attendance tracking for events</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <ChartBarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Track Engagement</h3>
              <p className="text-sm text-gray-600 mt-1">Monitor attendance and member participation rates</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <TrophyIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Point Management</h3>
              <p className="text-sm text-gray-600 mt-1">Set appropriate points based on event complexity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Creation Form Modal */}
      {showEventForm && (
        <EventCreationForm
          onClose={() => setShowEventForm(false)}
          onEventCreated={(newEvent) => {
            setEvents([...events, { ...newEvent, id: events.length + 1, status: 'upcoming' }]);
            setShowEventForm(false);
          }}
        />
      )}


    </div>
  );
};

export default ClubLeaderDashboard;
