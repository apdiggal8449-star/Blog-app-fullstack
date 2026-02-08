import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/AuthToken.js";

// -------------------- REGISTER --------------------
export const register = async (req, res) => {
  try {
    
    console.log("BODY =>", req.body);
    console.log("FILES =>", req.files);
    console.log("Register attempt:", req.body);

    // Photo required check
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "User photo is required" });
    }

    const { photo } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only jpg, png, webp allowed",
      });
    }

    // Required fields check
    const { email, name, password, phone, education, role } = req.body;
    if (!email || !name || !password || !phone || !education || !role) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Duplicate user check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Upload photo to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log("Cloudinary error:", cloudinaryResponse.error);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      phone,
      education,
      role,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    });

    await newUser.save();

    // Generate JWT token
    const token = await createTokenAndSaveCookies(newUser._id, res);
    console.log("Signup Token: ", token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        //phone nahi tha add kiya 
        phone:newUser.phone,
        role: newUser.role,
        education: newUser.education,
        photo: newUser.photo,
      },
      token,
    });
  } catch (error) {
    console.log("Register error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log("Login attempt:", { email, role });

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const user = await User.findOne({ email }).select("+password");
    console.log("User from DB:", user);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password incorrect");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.role !== role) {
      console.log(`Role mismatch: ${role} vs ${user.role}`);
      return res.status(400).json({ message: `Given role ${role} not found` });
    }

    const token = await createTokenAndSaveCookies(user._id, res);
    console.log("Login Token: ", token);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
      token,
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// -------------------- LOGOUT --------------------
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Logout error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// -------------------- GET MY PROFILE --------------------
// Example Node/Express controller

//export const getMyProfile = async (req, res) => {
 // try {
   // const user = await User.findById(req.user._id); // req.user._id from middleware
    //console.log("Profile fetched:", user); // debug
  //  res.status(200).json({ user }); // must send entire user object including phone
 // } catch (error) {
   // res.status(500).json({ message: "Server Error" });
 // }
//

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // middleware se user id
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("Profile fetched:", user); // ✅ debug

    res.status(200).json({ user }); // must include phone, name, email, role, photo
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- GET ADMINS --------------------
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json({ admins });
  } catch (error) {
    console.log("Get admins error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};