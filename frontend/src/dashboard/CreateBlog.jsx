import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider"; // ✅ useAuth se global blogs state lo

function CreateBlog() {
  // ✅ Local state for form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Track loading

  // ✅ Global blogs state from context
  const { blogs, setBlogs } = useAuth();

  // ✅ Handle image selection and preview
  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setBlogImagePreview(reader.result); // show preview
        setBlogImage(file); // store image
      };
    }
  };

  // ✅ Form submit handler
  const handleCreateBlog = async (e) => {
    e.preventDefault(); // stop form reload

    // ✅ Frontend validation
    if (!title.trim() || !about.trim() || !category || !blogImage) {
      toast("Please fill all the fields!", {
        style: { background: "#facc15", color: "#000" },
      });
      return;
    }
    if (title.trim().length < 5) {
      toast("Title must be at least 5 characters!", {
        style: { background: "#facc15", color: "#000" },
      });
      return;
    }
    if (about.trim().length < 20) {
      toast("About section must be at least 20 characters!", {
        style: { background: "#facc15", color: "#000" },
      });
      return;
    }

    setLoading(true); // ✅ Disable button & show loading

    try {
      // ✅ Prepare form data for backend
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("about", about);
      formData.append("blogImage", blogImage);

      // ✅ API call
      const { data } = await axios.post(
        "https://blog-app-fullstack-9jah.onrender.com/api/blogs/create",
        formData,
        {
          withCredentials: true,
          headers: {
             Authorization: `Bearer ${token}`, // ✅ send token
            "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(data.message || "Blog created successfully!");

      // ✅ Immediately add new blog to global state so UI updates
      if (data.blog) {
        setBlogs([data.blog, ...blogs]); // prepend new blog to list
      }

      // ✅ Reset form after success
      setTitle("");
      setCategory("");
      setAbout("");
      setBlogImage(null);
      setBlogImagePreview("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false); // ✅ Stop loading after response
    }
  };

  return (
    <div className="min-h-screen py-6 ml-[300px]">
      <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-8">Create Blog</h3>

        {/* ✅ Form */}
        <form onSubmit={handleCreateBlog} className="space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <label className="block text-lg">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            >
              <option value="">Select Category</option>
              <option value="Devotion">Devotion</option>
              <option value="Sports">Sports</option>
              <option value="Coding">Coding</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Business">Business</option>
            </select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-lg">Title</label>
            <input
              type="text"
              placeholder="Enter your blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            />
          </div>

          {/* Blog Image */}
          <div className="space-y-2">
            <label className="block text-lg">Blog Image</label>
            <div className="flex items-center justify-center mb-2">
              <img
                src={blogImagePreview || "/football.jpg"}
                alt="Preview"
                className="w-full max-w-sm h-auto rounded-md object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={changePhotoHandler}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            />
          </div>

          {/* About */}
          <div className="space-y-2">
            <label className="block text-lg">About</label>
            <textarea
              rows="5"
              placeholder="Write something about your blog"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading} // ✅ Disable while loading
            className={`w-full py-3 px-4 text-white rounded-md transition-colors duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating..." : "Post Blog"} {/* ✅ Show status */}
          </button>
        </form>

        {/* Optional status text */}
        {loading && (
          <p className="mt-2 text-yellow-600 font-medium">Creating blog...</p>
        )}
      </div>
    </div>
  );
}

export default CreateBlog;
