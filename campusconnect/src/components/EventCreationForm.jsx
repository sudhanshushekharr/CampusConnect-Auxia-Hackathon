import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TrophyIcon,
  PhotoIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const EventCreationForm = ({ isOpen, onClose, onEventCreated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    ename: '',
    description: '',
    duration: '',
    points: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    category: 'technical',
    poster: null
  });
  const [errors, setErrors] = useState({});

  const eventCategories = [
    { value: 'technical', label: 'Technical' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'social', label: 'Social Service' },
    { value: 'academic', label: 'Academic' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'competition', label: 'Competition' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          poster: 'File size must be less than 5MB'
        }));
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          poster: 'Please select an image file'
        }));
        return;
      }
      
      setEventData(prev => ({
        ...prev,
        poster: file
      }));
      
      if (errors.poster) {
        setErrors(prev => ({
          ...prev,
          poster: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!eventData.ename.trim()) newErrors.ename = 'Event name is required';
    if (!eventData.description.trim()) newErrors.description = 'Description is required';
    if (!eventData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!eventData.points || eventData.points < 1) newErrors.points = 'Points must be at least 1';
    if (!eventData.date) newErrors.date = 'Date is required';
    if (!eventData.time) newErrors.time = 'Time is required';
    if (!eventData.location.trim()) newErrors.location = 'Location is required';
    if (!eventData.capacity || eventData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    
    // Validate date is not in the past
    const selectedDate = new Date(eventData.date + 'T' + eventData.time);
    if (selectedDate <= new Date()) {
      newErrors.date = 'Event date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newEvent = {
        eid: Date.now(), // Mock ID generation
        ...eventData,
        cid: user.clubData.cid,
        points: parseInt(eventData.points),
        capacity: parseInt(eventData.capacity),
        registrations: 0,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
        createdBy: user.sid
      };
      
      console.log('Event created:', newEvent);
      
      // Call parent callback
      if (onEventCreated) {
        onEventCreated(newEvent);
      }
      
      // Reset form
      setEventData({
        ename: '',
        description: '',
        duration: '',
        points: '',
        date: '',
        time: '',
        location: '',
        capacity: '',
        category: 'technical',
        poster: null
      });
      
      onClose();
      
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({ submit: 'Failed to create event. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Create New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={loading}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name *
            </label>
            <input
              type="text"
              name="ename"
              value={eventData.ename}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event name"
              disabled={loading}
            />
            {errors.ename && <p className="text-red-600 text-sm mt-1">{errors.ename}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your event..."
              disabled={loading}
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Category and Points Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={eventData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {eventCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points *
              </label>
              <div className="relative">
                <TrophyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="points"
                  value={eventData.points}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Points"
                  disabled={loading}
                />
              </div>
              {errors.points && <p className="text-red-600 text-sm mt-1">{errors.points}</p>}
            </div>
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time *
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="time"
                  name="time"
                  value={eventData.time}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              {errors.time && <p className="text-red-600 text-sm mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Duration and Capacity Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={eventData.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2 hours, 1 day"
                disabled={loading}
              />
              {errors.duration && <p className="text-red-600 text-sm mt-1">{errors.duration}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity *
              </label>
              <div className="relative">
                <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="capacity"
                  value={eventData.capacity}
                  onChange={handleChange}
                  min="1"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max participants"
                  disabled={loading}
                />
              </div>
              {errors.capacity && <p className="text-red-600 text-sm mt-1">{errors.capacity}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event venue"
                disabled={loading}
              />
            </div>
            {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* Poster Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Poster
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="poster-upload"
                disabled={loading}
              />
              <label
                htmlFor="poster-upload"
                className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
              >
                Click to upload poster
              </label>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              {eventData.poster && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {eventData.poster.name}
                </p>
              )}
            </div>
            {errors.poster && <p className="text-red-600 text-sm mt-1">{errors.poster}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              <span>{loading ? 'Creating...' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreationForm;
