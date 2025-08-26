import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TrophyIcon,
  UsersIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const EventCard = ({ event, onRegister, onUnregister, onEdit, onViewDetails, onMarkAttendance, showActions = true, showAttendanceButton = false }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const isRegistered = event.registeredStudents?.includes(user?.sid);
  const isFull = event.registrations >= event.capacity;
  const isClubLeader = user?.role === 'club_leader' && user?.clubData?.cid === event.cid;
  const canRegister = user?.role === 'student' && !isRegistered && !isFull;
  const isUpcoming = new Date(event.date + 'T' + event.time) > new Date();
  
  // Debug logging
  console.log('EventCard Debug:', {
    eventName: event.ename,
    isRegistered,
    isUpcoming,
    userRole: user?.role,
    showAttendanceButton,
    onMarkAttendance: !!onMarkAttendance,
    eventDate: event.date + 'T' + event.time,
    currentDate: new Date().toISOString()
  });

  const getCategoryColor = (category) => {
    const colors = {
      technical: 'bg-blue-100 text-blue-800',
      cultural: 'bg-purple-100 text-purple-800',
      sports: 'bg-green-100 text-green-800',
      social: 'bg-yellow-100 text-yellow-800',
      academic: 'bg-indigo-100 text-indigo-800',
      workshop: 'bg-pink-100 text-pink-800',
      competition: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleRegister = async () => {
    if (!canRegister) return;
    
    setLoading(true);
    try {
      await onRegister(event.eid);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!isRegistered) return;
    
    setLoading(true);
    try {
      await onUnregister(event.eid);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Event Poster */}
      {event.poster && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img 
            src={event.poster} 
            alt={event.ename}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Header with Title and Category */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {event.ename}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {event.description}
            </p>
          </div>
          <div className="ml-3 flex flex-col items-end space-y-1">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{event.duration}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <UsersIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{event.registrations || 0}/{event.capacity}</span>
              {isFull && <span className="ml-2 text-red-600 font-medium">(Full)</span>}
            </div>
            
            <div className="flex items-center text-sm font-medium text-green-600">
              <TrophyIcon className="h-4 w-4 mr-1" />
              <span>{event.points} pts</span>
            </div>
          </div>
        </div>

        {/* Registration Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Registration</span>
            <span>{Math.round((event.registrations || 0) / event.capacity * 100)}% filled</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                isFull ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min((event.registrations || 0) / event.capacity * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Registration Status for Students */}
        {user?.role === 'student' && isRegistered && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center text-green-800">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">You're registered for this event</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => onViewDetails(event)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <EyeIcon className="h-4 w-4" />
              <span>View Details</span>
            </button>

            <div className="flex items-center space-x-2">
              {/* Student Actions */}
              {user?.role === 'student' && (
                <>
                  {canRegister && (
                    <button
                      onClick={handleRegister}
                      disabled={loading}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Registering...' : 'Register'}
                    </button>
                  )}
                  
                  {isRegistered && (
                    <>
                      <button
                        onClick={handleUnregister}
                        disabled={loading}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Unregistering...' : 'Unregister'}
                      </button>
                      
                      {/* Attendance Button */}
                      {showAttendanceButton && onMarkAttendance && (
                        <button
                          onClick={() => onMarkAttendance(event)}
                          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center space-x-1"
                          title="Mark Attendance with Location"
                        >
                          <MapPinIcon className="h-4 w-4" />
                          <span>Mark Attendance</span>
                        </button>
                      )}
                    </>
                  )}
                  
                  {isFull && !isRegistered && (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-md">
                      Full
                    </span>
                  )}
                </>
              )}

              {/* Club Leader Actions */}
              {isClubLeader && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(event)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit Event"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  

                </div>
              )}
            </div>
          </div>
        )}

        {/* Club Info */}
        {event.clubName && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Organized by <span className="font-medium text-gray-700">{event.clubName}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
