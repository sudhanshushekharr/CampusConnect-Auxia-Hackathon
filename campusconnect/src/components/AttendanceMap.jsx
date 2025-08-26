import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const eventIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to fit map bounds
const FitBounds = ({ eventLocation, userLocation, radius }) => {
  const map = useMap();

  useEffect(() => {
    if (eventLocation && userLocation) {
      const bounds = L.latLngBounds([
        [eventLocation.latitude, eventLocation.longitude],
        [userLocation.latitude, userLocation.longitude]
      ]);
      
      // Extend bounds to include the radius circle
      const radiusInDegrees = radius / 111320; // Approximate conversion from meters to degrees
      bounds.extend([
        eventLocation.latitude + radiusInDegrees,
        eventLocation.longitude + radiusInDegrees
      ]);
      bounds.extend([
        eventLocation.latitude - radiusInDegrees,
        eventLocation.longitude - radiusInDegrees
      ]);
      
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (eventLocation) {
      map.setView([eventLocation.latitude, eventLocation.longitude], 16);
    }
  }, [map, eventLocation, userLocation, radius]);

  return null;
};

const AttendanceMap = ({ 
  eventLocation, 
  userLocation, 
  eventName, 
  distance, 
  isVerified,
  locationAddress 
}) => {
  const mapRef = useRef();

  // Calculate map center
  const getMapCenter = () => {
    if (userLocation && eventLocation) {
      return [
        (userLocation.latitude + eventLocation.latitude) / 2,
        (userLocation.longitude + eventLocation.longitude) / 2
      ];
    } else if (eventLocation) {
      return [eventLocation.latitude, eventLocation.longitude];
    }
    return [12.9716, 77.5946]; // Default to Bangalore
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Map Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Event Location Map</h3>
            <p className="text-blue-100 text-sm">
              {distance !== null ? `${distance}m from event location` : 'Locating...'}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isVerified 
              ? 'bg-green-500 text-white' 
              : distance !== null && distance <= eventLocation.radius 
                ? 'bg-yellow-500 text-white' 
                : 'bg-red-500 text-white'
          }`}>
            {isVerified 
              ? '✓ Verified' 
              : distance !== null && distance <= eventLocation.radius 
                ? '⚡ In Range' 
                : '❌ Too Far'
            }
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-80 relative">
        <MapContainer
          ref={mapRef}
          center={getMapCenter()}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Event Location Marker */}
          {eventLocation && (
            <>
              <Marker 
                position={[eventLocation.latitude, eventLocation.longitude]} 
                icon={eventIcon}
              >
                <Popup className="custom-popup">
                  <div className="p-2">
                    <h4 className="font-semibold text-red-600 mb-1">📍 Event Location</h4>
                    <p className="text-sm font-medium">{eventName}</p>
                    <p className="text-xs text-gray-600 mt-1">{eventLocation.address}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Required radius: {eventLocation.radius}m
                    </p>
                  </div>
                </Popup>
              </Marker>

              {/* Attendance Radius Circle */}
              <Circle
                center={[eventLocation.latitude, eventLocation.longitude]}
                radius={eventLocation.radius}
                pathOptions={{
                  color: isVerified ? '#10B981' : distance <= eventLocation.radius ? '#F59E0B' : '#EF4444',
                  fillColor: isVerified ? '#10B981' : distance <= eventLocation.radius ? '#F59E0B' : '#EF4444',
                  fillOpacity: 0.1,
                  weight: 2
                }}
              />
            </>
          )}

          {/* User Location Marker */}
          {userLocation && (
            <Marker 
              position={[userLocation.latitude, userLocation.longitude]} 
              icon={userIcon}
            >
              <Popup className="custom-popup">
                <div className="p-2">
                  <h4 className="font-semibold text-blue-600 mb-1">📱 Your Location</h4>
                  {locationAddress && (
                    <p className="text-sm">{locationAddress.road || locationAddress.display_name}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">
                    Accuracy: ±{userLocation.accuracy}m
                  </p>
                  <p className="text-xs text-gray-600">
                    {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Auto-fit bounds */}
          <FitBounds 
            eventLocation={eventLocation} 
            userLocation={userLocation} 
            radius={eventLocation?.radius || 100} 
          />
        </MapContainer>

        {/* Loading Overlay */}
        {!userLocation && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Getting your location...</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="bg-gray-50 px-4 py-3 border-t">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Event Location</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Your Location</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${
                isVerified ? 'bg-green-500' : distance <= eventLocation?.radius ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-gray-600">Attendance Zone</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Powered by OpenStreetMap
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceMap;
