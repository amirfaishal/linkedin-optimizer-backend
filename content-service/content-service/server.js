require('dotenv').config({ path: __dirname + '/.env' }); // <-- force local .env

const express = require('express');
const connectDB = require('./config/db');
const blogRoutes = require('./routes/blogRoutes');

const cors = require("cors");

const app = express();
connectDB();
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
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 5009;
app.listen(PORT, () => {
  console.log(`Blog Service running on port ${PORT}`);
});
