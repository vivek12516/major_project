import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award, 
  Plus,
  Eye,
  Clock,
  Star,
  ArrowRight,
  BarChart3,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../layout/Sidebar';

export default function Home() {
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    setUserRole(role || 'student');
    setUserName(name || 'User');
  }, []);

  const teacherStats = [
    { icon: BookOpen, label: 'Total Courses', value: '12', change: '+2 this month', color: 'blue' },
    { icon: Users, label: 'Active Students', value: '1,247', change: '+89 this week', color: 'green' },
    { icon: TrendingUp, label: 'Revenue', value: '₹45,230', change: '+12% this month', color: 'purple' },
    { icon: Star, label: 'Avg Rating', value: '4.8', change: '+0.2 this month', color: 'yellow' },
  ];

  const studentStats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: '8', change: '+2 this month', color: 'blue' },
    { icon: Award, label: 'Certificates', value: '5', change: '+1 this week', color: 'green' },
    { icon: Clock, label: 'Learning Hours', value: '127', change: '+15 this week', color: 'purple' },
    { icon: TrendingUp, label: 'Progress', value: '78%', change: '+5% this week', color: 'yellow' },
  ];

  const recentActivities = [
    { type: 'course', title: 'New student enrolled in "React Masterclass"', time: '2 hours ago', icon: Users },
    { type: 'review', title: 'Received 5-star review on "JavaScript Basics"', time: '4 hours ago', icon: Star },
    { type: 'message', title: 'New message from Sarah Johnson', time: '6 hours ago', icon: MessageSquare },
    { type: 'achievement', title: 'Course completion rate reached 85%', time: '1 day ago', icon: Award },
  ];

  const quickActions = userRole === 'teacher' ? [
    { icon: Plus, label: 'Create Course', href: '/courses/create', color: 'indigo' },
    { icon: BarChart3, label: 'View Analytics', href: '/analytics', color: 'green' },
    { icon: Users, label: 'Manage Students', href: '/students', color: 'purple' },
    { icon: Calendar, label: 'Schedule Session', href: '/schedule', color: 'blue' },
  ] : [
    { icon: BookOpen, label: 'Browse Courses', href: '/courses', color: 'indigo' },
    { icon: Award, label: 'My Certificates', href: '/certificates', color: 'green' },
    { icon: Calendar, label: 'My Schedule', href: '/schedule', color: 'purple' },
    { icon: Users, label: 'Study Groups', href: '/groups', color: 'blue' },
  ];

  const stats = userRole === 'teacher' ? teacherStats : studentStats;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-gray-200 p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-gray-600">
                {userRole === 'teacher' 
                  ? "Here's what's happening with your courses today"
                  : "Continue your learning journey"
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Today's Schedule
              </motion.button>
              {userRole === 'teacher' && (
                <Link to="/courses/create">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-hover bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link key={index} to={action.href}>
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                        >
                          <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:bg-${action.color}-200 transition-colors`}>
                            <Icon className={`w-5 h-5 text-${action.color}-600`} />
                          </div>
                          <span className="font-medium text-gray-900 group-hover:text-gray-700">
                            {action.label}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{activity.title}</p>
                          <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {userRole === 'teacher' ? 'Grow Your Teaching Business' : 'Continue Learning'}
                </h3>
                <p className="text-indigo-100 mb-6">
                  {userRole === 'teacher' 
                    ? 'Create more courses and reach more students worldwide'
                    : 'Complete your current courses and earn certificates'
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {userRole === 'teacher' ? 'Create New Course' : 'Browse Courses'}
                </motion.button>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                  {userRole === 'teacher' ? (
                    <BookOpen className="w-16 h-16 text-white" />
                  ) : (
                    <Award className="w-16 h-16 text-white" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}