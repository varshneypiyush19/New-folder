const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const Profile = require("./models/profile");
const Location = require("./models/location");

const app = express();
require("dotenv").config();

// Middleware

// const corsOptions = {
//   origin: process.env.REACT_APP_FRONTEND_URL,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// };
app.use(cors());
app.use(bodyParser.json());

// Serve static files from /uploads
app.use("/uploads", express.static("uploads"));

// MongoDB connection
mongoose
  .connect(process.env.REACT_APP_MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Setup Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// Route: Upload profile photo
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    res.status(200).json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

// Route: Submit full profile data
app.post("/api/submit", async (req, res) => {
  try {
    const profile = new Profile(req.body);
    await profile.save();
    res.status(201).json({ success: true, message: "Profile saved!" });
  } catch (err) {
    console.error("❌ Error saving profile:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Get all countries
app.get("/api/countries", async (req, res) => {
  try {
    const countries = await Location.find().distinct("country");
    res.json(countries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

// Get states for a country
app.get("/api/states/:country", async (req, res) => {
  try {
    const country = req.params.country;
    const location = await Location.findOne({ country });
    if (location) {
      res.json(location.states.map((s) => s.name));
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch states" });
  }
});

// Get cities for a state
app.get("/api/cities/:state", async (req, res) => {
  try {
    const stateName = req.params.state;
    const location = await Location.findOne({ "states.name": stateName });
    if (!location) return res.json([]);

    const state = location.states.find((s) => s.name === stateName);
    res.json(state ? state.cities : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});
app.get("/api/check-username", async (req, res) => {
  const username = req.query.username;
  // Handle empty or too-short usernames gracefully
  if (!username || username.trim().length < 3) {
    return res.status(400).json({ available: false, message: "Too short" });
  }
  // if (!username)
  //   return res
  //     .status(400)
  //     .json({ available: false, error: "Username is required" });

  try {
    const user = await Profile.findOne({ username });
    if (user) {
      return res.json({ available: false });
    } else {
      return res.json({ available: true });
    }
    // res.json({ available: !existing });
  } catch (err) {
    console.error("❌ Username check error:", err);
    res.status(500).json({ available: false, error: "Internal error" });
  }
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
