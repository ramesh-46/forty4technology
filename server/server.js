const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();

// =======================
// Middleware
// =======================
app.use(express.json());

// ✅ Use only one CORS config
app.use(
  cors({
    origin: ["http://localhost:3000", "https://forty4technology.vercel.app"],
    credentials: true,
  })
);

// =======================
// MongoDB Connection
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// =======================
// Routes
// =======================
app.use("/api/users", userRoutes);

// ✅ Health check route (for Render)
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// =======================
// Start server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const userRoutes = require("./routes/userRoutes");

// dotenv.config();
// const app = express();

// // =======================
// // Middleware
// // =======================
// app.use(express.json());

// // ✅ Configure CORS
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",             // for local React dev
//       "https://forty4technology.vercel.app" // for deployed frontend
//     ],
//     credentials: true,
//   })
// );

// // =======================
// // MongoDB Connection
// // =======================
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // =======================
// // Routes
// // =======================
// app.use("/api/users", userRoutes);

// // ✅ Health check route (for Render)
// app.get("/", (req, res) => {
//   res.send("🚀 API is running...");
// });

// =======================
// Start server
// // =======================
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
