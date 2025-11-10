// backend/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


const evRoutes = require('./routes/ev');
const solarRoutes = require('./routes/solar');

const treeRoutes = require('./routes/treeRoutes');
const imageRoutes = require('./routes/imageRoutes');
const creditRoutes = require('./routes/creditRoutes');
const evTransactionRoutes = require('./routes/evTransactionRoutes');
const assetRoutes=require('./routes/asset')


const connectMongo = require('./config/mongo'); // ✅ Mongo connect

dotenv.config();
const app = express();

// ✅ Connect MongoDB
connectMongo();

// ✅ Middlewares
// ✅ Allowed origins
const allowedOrigins = [
  'http://localhost:5173',                  // local dev
  'https://carbonpositivefinal.onrender.com', // Render frontend
  'https://www.gocarbonpositive.com',
  'https://frontend-user-etef.onrender.com'// custom domain
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


// ✅ Admin routes

// ✅ Other routes
app.use('/api/evmasterdata', evRoutes);
app.use('/api/solarpanel', solarRoutes);
app.use('/api/tree', treeRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api', require('./routes/evTransactionRoutes'));

app.use('/api/assets', assetRoutes);

// ✅ Test endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
