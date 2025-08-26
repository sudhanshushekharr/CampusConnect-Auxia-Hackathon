import React, { useState } from 'react';
import {
  ChartBarIcon,
  TrophyIcon,
  UsersIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('registrations');

  // Mock analytics data
  const [analyticsData] = useState({
    overview: {
      totalEvents: 156,
      totalStudents: 1250,
      totalClubs: 25,
      totalPoints: 12450,
      monthlyGrowth: {
        events: 12.5,
        students: 8.3,
        registrations: 15.7,
        points: 22.1
      }
    },
    eventMetrics: {
      avgRegistrations: 28.5,
      completionRate: 87.3,
      avgRating: 4.2,
      popularCategories: [
        { name: 'Technical', count: 45, percentage: 28.8 },
        { name: 'Cultural', count: 38, percentage: 24.4 },
        { name: 'Sports', count: 32, percentage: 20.5 },
        { name: 'Social', count: 25, percentage: 16.0 },
        { name: 'Academic', count: 16, percentage: 10.3 }
      ]
    },
    clubPerformance: [
      { name: 'Tech Club', events: 12, registrations: 340, points: 1200, rating: 4.5 },
      { name: 'NSS', events: 25, registrations: 625, points: 1875, rating: 4.3 },
      { name: 'Cultural Club', events: 18, registrations: 450, points: 1350, rating: 4.4 },
      { name: 'Sports Club', events: 15, registrations: 375, points: 1125, rating: 4.2 },
      { name: 'Drama Club', events: 8, registrations: 200, points: 600, rating: 4.6 }
    ],
    studentEngagement: {
      activeStudents: 892,
      avgEventsPerStudent: 3.2,
      topPerformers: [
        { name: 'Sarah Wilson', points: 156, events: 12 },
        { name: 'John Doe', points: 134, events: 10 },
        { name: 'Mike Johnson', points: 128, events: 11 },
        { name: 'Emily Chen', points: 122, events: 9 },
        { name: 'Alex Kumar', points: 118, events: 8 }
      ],
      pointsDistribution: [
        { range: '0-25', count: 358, percentage: 28.6 },
        { range: '26-50', count: 312, percentage: 25.0 },
        { range: '51-75', count: 287, percentage: 23.0 },
        { range: '76-100', count: 201, percentage: 16.1 },
        { range: '100+', count: 92, percentage: 7.4 }
      ]
    },
    timeSeriesData: {
      registrations: [
        { month: 'Jan', value: 245 },
        { month: 'Feb', value: 287 },
        { month: 'Mar', value: 321 },
        { month: 'Apr', value: 298 },
        { month: 'May', value: 356 },
        { month: 'Jun', value: 389 },
        { month: 'Jul', value: 412 },
        { month: 'Aug', value: 445 },
        { month: 'Sep', value: 398 },
        { month: 'Oct', value: 467 },
        { month: 'Nov', value: 523 },
        { month: 'Dec', value: 578 }
      ],
      events: [
        { month: 'Jan', value: 8 },
        { month: 'Feb', value: 12 },
        { month: 'Mar', value: 15 },
        { month: 'Apr', value: 11 },
        { month: 'May', value: 18 },
        { month: 'Jun', value: 22 },
        { month: 'Jul', value: 19 },
        { month: 'Aug', value: 25 },
        { month: 'Sep', value: 21 },
        { month: 'Oct', value: 28 },
        { month: 'Nov', value: 32 },
        { month: 'Dec', value: 35 }
      ]
    }
  });

  const exportData = (format) => {
    // Mock export functionality
    const data = JSON.stringify(analyticsData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        <div className={`flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? (
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
          ) : (
            <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
          )}
          <span className="text-sm font-medium">{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={() => exportData('json')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Events" 
          value={analyticsData.overview.totalEvents} 
          change={analyticsData.overview.monthlyGrowth.events}
          icon={CalendarIcon}
          color="blue"
        />
        <MetricCard 
          title="Active Students" 
          value={analyticsData.studentEngagement.activeStudents} 
          change={analyticsData.overview.monthlyGrowth.students}
          icon={UsersIcon}
          color="green"
        />
        <MetricCard 
          title="Event Registrations" 
          value="3,245" 
          change={analyticsData.overview.monthlyGrowth.registrations}
          icon={ArrowTrendingUpIcon}
          color="purple"
        />
        <MetricCard 
          title="Points Distributed" 
          value={analyticsData.overview.totalPoints.toLocaleString()} 
          change={analyticsData.overview.monthlyGrowth.points}
          icon={TrophyIcon}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Event Categories Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Event Categories</h3>
            <EyeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.eventMetrics.popularCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${['blue', 'green', 'purple', 'yellow', 'red'][index]}-500`}></div>
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${['blue', 'green', 'purple', 'yellow', 'red'][index]}-500 h-2 rounded-full`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{category.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Clubs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Clubs</h3>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.clubPerformance.slice(0, 5).map((club, index) => (
              <div key={club.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full bg-${['blue', 'green', 'purple', 'yellow', 'red'][index]}-100 flex items-center justify-center`}>
                    <span className={`text-${['blue', 'green', 'purple', 'yellow', 'red'][index]}-600 font-semibold text-sm`}>
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{club.name}</p>
                    <p className="text-sm text-gray-500">{club.events} events • {club.registrations} registrations</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <TrophyIcon className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{club.points}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">★ {club.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Students */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Students</h3>
            <TrophyIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.studentEngagement.topPerformers.map((student, index) => (
              <div key={student.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-100' : index === 2 ? 'bg-orange-100' : 'bg-blue-100'} flex items-center justify-center`}>
                    <span className={`${index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-600' : index === 2 ? 'text-orange-600' : 'text-blue-600'} font-semibold text-sm`}>
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.events} events attended</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <TrophyIcon className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{student.points} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Points Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Points Distribution</h3>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.studentEngagement.pointsDistribution.map((range, index) => (
              <div key={range.range} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900 w-16">{range.range}</span>
                  <div className="w-48 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${range.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{range.count}</span>
                  <span className="text-xs text-gray-500 ml-2">({range.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Series Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Trends Over Time</h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="registrations">Registrations</option>
              <option value="events">Events</option>
              <option value="points">Points</option>
            </select>
          </div>
        </div>
        
        {/* Simple Chart Visualization */}
        <div className="h-64 flex items-end space-x-2">
          {analyticsData.timeSeriesData[selectedMetric].map((data, index) => {
            const maxValue = Math.max(...analyticsData.timeSeriesData[selectedMetric].map(d => d.value));
            const height = (data.value / maxValue) * 200;
            
            return (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                  style={{ height: `${height}px` }}
                  title={`${data.month}: ${data.value}`}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">📈 Growth Trend</h4>
            <p className="text-sm text-gray-600">Event registrations increased by 15.7% this month, indicating strong student engagement.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">🎯 Popular Categories</h4>
            <p className="text-sm text-gray-600">Technical events lead with 28.8% of total events, followed by cultural activities.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">⭐ High Performers</h4>
            <p className="text-sm text-gray-600">NSS leads with 25 events and maintains a 4.3-star average rating.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
