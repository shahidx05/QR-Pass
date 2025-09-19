const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

const whitelist = ['https://qr-pass.netlify.app', 'http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      // Warna use block kar do
      callback(new Error('Not allowed by CORS'))
    }
  }
};
app.use(cors(corsOptions));

app.use(express.json());


app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/passes', require('./routes/passRoutes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
