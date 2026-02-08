import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";

function Blogs() {
  const { blogs } = useAuth(); // ✅ get global blogs state

  if (!blogs || blogs.length === 0) {
    return <div className="text-center mt-12">No blogs available.</div>;
  }

  return (
    <div className="container mx-auto my-12 p-4">
      <h1 className="text-2xl font-bold mb-6">All Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {blogs.map((blog) => (
          <Link
            to={`/blog/${blog._id}`}
            key={blog._id}
            className="relative rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={blog.blogImage?.url}
              alt={blog.title}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-lg font-semibold">{blog.title}</h2>
              <p className="text-sm">{blog.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Blogs;