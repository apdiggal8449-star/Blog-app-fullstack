import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function MyBlogs() {
  const { blogs, setBlogs } = useAuth();

  const handleDelete = async id => {
       if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const token = localStorage.getItem("jwt"); // get stored token

      const res = await axios.delete(
        `https://blog-app-fullstack-9jah.onrender.com/api/blogs/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || "Blog deleted successfully");
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    }
  };


  if (!blogs || blogs.length === 0)
    return <p className="text-center mt-12 text-gray-500">You have not posted any blog yet!</p>;

  return (
    <div className="container w-[800px] my-12 p-4 md:ml-[260px] lg:ml-[260px]  ">
      <div className="grid min w-auto gap-6 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:ml-250 lg:ml-250">
        {blogs.map(blog => (
          <div key={blog._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            {blog.blogImage?.url && (
              <img
                src={blog.blogImage.url}
                alt={blog.title}
                className="w-full h-auto object-cover"
              />
            )}
            <div className="p-4">
              <span className="text-sm text-gray-600">{blog.category}</span>
              <h4 className="text-xl font-semibold my-2">{blog.title}</h4>
              <div className="flex justify-between mt-4">
                <Link
                  to={`/blog/update/${blog._id}`}
                  className="text-blue-500 bg-white rounded-md shadow-lg px-3 py-1 border border-gray-400 hover:underline"
                >
                  UPDATE
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="text-red-500 bg-white rounded-md shadow-lg px-3 py-1 border border-gray-400 hover:underline"
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default MyBlogs;

