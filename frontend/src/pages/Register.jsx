import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Register() {
  const { setIsAuthenticated, setProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [education, setEducation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle photo select
  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ✅ Register handler
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!photo) {
      toast.error("Please select a profile photo");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("password", password.trim());
      formData.append("role", role);
      formData.append("education", education);
      formData.append("photo", photo);

      console.log("📤 Sending FormData:", Object.fromEntries(formData.entries()));

      const { data } = await axios.post(
        "http://localhost:2890/api/users/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // ✅ Important for cookies on Render
        }
      );

      toast.success(data.message || "User registered successfully");

      localStorage.setItem("jwt", data.token);
      setProfile(data.user);
      setIsAuthenticated(true);

      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("");
      setEducation("");
      setPhoto(null);
      setPhotoPreview("");

      navigate("/");
    } catch (error) {
      console.log("REGISTER ERROR:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please check all fields."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
       <form onSubmit={handleRegister} encType="multipart/form-data">
          <div className="font-semibold text-xl text-center mb-4">
            Cilli<span className="text-blue-500">Blog</span>
          </div>
          <h1 className="text-xl font-semibold mb-6 text-center">Register</h1>

          {/* Role */}
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

          {/* Inputs */}
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 p-2 border rounded-md"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-2 border rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Your Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

          {/* Education */}
          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
            required
          >
            <option value="">Select Education</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="MBA">MBA</option>
            <option value="BBA">BBA</option>
          </select>

          {/* Photo Upload */}
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 mr-4">
              <img
                src={photoPreview || "https://via.placeholder.com/80"}
                alt="Preview"
                className="w-full h-full object-cover rounded-md border"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={changePhotoHandler}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Link */}
          <p className="text-center mb-4">
            Already registered?{" "}
            <Link to="/login" className="text-blue-600">
              Login Now
            </Link>
          </p>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-md text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-800 duration-300"
            }`}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;