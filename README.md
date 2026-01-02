# Smart Healthcare Platform

A unified digital healthcare platform connecting Patients, Doctors, and Administrators. This application features real-time appointments, teleconsultations, medical record management, and comprehensive dashboards for all user roles.

## 🚀 Features

- **For Patients:**
  - 🩺 Book In-person & Online Appointments
  - 📹 Real-time Teleconsultation (Video/Audio)
  - 📂 manage Medical Records & Prescriptions
  - 📊 Health Overview & Recovery Tracking
  - 🔔 Real-time Notifications

- **For Doctors:**
  - 📅 Manage Appointment Schedule
  - 📝 Write Digital Prescriptions
  - 👥 View Patient History & Reports
  - 💰 Track Earnings & Reviews

- **For Administrators:**
  - 🏥 Manage Departments, Doctors, and Patients
  - 📈 Platform Analytics & Reporting

## 🛠 Tech Stack

- **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/)
- **Backend:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **Real-time:** [Socket.io](https://socket.io/), [WebRTC](https://webrtc.org/) (Simple-Peer)
- **Storage:** Cloudinary (Primary) with Local Fallback
- **Containerization:** Docker & Docker Compose

## 📋 Prerequisites

- **Node.js**: v16+
- **MongoDB**: v5+ (Local or Atlas) or Docker
- **Docker** (Optional, for containerized run)

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory and a `.env` file in the `client` directory (if needed, though Vite uses `import.meta.env`).

### Server (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart_healthcare
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary (Optional - for image upload optimization)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
```

## 🚀 Installation & Running

### Option 1: Run with Docker (Recommended)
This will start both the client, server, and a local MongoDB instance.
```bash
docker-compose up --build
```
- **Client:** http://localhost:5173
- **Server:** http://localhost:5000

---

### Option 2: Run Manually

#### 1. Start the Backend
```bash
cd server
npm install
npm start
```
*Server runs on http://localhost:5000*

#### 2. Start the Frontend
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
*Client runs on http://localhost:5173*

## 🐛 Troubleshooting

- **MongoDB Connection Error:**
  - Ensure MongoDB is running locally (`mongod`).
  - If using Docker, ensure the container is up.
  - Check `MONGO_URI` in `server/.env`.
  
- **Port Conflicts (EADDRINUSE):**
  - If port 5000 is busy, kill the process: `npx kill-port 5000` or change `PORT` in `.env`.

- **Teleconsultation Issues:**
  - Ensure you grant Camera/Microphone permissions.
  - WebRTC requires a secure context (HTTPS) or `localhost`.
