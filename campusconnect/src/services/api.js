// API Service layer for backend integration
// This structure is ready for your friend's backend implementation

const API_BASE_URL = 'http://localhost:5012/api';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authentication token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  // POST /api/auth/login
  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // POST /api/auth/logout
  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },

  // GET /api/auth/me
  getCurrentUser: async () => {
    return apiCall('/auth/me');
  },
};

// Students API calls
export const studentsAPI = {
  // GET /api/students/:sid
  getById: (sid) => apiCall(`/students/${sid}`),
  
  // GET /api/students
  getAll: () => apiCall('/students'),
  
  // PUT /api/students/:sid
  update: (sid, data) => apiCall(`/students/${sid}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // GET /api/students/:sid/activity-points
  getActivityPoints: (sid) => apiCall(`/students/${sid}/activity-points`),
  
  // GET /api/students/:sid/attendance
  getAttendance: (sid) => apiCall(`/students/${sid}/attendance`),
};

// Admin API calls
export const adminAPI = {
  // GET /api/admin/:aid
  getById: (aid) => apiCall(`/admin/${aid}`),
  
  // GET /api/admin/dashboard-stats
  getDashboardStats: () => apiCall('/admin/dashboard-stats'),
  
  // GET /api/admin/recent-activities
  getRecentActivities: () => apiCall('/admin/recent-activities'),
  
  // GET /api/admin/fraud-alerts
  getFraudAlerts: () => apiCall('/admin/fraud-alerts'),
};

// Clubs API calls
export const clubsAPI = {
  // GET /api/clubs/:cid
  getById: (cid) => apiCall(`/clubs/${cid}`),
  
  // GET /api/clubs
  getAll: () => apiCall('/clubs'),
  
  // POST /api/clubs
  create: (data) => apiCall('/clubs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // PUT /api/clubs/:cid
  update: (cid, data) => apiCall(`/clubs/${cid}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // GET /api/clubs/:cid/events
  getEvents: (cid) => apiCall(`/clubs/${cid}/events`),
  
  // GET /api/clubs/:cid/members
  getMembers: (cid) => apiCall(`/clubs/${cid}/members`),
};

// Events API calls
export const eventsAPI = {
  // GET /api/events/:eid
  getById: (eid) => apiCall(`/events/${eid}`),
  
  // GET /api/events
  getAll: () => apiCall('/events'),
  
  // GET /api/events/upcoming
  getUpcoming: () => apiCall('/events/upcoming'),
  
  // POST /api/events
  create: (data) => apiCall('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // PUT /api/events/:eid
  update: (eid, data) => apiCall(`/events/${eid}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // DELETE /api/events/:eid
  delete: (eid) => apiCall(`/events/${eid}`, {
    method: 'DELETE',
  }),
  
  // GET /api/events/:eid/attendance
  getAttendance: (eid) => apiCall(`/events/${eid}/attendance`),
  
  // POST /api/events/:eid/register
  register: (eid) => apiCall(`/events/${eid}/register`, {
    method: 'POST',
  }),
  
  // DELETE /api/events/:eid/register (unregister)
  unregister: (eid) => apiCall(`/events/${eid}/register`, {
    method: 'DELETE',
  }),
};

// Activity Points API calls
export const activityPointsAPI = {
  // GET /api/activity-points
  getAll: () => apiCall('/activity-points'),
  
  // POST /api/activity-points
  create: (data) => apiCall('/activity-points', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // PUT /api/activity-points/:apid
  update: (apid, data) => apiCall(`/activity-points/${apid}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // DELETE /api/activity-points/:apid
  delete: (apid) => apiCall(`/activity-points/${apid}`, {
    method: 'DELETE',
  }),
};

// Attendance API calls
export const attendanceAPI = {
  // GET /api/attendance
  getAll: () => apiCall('/attendance'),
  
  // POST /api/attendance/mark - Main geolocation attendance endpoint
  markAttendance: (data) => apiCall('/attendance/mark', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // GET /api/attendance/event/:eid
  getByEvent: (eid) => apiCall(`/attendance/event/${eid}`),
  
  // GET /api/attendance/student/:sid
  getByStudent: (sid) => apiCall(`/attendance/student/${sid}`),
  
  // GET /api/attendance/analytics
  getAnalytics: () => apiCall('/attendance/analytics'),
  
  // GET /api/attendance/fraud-detection
  getFraudDetection: () => apiCall('/attendance/fraud-detection'),
};

// QR Code and Location API calls
export const qrLocationAPI = {
  // POST /api/qr/generate
  generateQR: (eid) => apiCall('/qr/generate', {
    method: 'POST',
    body: JSON.stringify({ eid }),
  }),
  
  // POST /api/qr/verify
  verifyQR: (qrData, location) => apiCall('/qr/verify', {
    method: 'POST',
    body: JSON.stringify({ qrData, location }),
  }),
  
  // POST /api/location/verify
  verifyLocation: (eid, location) => apiCall('/location/verify', {
    method: 'POST',
    body: JSON.stringify({ eid, location }),
  }),
};

// Export all APIs
export default {
  auth: authAPI,
  students: studentsAPI,
  admin: adminAPI,
  clubs: clubsAPI,
  events: eventsAPI,
  activityPoints: activityPointsAPI,
  attendance: attendanceAPI,
  qrLocation: qrLocationAPI,
};
