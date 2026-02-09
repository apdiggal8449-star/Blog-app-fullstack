import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthProvider"; // ✅ Global blogs state

function UpdateBlog() {
  const navigateTo = useNavigate();
  const { id } = useParams();

  const { blogs, setBlogs } = useAuth(); // ✅ Global blogs state from context

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");

  const [blogImageFile, setBlogImageFile] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState("");
  const [existingBlogImage, setExistingBlogImage] = useState("");

  const [loading, setLoading] = useState(false); // ✅ disable button + show status

  // Handle image selection
  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBlogImagePreview(reader.result);
      setBlogImageFile(file);
    };
  };

  // Fetch blog data on mount
  useEffect(() => {
    const fetchBlog = async () => {
    
      try {
          const token = localStorage.getItem("jwt");

const { data } = await axios.put(
  `https://blog-app-fullstack-9jah.onrender.com/api/blogs/update/${id}`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  }
);

        setTitle(data?.title || "");
        setCategory(data?.category || "");
        setAbout(data?.about || "");
        setExistingBlogImage(data?.blogImage?.url || "");
        setBlogImagePreview(data?.blogImage?.url || "");
      } catch (error) {
        toast.error("Failed to fetch blog data");
      }
    };
    fetchBlog();
  }, [id]);

  // Handle blog update
  const handleUpdate = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation
    if (!title.trim() || !about.trim() || !category) {
      toast("Please fill all the fields!", { style: { background: "#facc15", color: "#000" } });
      return;
    }
    if (title.trim().length < 5) {
      toast("Title must be at least 5 characters!", { style: { background: "#facc15", color: "#000" } });
      return;
    }
    if (about.trim().length < 20) {
      toast("About must be at least 20 characters!", { style: { background: "#facc15", color: "#000" } });
      return;
    }

    setLoading(true); // ✅ disable + show status

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("about", about);

    if (blogImageFile) {
      formData.append("blogImage", blogImageFile);
    }

    try {
     const token = localStorage.getItem("jwt");

const { data } = await axios.put(
  `https://blog-app-fullstack-9jah.onrender.com/api/blogs/update/${id}`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  }
);


      toast.success(data.message || "Blog updated successfully");

      // ✅ Update blogs in context immediately
      setBlogs((prevBlogs) =>
        prevBlogs.map((b) =>
          b._id === id
            ? {
                ...b,
                title,
                category,
                about,
                blogImage: blogImageFile
                  ? { url: blogImagePreview }
                  : b.blogImage,
              }
            : b
        )
      );

      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false); // ✅ reset loading
    }
  };

  return (
    <div className="container mx-auto my-12 p-4">
      <section className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-6">UPDATE BLOG</h3>
        <form onSubmit={handleUpdate}>
          {/* Category */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Category</label>
            <select
              className="w-full p-2 border rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
          <input
            type="text"
            placeholder="BLOG MAIN TITLE"
            className="w-full p-2 mb-4 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Blog Image */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">BLOG IMAGE</label>
            <img
              src={blogImagePreview || existingBlogImage ||"https://via.placeholder.com/600x400?text=No+Image"}
              alt="Blog Main"
              className="w-full h-auto object-cover mb-4 rounded-md"
            />
            <input
              type="file"
              className="w-full p-2 border rounded-md"
              onChange={changePhotoHandler}
            />
          </div>

          {/* About */}
          <textarea
            rows="6"
            className="w-full p-2 mb-4 border rounded-md"
            placeholder="Something about your blog at least 200 characters!"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 text-white rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>

        {/* Optional Status */}
        {loading && <p className="mt-2 text-yellow-600 font-medium">Updating blog...</p>}
      </section>
    </div>
  );
}

export default UpdateBlog;
