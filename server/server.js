const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Force reload trigger 3

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists for local storage
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory at', uploadsDir);
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/patient', require('./routes/patientRoutes')); // New Route
app.use('/api/doctor', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes')); // Departments Route

// Database Connection
const defaultMongoUri = 'mongodb://127.0.0.1:27017/smart_healthcare';
let mongoUri = process.env.MONGO_URI || defaultMongoUri;
// If env uses 'localhost', replace with IPv4 address to avoid IPv6 ::1 resolving issues on some platforms
if (mongoUri.includes('localhost')) {
  mongoUri = mongoUri.replace('localhost', '127.0.0.1');
}
// Avoid printing credentials if present — only log the host for debugging
try {
  const hostOnly = new URL(mongoUri.replace('mongodb://', 'http://')).host;
  console.log('Attempting MongoDB connection to:', hostOnly);
} catch (e) {
  console.log('Attempting MongoDB connection');
}
mongoose.connect(mongoUri, { dbName: 'smartHealthcareDB' })
  .then((conn) => {
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Connected to Database Name: ${conn.connection.name}`);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    console.error('Hints: Ensure MongoDB is running and MONGO_URI is reachable.');
    console.error('If running locally, consider setting MONGO_URI to mongodb://127.0.0.1:27017/smart_healthcare');
  });

// Basic Route
app.get('/', (req, res) => {
  res.send('Smart Healthcare Platform API is running');
});

// Health endpoint for quick checks
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const http = require('http');
const setupSocket = require('./realtime/socket');

function startServer(initialPort, maxRetries = 5) {
  let currentAttempt = 0;
  let port = initialPort;

  const tryListen = () => {
    currentAttempt += 1;
    const server = http.createServer(app);
    setupSocket(server);

    server.on('listening', () => {
      const address = server.address();
      console.log(`Server listening on ${address.address}:${address.port} (family: ${address.family})`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is in use. Attempt ${currentAttempt} of ${maxRetries}.`);
        server.close?.();
        if (currentAttempt < maxRetries) {
          port += 1; // try next port
          console.log(`Trying port ${port}...`);
          setTimeout(tryListen, 200);
          return;
        }
        console.error('Failed to bind server to a port after multiple attempts. Exiting.');
        process.exit(1);
      }
      console.error('Server error:', err);
      process.exit(1);
    });

    // Bind explicitly to 0.0.0.0 to ensure both IPv4 and IPv6 reachability on Windows
    server.listen(port, '0.0.0.0');
  };

  tryListen();
}

// Start Server with retry/fallback on port collisions
const parsedPort = parseInt(process.env.PORT, 10) || PORT;
startServer(parsedPort, 5);

// Global error handler to log middleware errors (like multer) and respond
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err) return res.status(500).json({ message: 'Server Error', error: err.message });
  next();
});
