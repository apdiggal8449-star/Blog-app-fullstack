import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import cors from "cors";
//import os from "os";
import fs from "fs";

dotenv.config();
const app = express();

const port = process.env.PORT || Math.floor(Math.random() * 10000) + 2000;
const MONOG_URI = process.env.MONOG_URI;

// ✅ Debug Cloudinary env vars (optional for Render logs)
//console.log("Cloudinary ENV:", {
 // CLOUD_NAME: process.env.CLOUD_NAME,
 // API_KEY: !!process.env.CLOUD_API_KEY,
  //SECRET_KEY: !!process.env.CLOUD_SECRET_KEY ,
  
//});

// -------------------- MIDDLEWARE --------------------

app.use(cookieParser());

// ✅ Use system temp directory (Render compatible)
//const tempDir = os.tmpdir();
//console.log("Using TEMP DIR:", tempDir);
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // ✅ fixed directory (Render supports /tmp)
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (avoid PayloadTooLargeError)
    debug: true, // to see upload logs in Render
  }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// ✅ CORS
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// -------------------- DB CONNECTION --------------------
try {
  await mongoose.connect(MONOG_URI);
  console.log("✅ Connected to MongoDB");
} catch (error) {
  console.error("❌ MongoDB connection failed:", error);
}

// -------------------- CLOUDINARY CONFIG --------------------
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
console.log("✅ Cloudinary configured");

// -------------------- ROUTES --------------------
app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);

app.get("/", (req, res) => {
  res.json({
    activeStatus: true,
    message: "Server is live and running",
  });
});

// -------------------- START SERVER --------------------
app
  .listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${port} is already in use`);
    } else {
      console.error(err);
    }
  });