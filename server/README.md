# CampusConnect Backend API

Node.js + Express + MongoDB backend for the CampusConnect campus activity tracking system.

## Features

- **Authentication & Authorization** - JWT-based auth for students, club leaders, and admins
- **Geolocation Attendance** - Location-verified attendance marking with fraud detection
- **Event Management** - Create, register, and manage campus events
- **Activity Points** - Automatic point calculation and tracking
- **Analytics & Reporting** - Comprehensive analytics for admins
- **Fraud Detection** - AI-powered fraud detection for suspicious activities

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Update `.env` file with your MongoDB connection string:
```env
MONGODB_URI=your_mongodb_connection_string_here
```

### 3. Seed Database (Optional)
```bash
npm run seed
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (student/admin)
- `POST /api/auth/register/student` - Student registration
- `GET /api/auth/profile` - Get current user profile

### Attendance (Core Feature)
- `POST /api/attendance/mark` - Mark attendance with geolocation
- `GET /api/attendance/student/:sid` - Get student attendance
- `GET /api/attendance/event/:eid` - Get event attendance
- `GET /api/attendance/analytics` - Attendance analytics (admin)
- `GET /api/attendance/fraud-detection` - Fraud detection (admin)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:eid` - Get event details
- `POST /api/events/:eid/register` - Register for event
- `DELETE /api/events/:eid/register` - Unregister from event
- `POST /api/events` - Create event (club leaders)

### Students
- `GET /api/students` - Get all students (admin)
- `GET /api/students/profile` - Get student profile

### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:cid/events` - Get club events

### Admin
- `GET /api/admin/dashboard` - Admin dashboard analytics

## Geolocation Attendance API

### Mark Attendance
```javascript
POST /api/attendance/mark
{
  "eid": 1,
  "studentLocation": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "accuracy": 10
  },
  "locationAddress": {
    "country": "India",
    "state": "Karnataka",
    "city": "Bangalore",
    "road": "MG Road",
    "display_name": "MG Road, Bangalore, Karnataka, India"
  },
  "deviceInfo": {
    "platform": "web"
  }
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {
    "attendance": { /* attendance record */ },
    "pointsAwarded": 10,
    "distance": 25,
    "verified": true
  }
}
```

## Database Schema

### Collections
- **students** - Student information and credentials
- **admins** - Admin users
- **clubs** - Campus clubs and organizations
- **events** - Campus events with geolocation data
- **attendances** - Attendance records with location verification
- **activitypoints** - Point tracking and history

## Security Features

- **JWT Authentication** with 7-day expiry
- **Password Hashing** with bcrypt (12 rounds)
- **Rate Limiting** - 100 requests per 15 minutes
- **CORS Protection** - Configurable origins
- **Input Validation** - Mongoose schema validation
- **Helmet.js** - Security headers

## Fraud Detection

The system automatically detects suspicious attendance patterns:

- **Location Spoofing** - Unusual GPS accuracy or impossible locations
- **Time Anomalies** - Attendance marked at unusual times
- **Device Mismatches** - Multiple devices for same user
- **Risk Scoring** - 0-100 risk score for each attendance

## Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/campusconnect

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Default Credentials (After Seeding)

- **Admin**: admin@college.edu / admin123
- **Student**: john.doe@college.edu / password123
- **Club Leader**: sarah.wilson@college.edu / password123

## Project Structure

```
server/
├── models/          # Mongoose models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── .env             # Environment variables
├── index.js         # Main server file
└── package.json     # Dependencies
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Morgan** - Logging
- **CORS** - Cross-origin requests

## Ready for Production

The backend is production-ready with:
- Comprehensive error handling
- Security best practices
- Scalable architecture
- Detailed logging
- API documentation
