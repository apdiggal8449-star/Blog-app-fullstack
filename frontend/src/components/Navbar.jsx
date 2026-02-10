import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

function Navbar() {
  const [show, setShow] = useState(false); // mobile menu toggle
  const { profile, isAuthenticated, setIsAuthenticated } = useAuth();
  const navigateTo = useNavigate();

  // ✅ Logout handler
 /* const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get("https://blog-app-fullstack-9jah.onrender.com/api/users/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("jwt");
      toast.success(data.message);
      setIsAuthenticated(false);
      navigateTo("/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }*/
const handleLogout = async (e) => { e.preventDefault(); const token = localStorage.getItem("jwt"); try { const { data } = await axios.get( "https://blog-app-fullstack-9jah.onrender.com/api/users/logout", { headers: { Authorization: Bearer ${token}, }, } ); localStorage.removeItem("jwt"); setIsAuthenticated(false); toast.success(data.message); navigateTo("/login"); } catch (error) { console.log(error); toast.error("Failed to logout"); } };


  // ✅ User photo (default if missing)
  const userPhoto = profile?.photo?.url || profile?.photo || "/default-avatar.png";

  return (
    <>
      <nav className="shadow-lg px-4 py-2">
        <div className="flex items-center justify-between container mx-auto">
          {/* Logo */}
          <div className="font-semibold text-xl">
            Interesting<span className="text-blue-500">Blogs</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="mx-6">
            <ul className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-blue-500">HOME</Link>
              <Link to="/blogs" className="hover:text-blue-500">BLOGS</Link>
              <Link to="/creators" className="hover:text-blue-500">CREATORS</Link>
              <Link to="/about" className="hover:text-blue-500">ABOUT</Link>
              <Link to="/contact" className="hover:text-blue-500">CONTACT</Link>
            </ul>
            {/* Mobile Menu Icon */}
            <div className="md:hidden" onClick={() => setShow(!show)}>
              {show ? <IoCloseSharp size={24} /> : <AiOutlineMenu size={24} />}
            </div>
          </div>

          {/* Desktop Right Side (Buttons + Profile Image) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Admin Dashboard Link */}
            {isAuthenticated && profile?.role === "admin" && (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white font-semibold hover:bg-blue-800 duration-300 px-4 py-2 rounded"
              >
                DASHBOARD
              </Link>
            )}

            {/* Login / Logout */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded"
              >
                LOGIN
              </Link>
            ) : (
              <>
                {/* User Profile Image */}
                <img
                  src={userPhoto}
                  alt="profile"
                  onClick={() => navigateTo("/profile")}
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-400 hover:border-blue-500"
                />

                 <form onSubmit={handleLogout}>
  <button type="submit"  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-200">Logout</button>
</form>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {show && (
          <div className="bg-white md:hidden p-4">
            <ul className="flex flex-col items-center space-y-3 text-xl">
              <Link to="/" onClick={() => setShow(false)} className="hover:text-blue-500">HOME</Link>
              <Link to="/blogs" onClick={() => setShow(false)} className="hover:text-blue-500">BLOGS</Link>
              <Link to="/creators" onClick={() => setShow(false)} className="hover:text-blue-500">CREATORS</Link>
              <Link to="/about" onClick={() => setShow(false)} className="hover:text-blue-500">ABOUT</Link>
              <Link to="/contact" onClick={() => setShow(false)} className="hover:text-blue-500">CONTACT</Link>

              {/* Admin Dashboard for mobile */}
              {isAuthenticated && profile?.role === "admin" && (
                <Link
                  to="/dashboard"
                  onClick={() => setShow(false)}
                  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-800 w-full text-center mt-2"
                >
                  DASHBOARD
                </Link>
              )}

              {/* Profile button */}
              {isAuthenticated && (
                <Link
                  to="/profile"
                  onClick={() => setShow(false)}
                  className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded w-full text-center mt-2 hover:bg-gray-300"
                >
                  PROFILE
                </Link>
              )}

              {/* Logout / Login */}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setShow(false)}
                  className="bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-800 w-full text-center mt-2"
                >
                  LOGIN
                </Link>
              ) : (
               <form onSubmit={handleLogout}>
  <button type="submit"  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-200">Logout</button>
</form>

              )}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
