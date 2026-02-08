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
    if (token) {
      setIsAuthenticated(true);
      axios
        .get("https://blog-app-fullstack-9jah.onrender.com/api/users/my-profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setProfile(res.data))
        .catch(() => {
          setIsAuthenticated(false);
          localStorage.removeItem("jwt");
        });
    }
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
