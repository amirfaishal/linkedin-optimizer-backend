const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./auth');

dotenv.config();
const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  'http://localhost:5173',                 // local dev
  'https://carbonpositivefinal.onrender.com',
  'https://www.gocarbonpositive.com' // deployed frontend
];

// ✅ CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);

// ✅ Test endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
