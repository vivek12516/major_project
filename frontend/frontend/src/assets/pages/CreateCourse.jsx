import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowLeft, Upload, Image, DollarSign, Tag, Save, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "../../layout/Sidebar";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [plan, setPlan] = useState("free");
  const [totalPrice, setTotalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          const res = await axios.get(`http://localhost:3001/api/course/${id}`);
          const course = res.data;
          setTitle(course.title);
          setDescription(course.description);
          setPlan(course.pricingPlan);
          setTotalPrice(course.totalPrice);
          setDiscountedPrice(course.discountedPrice);
          if (course.coverImage) {
            setCoverPreview(`http://localhost:3001${course.coverImage}`);
          }
        } catch (err) {
          console.error("Failed to fetch course:", err);
          toast.error("Failed to load course data");
        }
      };
      fetchCourse();
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description || (!coverImage && !id)) {
      toast.error("Please fill all required fields including cover image.");
      return;
    }

    if (plan === "one-time" && (!totalPrice || !discountedPrice)) {
      toast.error("Please enter total and discounted price for one-time plan.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("pricingPlan", plan);
      formData.append("totalPrice", plan === "one-time" ? totalPrice : 0);
      formData.append("discountedPrice", plan === "one-time" ? discountedPrice : 0);
      if (coverImage) formData.append("coverImage", coverImage);

      const token = localStorage.getItem("token");

      let response;
      if (id) {
        response = await axios.put(
          `http://localhost:3001/api/course/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Course updated successfully!");
      } else {
        response = await axios.post(
          "http://localhost:3001/api/create",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Course created successfully!");
      }

      const courseId = response.data._id || id;
      navigate(`/course-content/${courseId}`);
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Failed to save course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      <div className="flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-gray-200 p-8"
        >
          <div className="flex items-center justify-between">
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
                  {id ? "Edit Course" : "Create New Course"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {id ? "Update your course details" : "Share your knowledge with the world"}
                </p>
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
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{loading ? "Saving..." : "Save Course"}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Tag className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter an engaging course title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Description *
                    </label>
                    <textarea
                      placeholder="Describe what students will learn in this course..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="6"
                      className="input-field resize-none"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              {/* Cover Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Image className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Cover Image *</h2>
                </div>

                <div className="space-y-4">
                  {coverPreview ? (
                    <div className="relative">
                      <img
                        src={coverPreview}
                        alt="Course cover preview"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverPreview("");
                          setCoverImage(null);
                        }}
                        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-indigo-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload a cover image for your course</p>
                      <p className="text-sm text-gray-500 mb-4">Recommended: 1280x720px, JPG or PNG</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label
                        htmlFor="cover-upload"
                        className="btn-secondary cursor-pointer inline-flex items-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose Image</span>
                      </label>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Pricing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Pricing</h2>
                </div>

                <div className="space-y-6">
                  {/* Free Plan */}
                  <motion.label
                    whileHover={{ scale: 1.01 }}
                    className={`block border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      plan === "free"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="radio"
                        name="pricing"
                        value="free"
                        checked={plan === "free"}
                        onChange={() => setPlan("free")}
                        className="w-5 h-5 text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-lg text-gray-900">Free Course</div>
                        <div className="text-gray-600">
                          Make your course available to everyone at no cost
                        </div>
                      </div>
                    </div>
                  </motion.label>

                  {/* Paid Plan */}
                  <motion.label
                    whileHover={{ scale: 1.01 }}
                    className={`block border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      plan === "one-time"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <input
                        type="radio"
                        name="pricing"
                        value="one-time"
                        checked={plan === "one-time"}
                        onChange={() => setPlan("one-time")}
                        className="w-5 h-5 text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-lg text-gray-900">One-time Payment</div>
                        <div className="text-gray-600">
                          Students pay once for lifetime access
                        </div>
                      </div>
                    </div>

                    {plan === "one-time" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
                      >
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Original Price *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <input
                              type="number"
                              value={totalPrice}
                              onChange={(e) => setTotalPrice(e.target.value)}
                              className="input-field pl-8"
                              placeholder="2999"
                              min="0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Discounted Price *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <input
                              type="number"
                              value={discountedPrice}
                              onChange={(e) => setDiscountedPrice(e.target.value)}
                              className="input-field pl-8"
                              placeholder="1999"
                              min="0"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.label>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Tip:</strong> You can always change your pricing later. Consider starting 
                    with a lower price to attract initial students and build reviews.
                  </p>
                </div>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}