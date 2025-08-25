const express = require("express");
const cors = require("cors");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
// ✅ Allowed origins
const allowedOrigins = [
  'http://localhost:5173',                  // local dev
  'https://carbonpositivefinal.onrender.com', // Render frontend
  'https://www.gocarbonpositive.com'         // custom domain
];

// ✅ CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like Postman, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Contact Service Routes
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5015;
app.listen(PORT, () => {
  console.log(`🚀 Contact service running at http://localhost:${PORT}`);
});
