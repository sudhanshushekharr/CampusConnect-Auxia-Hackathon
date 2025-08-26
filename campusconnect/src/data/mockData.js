// Mock data matching database schema for development and testing

// Events table data
export const mockEvents = [
  {
    eid: 1,
    ename: 'AI Workshop',
    description: 'Learn the fundamentals of Artificial Intelligence and Machine Learning',
    duration: '2 hours',
    points: 10,
    cid: 1, // Tech Club
    date: '2025-01-15',
    time: '14:00',
    location: 'Computer Lab 1',
    latitude: 12.9716, // Bangalore coordinates
    longitude: 77.5946,
    locationRadius: 50, // 50 meters radius
    capacity: 30,
    registrations: 25,
    registeredStudents: [1, 3, 5, 7, 9], // Include student IDs, including John Doe (sid: 1)
    category: 'technical',
    status: 'upcoming',
    clubName: 'Tech Club'
  },
  {
    eid: 2,
    ename: 'Blood Donation Camp',
    description: 'Save lives by donating blood. Every drop counts!',
    duration: '6 hours',
    points: 15,
    cid: 2, // NSS
    date: '2025-01-20',
    time: '09:00',
    location: 'Main Auditorium',
    latitude: 12.9720, // Slightly different coordinates
    longitude: 77.5950,
    locationRadius: 75, // 75 meters radius for larger venue
    capacity: 100,
    registrations: 45,
    registeredStudents: [1, 2, 4, 6, 8], // Include student IDs, including John Doe (sid: 1)
    category: 'social',
    status: 'upcoming',
    clubName: 'NSS'
  },
  {
    eid: 3,
    ename: 'Photography Contest',
    description: 'Capture the beauty of campus life through your lens',
    duration: '1 day',
    points: 8,
    cid: 1, // Tech Club
    date: '2025-01-05',
    time: '10:00',
    location: 'Campus Grounds',
    capacity: 50,
    registrations: 12,
    registeredStudents: [1, 2, 3, 4, 5], // Include student IDs, including John Doe (sid: 1)
    category: 'cultural',
    status: 'upcoming',
    clubName: 'Tech Club'
  },
  {
    eid: 4,
    ename: 'Cultural Fest Performance',
    description: 'Showcase your talents in our annual cultural festival',
    duration: '3 hours',
    points: 12,
    cid: 1, // Tech Club
    date: '2025-01-25',
    time: '18:00',
    location: 'Main Stage',
    capacity: 200,
    registrations: 180,
    registeredStudents: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Include student IDs, including John Doe (sid: 1)
    category: 'cultural',
    status: 'upcoming',
    clubName: 'Tech Club'
  },
  {
    eid: 5,
    ename: 'Environment Awareness Campaign',
    description: 'Join us in spreading awareness about environmental conservation',
    duration: '4 hours',
    points: 8,
    cid: 2, // NSS
    date: '2024-12-18',
    time: '09:00',
    location: 'City Center',
    capacity: 75,
    registrations: 60,
    category: 'social',
    status: 'completed',
    clubName: 'NSS'
  },
  {
    eid: 6,
    ename: 'Web Development Bootcamp',
    description: 'Learn modern web development with React and Node.js',
    duration: '2 days',
    points: 20,
    cid: 1, // Tech Club
    date: '2025-01-10',
    time: '09:00',
    location: 'Computer Lab 2',
    capacity: 25,
    registrations: 15,
    category: 'workshop',
    status: 'upcoming',
    clubName: 'Tech Club'
  },
  {
    eid: 7,
    ename: 'Inter-College Cricket Tournament',
    description: 'Battle it out on the cricket field against other colleges',
    duration: '3 days',
    points: 25,
    cid: 1, // Tech Club (Sports division)
    date: '2025-01-15',
    time: '08:00',
    location: 'Sports Ground',
    capacity: 22,
    registrations: 18,
    category: 'sports',
    status: 'upcoming',
    clubName: 'Tech Club'
  },
  {
    eid: 8,
    ename: 'Coding Competition',
    description: 'Test your programming skills in this exciting coding challenge',
    duration: '4 hours',
    points: 15,
    cid: 1, // Tech Club
    date: '2025-01-08',
    time: '13:00',
    location: 'Computer Lab 3',
    capacity: 40,
    registrations: 35,
    category: 'competition',
    status: 'upcoming',
    clubName: 'Tech Club'
  },
  {
    eid: 9,
    ename: 'Community Kitchen Service',
    description: 'Help prepare and serve meals for underprivileged communities',
    duration: '5 hours',
    points: 18,
    cid: 2, // NSS
    date: '2025-01-12',
    time: '07:00',
    location: 'Community Center',
    capacity: 30,
    registrations: 22,
    category: 'social',
    status: 'upcoming',
    clubName: 'NSS'
  },
  {
    eid: 10,
    ename: 'Research Paper Presentation',
    description: 'Present your research findings to faculty and peers',
    duration: '3 hours',
    points: 12,
    cid: 1, // Tech Club
    date: '2025-01-20',
    time: '14:00',
    location: 'Seminar Hall',
    capacity: 60,
    registrations: 8,
    category: 'academic',
    status: 'upcoming',
    clubName: 'Tech Club'
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
