import React, { useState, useEffect } from 'react';
import AttendanceMap from './AttendanceMap';
import { attendanceAPI } from '../services/api';
import {
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ShieldCheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const GeolocationAttendance = ({ event, onClose, onAttendanceMarked }) => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState('pending');
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [distanceFromEvent, setDistanceFromEvent] = useState(null);
  const [locationAddress, setLocationAddress] = useState(null);
  const [isGettingAddress, setIsGettingAddress] = useState(false);

  // Event location (in real app, this would come from the event data)
  const eventLocation = {
    latitude: event.latitude || 12.9716, // Bangalore coordinates as default
    longitude: event.longitude || 77.5946,
    radius: event.locationRadius || 100, // 100 meters radius
    address: event.location
  };

  // Get readable address from coordinates using OpenStreetMap
  const getAddressFromCoordinates = async (latitude, longitude) => {
    setIsGettingAddress(true);
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.address) {
        const address = {
          country: data.address.country || 'Unknown',
          state: data.address.state || data.address.region || 'Unknown',
          city: data.address.city || data.address.town || data.address.village || 'Unknown',
          road: data.address.road || 'Unknown',
          postcode: data.address.postcode || '',
          display_name: data.display_name || 'Unknown location'
        };
        
        setLocationAddress(address);
        return address;
      }
    } catch (error) {
      console.error('Error getting address:', error);
      setLocationAddress({
        country: 'Unknown',
        state: 'Unknown', 
        city: 'Unknown',
        display_name: 'Address lookup failed'
      });
    } finally {
      setIsGettingAddress(false);
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // Cache for 1 minute
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp)
        };

        setLocation(userLocation);
        setLocationAccuracy(position.coords.accuracy);

        // Calculate distance from event location
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          eventLocation.latitude,
          eventLocation.longitude
        );

        setDistanceFromEvent(Math.round(distance));

        // Get readable address from coordinates
        await getAddressFromCoordinates(userLocation.latitude, userLocation.longitude);

        setIsLoading(false);

        // Verify if user is within the allowed radius
        if (distance <= eventLocation.radius) {
          setAttendanceStatus('verified');
        } else {
          setAttendanceStatus('too_far');
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while retrieving location.';
            break;
        }

        setLocationError(errorMessage);
        setAttendanceStatus('error');
        setIsLoading(false);
      },
      options
    );
  };

  const markAttendance = async () => {
    if (attendanceStatus !== 'verified') {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for backend API
      const attendanceData = {
        eid: event.eid,
        studentLocation: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: locationAccuracy
        },
        locationAddress: locationAddress,
        deviceInfo: {
          platform: 'web',
          userAgent: navigator.userAgent
        }
      };

      // Call backend API
      const response = await attendanceAPI.markAttendance(attendanceData);
      
      if (response.success) {
        console.log('Attendance marked successfully:', response.data);
        setAttendanceStatus('marked');
        
        // Notify parent component
        if (onAttendanceMarked) {
          onAttendanceMarked(response.data);
        }
      } else {
        throw new Error(response.message || 'Failed to mark attendance');
      }

    } catch (error) {
      console.error('Failed to mark attendance:', error);
      setAttendanceStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-get location when component mounts
    getCurrentLocation();
  }, []);

  const getStatusIcon = () => {
    switch (attendanceStatus) {
      case 'verified':
        return <CheckCircleIcon className="h-8 w-8 text-green-600" />;
      case 'too_far':
        return <XCircleIcon className="h-8 w-8 text-red-600" />;
      case 'marked':
        return <CheckCircleIcon className="h-8 w-8 text-green-600" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />;
      default:
        return <MapPinIcon className="h-8 w-8 text-blue-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (attendanceStatus) {
      case 'verified':
        return 'Location verified! You can mark attendance.';
      case 'too_far':
        return `You are ${distanceFromEvent}m away from the event location. Please move closer (within ${eventLocation.radius}m).`;
      case 'marked':
        return 'Attendance marked successfully!';
      case 'error':
        return locationError || 'Unable to verify location.';
      default:
        return 'Verifying your location...';
    }
  };

  const getStatusColor = () => {
    switch (attendanceStatus) {
      case 'verified':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'too_far':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'marked':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <MapPinIcon className="h-8 w-8 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Location-Based Attendance</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Event Information */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
          <h4 className="text-xl font-semibold mb-4">{event.ename}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <MapPinIcon className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5" />
              <span>{event.date} • {event.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="h-5 w-5" />
              <span>Radius: {eventLocation.radius}m</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5" />
              <span>GPS Verified</span>
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="mb-6">
          <AttendanceMap
            eventLocation={eventLocation}
            userLocation={location}
            eventName={event.ename}
            distance={distanceFromEvent}
            isVerified={attendanceStatus === 'verified'}
            locationAddress={locationAddress}
          />
        </div>

        {/* Location Status */}
        <div className={`border rounded-lg p-6 mb-6 ${getStatusColor()}`}>
          <div className="flex items-center space-x-4">
            {getStatusIcon()}
            <div className="flex-1">
              <h5 className="font-semibold text-lg mb-2">Location Status</h5>
              <p className="mb-4">{getStatusMessage()}</p>
              
              {location && (
                <div className="space-y-4">
                  {/* Address Information */}
                  {isGettingAddress && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Getting address...</span>
                    </div>
                  )}
                  
                  {locationAddress && (
                    <div className="bg-white bg-opacity-50 rounded-lg p-3 border">
                      <strong className="text-sm">Your Address:</strong>
                      <p className="text-sm mt-1">{locationAddress.display_name}</p>
                      {locationAddress.road !== 'Unknown' && (
                        <p className="text-xs text-gray-600 mt-1">
                          {locationAddress.road}, {locationAddress.city}, {locationAddress.state}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>GPS Coordinates:</strong>
                      <br />
                      Lat: {location.latitude.toFixed(6)}
                      <br />
                      Lng: {location.longitude.toFixed(6)}
                    </div>
                    <div>
                      <strong>Accuracy:</strong> ±{locationAccuracy}m
                      <br />
                      <strong>Distance:</strong> {distanceFromEvent}m
                      <br />
                      <strong>Required:</strong> Within {eventLocation.radius}m
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location Verification Details */}
        {location && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
              <EyeIcon className="h-5 w-5 mr-2" />
              Verification Details
            </h5>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>GPS Accuracy</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  locationAccuracy <= 10 ? 'bg-green-100 text-green-800' :
                  locationAccuracy <= 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  ±{locationAccuracy}m ({locationAccuracy <= 10 ? 'Excellent' : locationAccuracy <= 50 ? 'Good' : 'Poor'})
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Distance from Event</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  distanceFromEvent <= eventLocation.radius ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {distanceFromEvent}m
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Location Timestamp</span>
                <span className="text-sm text-gray-600">
                  {location.timestamp.toLocaleTimeString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Address Lookup</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  locationAddress ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {locationAddress ? '✓ Complete' : '⏳ Loading'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Verification Status</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  attendanceStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {attendanceStatus === 'verified' ? '✓ Verified' : '✗ Not Verified'}
                </span>
              </div>
            </div>
          </div>
        )}



        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          {attendanceStatus === 'pending' && (
            <button
              onClick={getCurrentLocation}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Getting Location...</span>
                </>
              ) : (
                <>
                  <MapPinIcon className="h-5 w-5" />
                  <span>Verify Location</span>
                </>
              )}
            </button>
          )}

          {attendanceStatus === 'verified' && (
            <button
              onClick={markAttendance}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Marking Attendance...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Mark Attendance</span>
                </>
              )}
            </button>
          )}

          {attendanceStatus === 'too_far' && (
            <div className="space-y-3">
              <button
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <MapPinIcon className="h-5 w-5" />
                <span>Retry Location Check</span>
              </button>
              <p className="text-center text-sm text-gray-600">
                Move closer to the event location and retry
              </p>
            </div>
          )}

          {attendanceStatus === 'marked' && (
            <div className="text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-green-600 mb-2">Attendance Marked!</h4>
              <p className="text-sm text-gray-600 mb-4">
                Your attendance has been successfully recorded with location verification.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {(attendanceStatus === 'error' || attendanceStatus === 'too_far') && (
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span>Close</span>
            </button>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            Security & Privacy
          </h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Your location is only used to verify event attendance</li>
            <li>• Address lookup uses OpenStreetMap for location verification</li>
            <li>• Location data is encrypted and stored securely</li>
            <li>• GPS accuracy and timestamp are recorded for authenticity</li>
            <li>• Location sharing can be disabled after marking attendance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeolocationAttendance;
