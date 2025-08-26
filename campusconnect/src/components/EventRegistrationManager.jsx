import React, { useState, createContext, useContext } from 'react';

// Event Registration Context
const EventRegistrationContext = createContext();

// Mock registration data (in real app, this would come from backend)
const mockRegistrations = [
  { eid: 1, sid: 1, registeredAt: '2024-12-25T10:00:00Z', status: 'confirmed' },
  { eid: 4, sid: 1, registeredAt: '2024-12-15T14:00:00Z', status: 'confirmed' },
  { eid: 5, sid: 1, registeredAt: '2024-12-12T09:00:00Z', status: 'confirmed' },
];

export const EventRegistrationProvider = ({ children }) => {
  const [registrations, setRegistrations] = useState(mockRegistrations);
  const [loading, setLoading] = useState(false);

  // Check if user is registered for an event
  const isRegistered = (eid, sid) => {
    return registrations.some(reg => reg.eid === eid && reg.sid === sid);
  };

  // Get user's registrations
  const getUserRegistrations = (sid) => {
    return registrations.filter(reg => reg.sid === sid);
  };

  // Get event registrations
  const getEventRegistrations = (eid) => {
    return registrations.filter(reg => reg.eid === eid);
  };

  // Register for event
  const registerForEvent = async (eid, sid) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRegistration = {
        eid,
        sid,
        registeredAt: new Date().toISOString(),
        status: 'confirmed'
      };
      
      setRegistrations(prev => [...prev, newRegistration]);
      
      return { success: true, message: 'Successfully registered for event!' };
    } catch (error) {
      return { success: false, message: 'Failed to register. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // Unregister from event
  const unregisterFromEvent = async (eid, sid) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRegistrations(prev => 
        prev.filter(reg => !(reg.eid === eid && reg.sid === sid))
      );
      
      return { success: true, message: 'Successfully unregistered from event!' };
    } catch (error) {
      return { success: false, message: 'Failed to unregister. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // Get registration statistics for an event
  const getEventStats = (eid, capacity) => {
    const eventRegistrations = getEventRegistrations(eid);
    const registrationCount = eventRegistrations.length;
    
    return {
      registered: registrationCount,
      capacity,
      available: capacity - registrationCount,
      fillPercentage: Math.round((registrationCount / capacity) * 100),
      isFull: registrationCount >= capacity
    };
  };

  const value = {
    registrations,
    loading,
    isRegistered,
    getUserRegistrations,
    getEventRegistrations,
    registerForEvent,
    unregisterFromEvent,
    getEventStats
  };

  return (
    <EventRegistrationContext.Provider value={value}>
      {children}
    </EventRegistrationContext.Provider>
  );
};

export const useEventRegistration = () => {
  const context = useContext(EventRegistrationContext);
  if (!context) {
    throw new Error('useEventRegistration must be used within EventRegistrationProvider');
  }
  return context;
};

// Hook for easy registration management in components
export const useEventActions = (eventId, userId) => {
  const {
    isRegistered,
    registerForEvent,
    unregisterFromEvent,
    loading,
    getEventStats
  } = useEventRegistration();

  const [notification, setNotification] = useState(null);

  const handleRegister = async () => {
    const result = await registerForEvent(eventId, userId);
    setNotification(result);
    
    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
    
    return result;
  };

  const handleUnregister = async () => {
    const result = await unregisterFromEvent(eventId, userId);
    setNotification(result);
    
    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
    
    return result;
  };

  return {
    isUserRegistered: isRegistered(eventId, userId),
    handleRegister,
    handleUnregister,
    loading,
    notification,
    getEventStats
  };
};
