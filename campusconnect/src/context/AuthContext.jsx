import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

// Mock data matching database schema
const mockStudents = [
  {
    sid: 1,
    name: 'John Doe',
    usn: 'CS21001',
    branch: 'Computer Science',
    email: 'john.doe@student.edu',
    password: 'student123',
    total_points: 45
  },
  {
    sid: 2,
    name: 'Sarah Wilson',
    usn: 'CS21002', 
    branch: 'Computer Science',
    email: 'sarah.wilson@student.edu',
    password: 'club123',
    total_points: 78
  }
];

const mockAdmins = [
  {
    aid: 1,
    name: 'System Administrator',
    email: 'admin@campus.edu',
    password: 'admin123'
  }
];

const mockClubs = [
  {
    cid: 1,
    cname: 'Tech Club',
    club_head_sid: 2, // Sarah Wilson
    aid: 1
  },
  {
    cid: 2,
    cname: 'NSS',
    club_head_sid: 3, // Another student (not John Doe)
    aid: 1
  }
];

// Helper function to get user data based on credentials
const findUserByCredentials = (email, password) => {
  // Check admins first
  const admin = mockAdmins.find(a => a.email === email && a.password === password);
  if (admin) {
    return { ...admin, role: 'admin', userType: 'admin' };
  }

  // Check students and determine if they are club leaders
  const student = mockStudents.find(s => s.email === email && s.password === password);
  if (student) {
    // Check if this student is a club head
    const isClubHead = mockClubs.some(c => c.club_head_sid === student.sid);
    if (isClubHead) {
      const club = mockClubs.find(c => c.club_head_sid === student.sid);
      return { 
        ...student, 
        role: 'club_leader', 
        userType: 'student',
        clubData: club 
      };
    } else {
      return { ...student, role: 'student', userType: 'student' };
    }
  }

  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('campusconnect_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem('campusconnect_user', JSON.stringify(userData));
        return userData;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      // If backend is not available, fallback to mock data
      console.warn('Backend not available, using mock data:', error);
      
      const foundUser = findUserByCredentials(email, password);
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('campusconnect_user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusconnect_user');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('campusconnect_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    isClubLeader: user?.role === 'club_leader'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
