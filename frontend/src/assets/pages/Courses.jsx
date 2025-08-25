import React, { useEffect, useState } from 'react';
import Sidebar from '../../layout/Sidebar';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaWrench, FaPen, FaUsers, FaEye, FaCommentDots } from "react-icons/fa";
import { BookOpen, Plus, Users, Award, TrendingUp, Filter, Search } from 'lucide-react';

export default function Courses() {
  const [role, setRole] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const navigate = useNavigate();

  // 🔐 check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // redirect if no token
      return;
    }

    const userRole = localStorage.getItem("role");
    setRole(userRole);

    // fetch courses
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses", err);
        if (err.response && err.response.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  // show nothing until auth check is done
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen pt-20">
      <Sidebar />

      <div className={`flex-1 ${role === 'teacher' ? 'ml-80' : ''} p-8`}>
        {/* Topbar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Courses
              </h1>
              <p className="text-gray-600 text-lg">
                {role === 'teacher' 
                  ? `Manage your ${courses.length} courses and track performance`
                  : `Continue learning with ${courses.length} enrolled courses`
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {role === "teacher" && (
                <Link to="/courses/create">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Course</span>
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
                <p className="text-gray-600 font-medium">Total Courses</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">1,247</p>
                <p className="text-gray-600 font-medium">Students</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">4.8</p>
                <p className="text-gray-600 font-medium">Avg Rating</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">₹45k</p>
                <p className="text-gray-600 font-medium">Revenue</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Add Filters</span>
              </motion.button>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
                <button className="px-4 py-2 bg-white rounded-lg shadow-sm font-medium text-gray-900">
                  Grid
                </button>
                <button className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900">
                  List
                </button>
              </div>
            </div>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by title, category..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
              />
            </div>
          </div>
        </motion.div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Courses Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {role === 'teacher' 
                ? "Start creating your first course and share your knowledge with the world."
                : "Browse our course catalog and start your learning journey today."
              }
            </p>
          {role === "teacher" && (
            <Link to="/courses/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Create Your First Course
              </motion.button>
            </Link>
          )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Course Cover */}
                <div 
                  className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 cursor-pointer relative overflow-hidden"
                  onClick={() => navigate(`/courses/edit/${course._id}`)}
                >
                  {course.coverImage ? (
                    <img
                      src={`http://localhost:3001${course.coverImage}`}
                      alt="Course Cover"
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-indigo-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 font-medium">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      course.pricingPlan === 'free' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {course.pricingPlan === 'free' ? 'Free' : 'Premium'}
                    </span>
                    {course.pricingPlan === 'one-time' && (
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">₹{course.discountedPrice}</span>
                        {course.totalPrice > course.discountedPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">₹{course.totalPrice}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Course Info"
                      >
                        <FaInfoCircle className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        title="Settings"
                      >
                        <FaWrench className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Edit Course"
                      >
                        <FaPen className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Students"
                      >
                        <FaUsers className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/courses/preview/${course._id}`)}
                        className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                        title="Preview"
                      >
                        <FaEye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all"
                        title="Comments"
                      >
                        <FaCommentDots className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
