import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const { setProfile, setIsAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://blog-app-fullstack-9jah.onrender.com/api/users/login",
        { email, password, role },
        { withCredentials: true }
      );

      console.log("Login Success:", data);
    
      
      // ✅ Save token & context
      localStorage.setItem("jwt", data.token);
console.log("Saved token:", localStorage.getItem("jwt"));

      setProfile(data.user);
      setIsAuthenticated(true);

      toast.success(data.message || "Login successful!");
      navigate("/"); // redirect to home
    } catch (err) {
      console.error("Login Error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <div className="font-semibold text-xl text-center mb-6">
          Cilli<span className="text-blue-500">Blog</span>
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {/* Role select */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md"
          required
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="email"
          placeholder="Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded-md"
          required
        />

        <input
          type="password"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded-md"
          required
        />

        <p className="text-center mb-4">
          New User?{" "}
          <Link to="/register" className="text-blue-600">
            Register Now
          </Link>
        </p>

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
