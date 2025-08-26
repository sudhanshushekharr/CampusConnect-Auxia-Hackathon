import React, { useState } from 'react';
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ClubManagement = () => {
  // Mock clubs data - in real app this would come from API
  const [clubs, setClubs] = useState([
    {
      cid: 1,
      cname: 'Tech Club',
      club_head_sid: 2,
      club_head_name: 'Sarah Wilson',
      club_head_email: 'sarah.wilson@student.edu',
      description: 'Promoting technology and innovation on campus',
      founded_date: '2020-08-15',
      member_count: 45,
      events_count: 12,
      status: 'active',
      category: 'Technical'
    },
    {
      cid: 2,
      cname: 'NSS',
      club_head_sid: 3,
      club_head_name: 'Alex Kumar',
      club_head_email: 'alex.kumar@student.edu',
      description: 'National Service Scheme - Community service and social work',
      founded_date: '2019-07-20',
      member_count: 78,
      events_count: 25,
      status: 'active',
      category: 'Social Service'
    },
    {
      cid: 3,
      cname: 'Photography Club',
      club_head_sid: 4,
      club_head_name: 'Emily Chen',
      club_head_email: 'emily.chen@student.edu',
      description: 'Capturing moments and promoting visual arts',
      founded_date: '2021-01-10',
      member_count: 32,
      events_count: 8,
      status: 'pending',
      category: 'Arts & Culture'
    },
    {
      cid: 4,
      cname: 'Robotics Club',
      club_head_sid: 5,
      club_head_name: 'David Lee',
      club_head_email: 'david.lee@student.edu',
      description: 'Building robots and exploring automation',
      founded_date: '2021-09-05',
      member_count: 28,
      events_count: 5,
      status: 'inactive',
      category: 'Technical'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [formData, setFormData] = useState({
    cname: '',
    club_head_name: '',
    club_head_email: '',
    description: '',
    category: ''
  });

  const categories = ['Technical', 'Arts & Culture', 'Sports', 'Social Service', 'Academic', 'Other'];
  const statuses = ['active', 'inactive', 'pending'];

  // Filter clubs based on search and filters
  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.cname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.club_head_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || club.status === filterStatus;
    const matchesCategory = filterCategory === '' || club.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddClub = () => {
    if (formData.cname && formData.club_head_name && formData.club_head_email && formData.category) {
      const newClub = {
        cid: Math.max(...clubs.map(c => c.cid)) + 1,
        ...formData,
        club_head_sid: Math.floor(Math.random() * 1000) + 100, // Mock SID
        founded_date: new Date().toISOString().split('T')[0],
        member_count: 1,
        events_count: 0,
        status: 'pending'
      };
      setClubs([...clubs, newClub]);
      setFormData({ cname: '', club_head_name: '', club_head_email: '', description: '', category: '' });
      setShowAddModal(false);
    }
  };

  const handleEditClub = (club) => {
    setEditingClub(club);
    setFormData({
      cname: club.cname,
      club_head_name: club.club_head_name,
      club_head_email: club.club_head_email,
      description: club.description,
      category: club.category
    });
    setShowAddModal(true);
  };

  const handleUpdateClub = () => {
    if (editingClub && formData.cname && formData.club_head_name && formData.club_head_email && formData.category) {
      setClubs(clubs.map(club => 
        club.cid === editingClub.cid 
          ? { ...club, ...formData }
          : club
      ));
      setEditingClub(null);
      setFormData({ cname: '', club_head_name: '', club_head_email: '', description: '', category: '' });
      setShowAddModal(false);
    }
  };

  const handleDeleteClub = (cid) => {
    if (window.confirm('Are you sure you want to delete this club? This action cannot be undone.')) {
      setClubs(clubs.filter(club => club.cid !== cid));
    }
  };

  const handleApproveClub = (cid) => {
    setClubs(clubs.map(club => 
      club.cid === cid ? { ...club, status: 'active' } : club
    ));
  };

  const handleRejectClub = (cid) => {
    if (window.confirm('Are you sure you want to reject this club application?')) {
      setClubs(clubs.map(club => 
        club.cid === cid ? { ...club, status: 'inactive' } : club
      ));
    }
  };

  const toggleClubStatus = (cid) => {
    setClubs(clubs.map(club => 
      club.cid === cid 
        ? { ...club, status: club.status === 'active' ? 'inactive' : 'active' }
        : club
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Club Management</h2>
          <p className="text-gray-600">Manage student clubs and approve new applications</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Club</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clubs</p>
              <p className="text-2xl font-bold text-gray-900">{clubs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Clubs</p>
              <p className="text-2xl font-bold text-gray-900">
                {clubs.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">
                {clubs.filter(c => c.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {clubs.reduce((acc, c) => acc + c.member_count, 0)}
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
                placeholder="Search clubs by name, head, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pending Approvals Section */}
      {clubs.filter(c => c.status === 'pending').length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-4">Pending Club Approvals</h3>
          <div className="space-y-3">
            {clubs.filter(c => c.status === 'pending').map((club) => (
              <div key={club.cid} className="flex items-center justify-between bg-white rounded-lg p-4">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{club.cname}</h4>
                  <p className="text-sm text-gray-600">Head: {club.club_head_name}</p>
                  <p className="text-sm text-gray-500">{club.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApproveClub(club.cid)}
                    className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    <CheckIcon className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleRejectClub(club.cid)}
                    className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clubs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Club
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Club Head
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Events
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Founded
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClubs.map((club) => (
                <tr key={club.cid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <UserGroupIcon className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{club.cname}</div>
                        <div className="text-sm text-gray-500">{club.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{club.club_head_name}</div>
                    <div className="text-sm text-gray-500">{club.club_head_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {club.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {club.member_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {club.events_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleClubStatus(club.cid)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        club.status === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : club.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {club.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(club.founded_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2 justify-end">
                      <button
                        onClick={() => handleEditClub(club)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClub(club.cid)}
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

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No clubs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Club Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingClub ? 'Edit Club' : 'Add New Club'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                  <input
                    type="text"
                    value={formData.cname}
                    onChange={(e) => setFormData({...formData, cname: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter club name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Club Head Name</label>
                  <input
                    type="text"
                    value={formData.club_head_name}
                    onChange={(e) => setFormData({...formData, club_head_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter club head name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Club Head Email</label>
                  <input
                    type="email"
                    value={formData.club_head_email}
                    onChange={(e) => setFormData({...formData, club_head_email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter club head email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter club description"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingClub(null);
                    setFormData({ cname: '', club_head_name: '', club_head_email: '', description: '', category: '' });
                  }}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingClub ? handleUpdateClub : handleAddClub}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingClub ? 'Update' : 'Add'} Club
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubManagement;
