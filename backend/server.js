const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

// --- YAHAN ZAROORI BADLAAV KIYA GAYA HAI ---
// CORS (Cross-Origin Resource Sharing) ko configure karna
// Hum backend ko bata rahe hain ki sirf is 'whitelist' me maujood URLs se hi request accept karein.
const whitelist = ['https://qr-pass.netlify.app', 'http://localhost:3000']; // Local aur live, dono ko allow karein
const corsOptions = {
  origin: function (origin, callback) {
    // Agar request in URLs se aa rahi hai, toh use allow karo
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      // Warna use block kar do
      callback(new Error('Not allowed by CORS'))
    }
  }
};
app.use(cors(corsOptions));
// --- BADLAAV KHATAM ---


app.use(express.json());


app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/passes', require('./routes/passRoutes'));


const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
