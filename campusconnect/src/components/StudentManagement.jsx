import React, { useState } from 'react';
import {
  UserIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AcademicCapIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const StudentManagement = () => {
  // Mock students data - in real app this would come from API
  const [students, setStudents] = useState([
    {
      sid: 1,
      name: 'John Doe',
      usn: 'CS21001',
      branch: 'Computer Science',
      email: 'john.doe@student.edu',
      total_points: 45,
      status: 'active',
      joinDate: '2021-08-15'
    },
    {
      sid: 2,
      name: 'Sarah Wilson',
      usn: 'CS21002',
      branch: 'Computer Science',
      email: 'sarah.wilson@student.edu',
      total_points: 78,
      status: 'active',
      joinDate: '2021-08-15'
    },
    {
      sid: 3,
      name: 'Mike Johnson',
      usn: 'EC21003',
      branch: 'Electronics',
      email: 'mike.johnson@student.edu',
      total_points: 32,
      status: 'active',
      joinDate: '2021-08-16'
    },
    {
      sid: 4,
      name: 'Emily Chen',
      usn: 'ME21004',
      branch: 'Mechanical',
      email: 'emily.chen@student.edu',
      total_points: 65,
      status: 'inactive',
      joinDate: '2021-08-17'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    branch: '',
    email: '',
    password: ''
  });

  const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Science'];

  // Filter students based on search and branch filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = filterBranch === '' || student.branch === filterBranch;
    return matchesSearch && matchesBranch;
  });

  const handleAddStudent = () => {
    if (formData.name && formData.usn && formData.branch && formData.email) {
      const newStudent = {
        sid: Math.max(...students.map(s => s.sid)) + 1,
        ...formData,
        total_points: 0,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
      };
      setStudents([...students, newStudent]);
      setFormData({ name: '', usn: '', branch: '', email: '', password: '' });
      setShowAddModal(false);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      usn: student.usn,
      branch: student.branch,
      email: student.email,
      password: ''
    });
    setShowAddModal(true);
  };

  const handleUpdateStudent = () => {
    if (editingStudent && formData.name && formData.usn && formData.branch && formData.email) {
      setStudents(students.map(student => 
        student.sid === editingStudent.sid 
          ? { ...student, ...formData }
          : student
      ));
      setEditingStudent(null);
      setFormData({ name: '', usn: '', branch: '', email: '', password: '' });
      setShowAddModal(false);
    }
  };

  const handleDeleteStudent = (sid) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.sid !== sid));
    }
  };

  const toggleStudentStatus = (sid) => {
    setStudents(students.map(student => 
      student.sid === sid 
        ? { ...student, status: student.status === 'active' ? 'inactive' : 'active' }
        : student
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
          <p className="text-gray-600">Manage student accounts and track their activities</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {students.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrophyIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(students.reduce((acc, s) => acc + s.total_points, 0) / students.length)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FunnelIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Branches</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(students.map(s => s.branch)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name, USN, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  USN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.sid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.usn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.branch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrophyIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{student.total_points}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStudentStatus(student.sid)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } transition-colors`}
                    >
                      {student.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2 justify-end">
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.sid)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter student name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">USN</label>
                  <input
                    type="text"
                    value={formData.usn}
                    onChange={(e) => setFormData({...formData, usn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter USN"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {editingStudent && "(leave empty to keep current)"}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={editingStudent ? "Enter new password" : "Enter password"}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingStudent(null);
                    setFormData({ name: '', usn: '', branch: '', email: '', password: '' });
                  }}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingStudent ? 'Update' : 'Add'} Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
