import React, { useState } from 'react';
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  TrophyIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { mockEvents } from '../data/mockData';

const EventManagement = () => {
  const [events] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const categories = ['technical', 'cultural', 'sports', 'social', 'academic', 'other'];
  const statuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.ename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || event.status === filterStatus;
    const matchesCategory = filterCategory === '' || event.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'technical':
        return 'bg-purple-100 text-purple-800';
      case 'cultural':
        return 'bg-pink-100 text-pink-800';
      case 'sports':
        return 'bg-green-100 text-green-800';
      case 'social':
        return 'bg-blue-100 text-blue-800';
      case 'academic':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
          <p className="text-gray-600">Monitor and manage all campus events</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'upcoming').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((acc, e) => acc + (e.registrations || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrophyIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Points Distributed</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((acc, e) => acc + e.points, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by name, club, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Club
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.eid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <CalendarIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{event.ename}</div>
                        <div className="text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(event.category)}`}>
                            {event.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.clubName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {event.date}
                    </div>
                    <div className="flex items-center mt-1">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {event.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {event.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {event.registrations || 0}/{event.capacity || 'N/A'}
                    </div>
                    {event.capacity && event.registrations && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((event.registrations / event.capacity) * 100, 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrophyIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{event.points}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(event)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Event Details</h3>
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                  <h4 className="text-xl font-semibold mb-2">{selectedEvent.ename}</h4>
                  <p className="text-blue-100">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Club:</span>
                      <span className="text-sm font-medium">{selectedEvent.clubName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="text-sm font-medium">{selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Time:</span>
                      <span className="text-sm font-medium">{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="text-sm font-medium">{selectedEvent.location}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <TrophyIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Points:</span>
                      <span className="text-sm font-medium">{selectedEvent.points}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Capacity:</span>
                      <span className="text-sm font-medium">{selectedEvent.capacity || 'Unlimited'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Registered:</span>
                      <span className="text-sm font-medium">{selectedEvent.registrations || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                        {selectedEvent.status}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedEvent.registrations && selectedEvent.capacity && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Registration Progress</h5>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full flex items-center justify-center text-xs text-white font-medium" 
                        style={{ width: `${Math.min((selectedEvent.registrations / selectedEvent.capacity) * 100, 100)}%` }}
                      >
                        {Math.round((selectedEvent.registrations / selectedEvent.capacity) * 100)}%
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedEvent.registrations} of {selectedEvent.capacity} spots filled
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
