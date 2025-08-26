import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const Unauthorized = () => {
  const { logout } = useAuth();

  const handleBackToLogin = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          
          <button
            onClick={handleBackToLogin}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
