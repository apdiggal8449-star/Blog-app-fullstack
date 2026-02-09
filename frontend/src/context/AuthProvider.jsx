import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore user on page refresh
  useEffect(() => {
  const token = localStorage.getItem("jwt");
  console.log("Token from storage:", token);

  if (!token) return;

  axios.get(
    "https://blog-app-fullstack-9jah.onrender.com/api/users/my-profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  .then((res) => {
    setProfile(res.data);
    setIsAuthenticated(true);
  })
  .catch((err) => {
    console.log("Profile error:", err.response?.data);
    localStorage.removeItem("jwt");
    setIsAuthenticated(false);
  });

}, []);


  // Fetch all blogs
  useEffect(() => {
    axios
      .get("https://blog-app-fullstack-9jah.onrender.com/api/blogs/all-blogs")
      .then(res => setBlogs(res.data.blogs || []))
      .catch(err => console.log(err));
  }, []);

  return (
    <AuthContext.Provider
      value={{ blogs, setBlogs, profile, setProfile, isAuthenticated, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
