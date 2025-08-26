const mongoose = require('mongoose');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Club = require('../models/Club');
const Event = require('../models/Event');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusconnect');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Student.deleteMany({});
    await Admin.deleteMany({});
    await Club.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin
    const admin = new Admin({
      aid: 1,
      name: 'Admin User',
      email: 'admin@college.edu',
      password: 'admin123',
      role: 'super_admin',
      permissions: ['manage_students', 'manage_clubs', 'manage_events', 'view_analytics', 'fraud_detection']
    });
    await admin.save();
    console.log('Admin created');

    // Create Students
    const students = [
      {
        sid: 1,
        name: 'John Doe',
        usn: '1MS21CS001',
        branch: 'CSE',
        email: 'john.doe@college.edu',
        password: 'password123',
        phone: '9876543210',
        year: 3,
        total_points: 45
      },
      {
        sid: 2,
        name: 'Jane Smith',
        usn: '1MS21CS002',
        branch: 'CSE',
        email: 'jane.smith@college.edu',
        password: 'password123',
        phone: '9876543211',
        year: 3,
        total_points: 38
      },
      {
        sid: 3,
        name: 'Sarah Wilson',
        usn: '1MS21CS003',
        branch: 'CSE',
        email: 'sarah.wilson@college.edu',
        password: 'password123',
        phone: '9876543212',
        year: 4,
        total_points: 62
      }
    ];

    for (const studentData of students) {
      const student = new Student(studentData);
      await student.save();
    }
    console.log('Students created');

    // Create Clubs
    const clubs = [
      {
        cid: 1,
        cname: 'Tech Club',
        description: 'Technology and Innovation Club',
        club_head_sid: 3, // Sarah Wilson
        aid: 1,
        category: 'technical',
        contact_email: 'tech@college.edu',
        contact_phone: '9876543213'
      },
      {
        cid: 2,
        cname: 'NSS',
        description: 'National Service Scheme',
        club_head_sid: 3, // Sarah Wilson (can lead multiple clubs)
        aid: 1,
        category: 'social',
        contact_email: 'nss@college.edu',
        contact_phone: '9876543214'
      }
    ];

    for (const clubData of clubs) {
      const club = new Club(clubData);
      await club.save();
    }
    console.log('Clubs created');

    // Create Events
    const events = [
      {
        eid: 1,
        ename: 'AI Workshop',
        description: 'Learn the fundamentals of Artificial Intelligence and Machine Learning',
        duration: '2 hours',
        points: 10,
        cid: 1,
        date: new Date('2025-01-15'),
        time: '14:00',
        location: 'Computer Lab 1',
        latitude: 12.9716,
        longitude: 77.5946,
        locationRadius: 50,
        capacity: 30,
        registrations: 2,
        registeredStudents: [1, 2],
        category: 'technical',
        status: 'upcoming'
      },
      {
        eid: 2,
        ename: 'Blood Donation Camp',
        description: 'Save lives by donating blood. Every drop counts!',
        duration: '6 hours',
        points: 15,
        cid: 2,
        date: new Date('2025-01-20'),
        time: '09:00',
        location: 'Main Auditorium',
        latitude: 12.9720,
        longitude: 77.5950,
        locationRadius: 75,
        capacity: 100,
        registrations: 2,
        registeredStudents: [1, 3],
        category: 'social',
        status: 'upcoming'
      },
      {
        eid: 3,
        ename: 'Cultural Fest Performance',
        description: 'Showcase your talents in our annual cultural festival',
        duration: '3 hours',
        points: 12,
        cid: 1,
        date: new Date('2025-01-25'),
        time: '18:00',
        location: 'Main Stage',
        latitude: 12.9710,
        longitude: 77.5940,
        locationRadius: 100,
        capacity: 200,
        registrations: 1,
        registeredStudents: [1],
        category: 'cultural',
        status: 'upcoming'
      }
    ];

    for (const eventData of events) {
      const event = new Event(eventData);
      await event.save();
    }
    console.log('Events created');

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@college.edu / admin123');
    console.log('Student: john.doe@college.edu / password123');
    console.log('Club Leader: sarah.wilson@college.edu / password123');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
