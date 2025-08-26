// Mock data matching database schema for development and testing

// Events table data
export const mockEvents = [
  {
    eid: 1,
    ename: 'AI Workshop',
    duration: '2 hours',
    points: 10,
    cid: 1 // Tech Club
  },
  {
    eid: 2,
    ename: 'Blood Donation Camp',
    duration: '6 hours',
    points: 15,
    cid: 2 // NSS
  },
  {
    eid: 3,
    ename: 'Photography Contest',
    duration: '7 hours',
    points: 8,
    cid: 1 // Tech Club
  },
  {
    eid: 4,
    ename: 'Cultural Fest Performance',
    duration: '3 hours',
    points: 12,
    cid: 1 // Tech Club
  },
  {
    eid: 5,
    ename: 'Environment Awareness Campaign',
    duration: '4 hours',
    points: 8,
    cid: 2 // NSS
  }
];

// ActivityPoints table data
export const mockActivityPoints = [
  {
    apid: 1,
    sid: 1, // John Doe
    eid: 4, // Cultural Fest Performance
    cid: 1, // Tech Club
    point_count: 12
  },
  {
    apid: 2,
    sid: 1, // John Doe
    eid: 5, // Environment Awareness Campaign
    cid: 2, // NSS
    point_count: 8
  },
  {
    apid: 3,
    sid: 1, // John Doe
    eid: 1, // AI Workshop (in progress)
    cid: 1, // Tech Club
    point_count: 10
  },
  {
    apid: 4,
    sid: 2, // Sarah Wilson
    eid: 1, // AI Workshop
    cid: 1, // Tech Club
    point_count: 10
  },
  {
    apid: 5,
    sid: 2, // Sarah Wilson
    eid: 2, // Blood Donation Camp
    cid: 2, // NSS
    point_count: 15
  }
];

// Attendance table data
export const mockAttendance = [
  {
    attid: 1,
    sid: 1, // John Doe
    eid: 4, // Cultural Fest Performance
    status: 'present',
    timestamp: '2024-12-20T10:00:00Z'
  },
  {
    attid: 2,
    sid: 1, // John Doe
    eid: 5, // Environment Awareness Campaign
    status: 'present',
    timestamp: '2024-12-18T09:00:00Z'
  },
  {
    attid: 3,
    sid: 2, // Sarah Wilson
    eid: 1, // AI Workshop
    status: 'present',
    timestamp: '2024-12-15T14:00:00Z'
  },
  {
    attid: 4,
    sid: 2, // Sarah Wilson
    eid: 2, // Blood Donation Camp
    status: 'present',
    timestamp: '2024-12-10T09:00:00Z'
  }
];

// Helper functions to get related data
export const getEventsByClub = (cid) => {
  return mockEvents.filter(event => event.cid === cid);
};

export const getStudentActivityPoints = (sid) => {
  return mockActivityPoints.filter(ap => ap.sid === sid);
};

export const getStudentAttendance = (sid) => {
  return mockAttendance.filter(att => att.sid === sid);
};

export const getEventAttendance = (eid) => {
  return mockAttendance.filter(att => att.eid === eid);
};

export const getClubActivityPoints = (cid) => {
  return mockActivityPoints.filter(ap => ap.cid === cid);
};

// Function to get event details by ID
export const getEventById = (eid) => {
  return mockEvents.find(event => event.eid === eid);
};

// Function to calculate total points for a student
export const calculateStudentTotalPoints = (sid) => {
  return mockActivityPoints
    .filter(ap => ap.sid === sid)
    .reduce((total, ap) => total + ap.point_count, 0);
};

// Function to get upcoming events (mock future events)
export const getUpcomingEvents = () => {
  return [
    {
      eid: 6,
      ename: 'Tech Talk on Machine Learning',
      duration: '2 hours',
      points: 10,
      cid: 1,
      date: 'Tomorrow',
      time: '2:00 PM - 4:00 PM',
      location: 'Computer Lab 1',
      registrations: 25,
      capacity: 30
    },
    {
      eid: 7,
      ename: 'Blood Donation Drive',
      duration: '6 hours',
      points: 15,
      cid: 2,
      date: 'Dec 28',
      time: '9:00 AM - 3:00 PM',
      location: 'Main Auditorium',
      registrations: 45,
      capacity: 100
    }
  ];
};
