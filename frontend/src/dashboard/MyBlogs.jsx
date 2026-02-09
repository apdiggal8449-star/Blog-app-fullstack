/*import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function MyBlogs() {
  const { blogs, setBlogs } = useAuth();

  const handleDelete = async id => {
    try {
      const res = await axios.delete(
        `https://blog-app-fullstack-9jah.onrender.com/api/blogs/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(res.data.message || "Blog deleted successfully");

      setBlogs(prev => prev.filter(blog => blog._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    }
  };

  if (!blogs || blogs.length === 0)
    return <p className="text-center mt-12 text-gray-500">You have not posted any blog yet!</p>;

  return (
    <div className="container mx-auto my-12 p-4 ml-[220px]">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:ml-20">
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
}*/
import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { HiMenu } from "react-icons/hi"; // hamburger menu icon
import { AiOutlineClose } from "react-icons/ai"; // close icon

function MyBlogs() {
  const { blogs, setBlogs } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

  const handleDelete = async (id) => {
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:block`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Sidebar</h2>
          <button
            className="md:hidden text-2xl"
            onClick={() => setSidebarOpen(false)}
          >
            <AiOutlineClose />
          </button>
        </div>
        {/* Sidebar content */}
        <nav className="p-4">
          <Link className="block py-2 px-3 rounded hover:bg-gray-200" to="/">
            Home
          </Link>
          <Link className="block py-2 px-3 rounded hover:bg-gray-200" to="/create-blog">
            Create Blog
          </Link>
          <Link className="block py-2 px-3 rounded hover:bg-gray-200" to="/my-blogs">
            My Blogs
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-4">
        {/* Mobile menu button */}
        <div className="md:hidden mb-4 flex justify-between items-center">
          <button
            className="text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            <HiMenu />
          </button>
          <h2 className="text-2xl font-bold">My Blogs</h2>
        </div>

        {(!blogs || blogs.length === 0) ? (
          <p className="text-center mt-12 text-gray-500">
            You have not posted any blog yet!
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex flex-col"
              >
                <img
                  src={blog.blogImage?.url || "/imgPL.webp"} // fallback
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-sm text-gray-600">{blog.category}</span>
                  <h4 className="text-xl font-semibold my-2 flex-grow">{blog.title}</h4>
                  <div className="flex justify-between mt-4">
                    <Link
                      to={`/blog/update/${blog._id}`}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md shadow"
                    >
                      UPDATE
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md shadow"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBlogs;

