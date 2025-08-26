import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const EventList = ({ 
  events = [], 
  onRegister, 
  onUnregister, 
  onEdit, 
  onViewDetails,
  onMarkAttendance,
  showFilters = true,
  showAttendanceButton = false,
  title = "Events",
  emptyMessage = "No events found"
}) => {
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    sortBy: 'date'
  });
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technical', label: 'Technical' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'social', label: 'Social Service' },
    { value: 'academic', label: 'Academic' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'competition', label: 'Competition' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'points', label: 'Points' },
    { value: 'name', label: 'Name' },
    { value: 'registrations', label: 'Popularity' }
  ];

  useEffect(() => {
    let filtered = [...events];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(event =>
        event.ename.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(event => event.status === filters.status);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time);
        case 'points':
          return b.points - a.points;
        case 'name':
          return a.ename.localeCompare(b.ename);
        case 'registrations':
          return (b.registrations || 0) - (a.registrations || 0);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [events, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      status: 'all',
      sortBy: 'date'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== 'all' && value !== 'date'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
          </p>
        </div>

        {showFilters && (
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Search Bar */}
      {showFilters && (
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && showFiltersPanel && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-white"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.eid}
              event={event}
              onRegister={onRegister}
              onUnregister={onUnregister}
              onEdit={onEdit}
              onViewDetails={onViewDetails}
              onMarkAttendance={onMarkAttendance}
              showAttendanceButton={showAttendanceButton}
              showActions={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
          <p className="text-gray-600">
            {filters.search || filters.category !== 'all' || filters.status !== 'all' 
              ? 'Try adjusting your filters to see more events.'
              : 'Check back later for new events.'}
          </p>
          {(filters.search || filters.category !== 'all' || filters.status !== 'all') && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventList;
