import React from "react";
import Navbar from "../src/components/Navbar";
import Home from "../src/components/Home";
import Footer from "../src/components/Footer";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Blogs from "../src/pages/Blogs";
import About from "../src/pages/About";
import Contact from "../src/pages/Contact";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import Dashboard from "../src/pages/Dashboard";
import Creators from "./pages/Creators";
import { useAuth } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";
import UpdateBlog from "./dashboard/UpdateBlog";
import Detail from "./pages/Detail";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/userProfile"; // 👈 User profile import

function App() {
  const location = useLocation();
  const hideNavbarFooter = ["/dashboard", "/login", "/register"].includes(
    location.pathname
  );

  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Navbar hide only for dashboard, login, register */}
      {!hideNavbarFooter && <Navbar />}

      <Routes>
        {/* Home - only when logged in */}
        <Route
          exact
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />

        {/* Public pages */}
        <Route exact path="/blogs" element={<Blogs />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/creators" element={<Creators />} />

        {/* Auth pages */}
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />

        {/* Admin dashboard - secure */}
        <Route
          exact
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Blog routes */}
        <Route exact path="/blog/:id" element={<Detail />} />
        <Route exact path="/blog/update/:id" element={<UpdateBlog />} />

        {/* ✅ User profile page - secure */}
        <Route
          exact
          path="/profile"
          element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toaster for notifications */}
      <Toaster position="top-right" containerStyle={{ zIndex: 9999 }} />

      {/* Footer hide only for dashboard, login, register */}
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;