import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Video, 
  Headphones, 
  Link as LinkIcon,
  BookOpen,
  Eye,
  Settings,
  Upload,
  Play
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import AddManuallyModal from "../../components/AddManuallyModal";

export default function CourseContent() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/course/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course:", err);
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const contentTypes = [
    { icon: FileText, label: "PDF Document", count: course?.pdfs?.length || 0, color: "red" },
    { icon: Video, label: "Video Lessons", count: 0, color: "blue" },
    { icon: Headphones, label: "Audio Files", count: 0, color: "green" },
    { icon: LinkIcon, label: "External Links", count: 0, color: "purple" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 p-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {course?.title || "Course Content"}
              </h1>
              <p className="text-gray-600 mt-1">Manage your course materials and structure</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Course Structure</h3>
              
              {/* Course Cover */}
              <div className="mb-6">
                {course?.coverImage ? (
                  <img
                    src={`http://localhost:3001${course.coverImage}`}
                    alt="Course cover"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-indigo-400" />
                  </div>
                )}
              </div>

              {/* Content Stats */}
              <div className="space-y-3">
                {contentTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-${type.color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 text-${type.color}-600`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{type.label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{type.count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    Reorder Content
                  </button>
                  <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    Bulk Upload
                  </button>
                  <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    Import from Library
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {/* Empty State */}
            {(!course?.pdfs || course.pdfs.length === 0) ? (
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Building Your Course</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Add your first piece of content to get started. You can upload videos, PDFs, 
                  audio files, or create interactive content.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">Upload Content</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-purple-300 text-purple-600 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Create Content</span>
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(true)}
                  className="btn-primary"
                >
                  Add Your First Content
                </motion.button>
              </div>
            ) : (
              /* Content List */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Content</span>
                  </motion.button>
                </div>

                {/* PDF List */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                  <div className="space-y-3">
                    {course.pdfs.map((pdf, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {pdf.title || `Chapter ${index + 1}`}
                            </p>
                            <p className="text-sm text-gray-500">PDF Document</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.open(`http://localhost:3001${pdf.url}`, "_blank")}
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <Play className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all"
                          >
                            <Settings className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Add Content Modal */}
      {showModal && (
        <AddManuallyModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}