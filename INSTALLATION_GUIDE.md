# SlotSwapper Installation & Running Guide (Local Setup Only)

## Project Structure Overview

\`\`\`
slotswapper/
├── backend/                 # Node.js + Express API Server
│   ├── server.js           # Main server file (handles all routes)
│   ├── package.json        # Dependencies & scripts
│   ├── .env.example        # Environment variables template
│   └── .gitignore          # Git exclusions
│
├── frontend/               # React + Vite Frontend
│   ├── src/
│   │   ├── main.jsx        # React entry point
│   │   ├── App.jsx         # Main app component
│   │   ├── index.css       # TailwindCSS styles
│   │   ├── pages/          # Page components (Login, SignUp, Dashboard, etc.)
│   │   ├── components/     # Reusable components
│   │   └── utils/          # Helper functions
│   ├── package.json        # Dependencies & scripts
│   ├── .env.example        # Environment variables template
│   ├── vite.config.js      # Vite bundler configuration
│   ├── tailwind.config.js  # TailwindCSS configuration
│   ├── postcss.config.js   # PostCSS configuration
│   └── index.html          # HTML template
│
├── README.md               # Project overview
└── INSTALLATION_GUIDE.md   # This file
\`\`\`

---

## Part 1: Understanding the Tech Stack

### Backend Architecture
\`\`\`
PORT 5000
│
├─ Express Server
│  ├─ MongoDB Connection (via Mongoose)
│  ├─ JWT Authentication
│  ├─ Socket.IO Real-time Server
│  └─ Routes:
│     ├─ /api/auth/ (signup, login)
│     ├─ /api/events/ (CRUD operations)
│     └─ /api/ (swap requests)
│
└─ Database: MongoDB
   ├─ Users Collection
   ├─ Events Collection
   └─ SwapRequests Collection
\`\`\`

### Frontend Architecture
\`\`\`
PORT 3000
│
├─ React 18 App
│  ├─ React Router (page navigation)
│  ├─ Axios (API requests)
│  ├─ Socket.IO Client (real-time updates)
│  └─ Pages:
│     ├─ Login/SignUp (authentication)
│     ├─ Dashboard (manage events)
│     ├─ Marketplace (browse slots)
│     └─ Requests (swap requests)
│
└─ Build Tool: Vite (fast development)
\`\`\`

---

## Part 2: Installation Steps

### Prerequisites
- **Node.js 16+** (download from https://nodejs.org/)
- **MongoDB** (install locally OR use MongoDB Atlas cloud)
- **npm or yarn** (comes with Node.js)
- **Git** (optional, for cloning)

---

### Step 1: MongoDB Setup

Choose ONE option:

#### Option A: Local MongoDB Installation

**macOS (using Homebrew):**
\`\`\`bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
\`\`\`

**Windows:**
- Download from https://www.mongodb.com/try/download/community
- Run the installer and follow the wizard
- MongoDB starts automatically as a service

**Linux (Ubuntu):**
\`\`\`bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongod
\`\`\`

**Verify MongoDB is running:**
\`\`\`bash
mongosh
# If connected, you'll see a MongoDB prompt
# Type: exit
\`\`\`

#### Option B: MongoDB Atlas (Cloud - Easiest)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Get your connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/slotswapper`)
5. You'll use this in backend/.env as MONGODB_URI

#### Option C: Docker MongoDB (if you have Docker)

\`\`\`bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:6
\`\`\`

Then use: `mongodb://admin:password@localhost:27017/slotswapper?authSource=admin` in backend/.env

---

### Step 2: Backend Setup

1. **Open terminal and navigate to backend**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`
   
   This installs:
   - express (web server framework)
   - mongoose (MongoDB connection driver)
   - bcryptjs (password hashing)
   - jsonwebtoken (JWT auth)
   - socket.io (real-time updates)
   - cors (cross-origin requests)
   - dotenv (environment variables)

3. **Create .env file from template**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. **Edit backend/.env with your settings**
   
   Using your favorite text editor (VS Code, Sublime, etc.):
   
   \`\`\`
   # Database connection
   MONGODB_URI=mongodb://localhost:27017/slotswapper
   
   # JWT secret (use any long random string)
   JWT_SECRET=your_super_secret_key_min_32_chars_long_12345abcdef
   
   # Server settings
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   \`\`\`

5. **Start backend server**
   \`\`\`bash
   npm run dev
   \`\`\`

   You should see:
   \`\`\`
   MongoDB connected
   Server running on port 5000
   \`\`\`

**Note:** Keep this terminal open. The backend will continue running with auto-reload on file changes.

---

### Step 3: Frontend Setup

1. **Open a NEW terminal (keep backend running)**
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

   This installs:
   - react (UI framework)
   - react-router-dom (page navigation)
   - axios (HTTP requests)
   - socket.io-client (real-time client)
   - framer-motion (animations)
   - tailwindcss (CSS framework)

3. **Create .env file from template**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. **Edit frontend/.env (optional)**
   
   The default values work if backend is on localhost:5000:
   \`\`\`
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   \`\`\`

5. **Start frontend development server**
   \`\`\`bash
   npm run dev
   \`\`\`

   You should see:
   \`\`\`
   VITE v4.x.x ready in XXX ms
   ➜ Local: http://localhost:3000/
   \`\`\`

---

### Step 4: Open the Application

Open your web browser and go to:
\`\`\`
http://localhost:3000
\`\`\`

You should see the SlotSwapper login page!

---

## Part 3: First Time Usage

### Create Test Accounts

1. **Sign Up - User 1**
   - Name: Alice
   - Email: alice@test.com
   - Password: password123

2. **Sign Up - User 2**
   - Name: Bob
   - Email: bob@test.com
   - Password: password123

### Test the Swap Flow

**User 1 (Alice):**
1. Go to Dashboard
2. Click "Create Event"
3. Title: "Team Meeting"
4. Start: Tomorrow at 10:00 AM
5. End: Tomorrow at 11:00 AM
6. Click "Create"
7. Find the event and click the status button to change from "BUSY" to "SWAPPABLE"

**User 2 (Bob):**
1. Log out (click logout in navbar)
2. Log in as bob@test.com
3. Go to Dashboard
4. Create an event: "Dentist Appointment" (mark as SWAPPABLE)
5. Go to Marketplace tab
6. See Alice's "Team Meeting"
7. Click on it to open swap modal
8. Select your "Dentist Appointment"
9. Click "Request Swap"

**User 1 (Alice):**
1. Go to Requests tab
2. See Bob's swap request
3. Click "Accept" to complete the swap
4. Both events now show opposite ownership!

---

## Part 4: What Each File Does

### Backend - server.js Breakdown

\`\`\`javascript
// 1. SETUP
dotenv.config()                    // Load .env variables
const app = express()              // Create Express app
const server = http.createServer(app)  // Create HTTP server
const io = new Server(server, {})  // Attach Socket.IO to server

// 2. MIDDLEWARE
app.use(cors())                    // Allow cross-origin requests
app.use(express.json())            // Parse JSON request bodies

// 3. DATABASE
mongoose.connect(MONGODB_URI)      // Connect to MongoDB

// 4. MODELS (Database Schemas)
User Schema        // {name, email, password, createdAt}
Event Schema       // {title, startTime, endTime, status, owner, createdAt}
SwapRequest Schema // {requester, responder, slots, status, createdAt}

// 5. ROUTES
POST /api/auth/signup              // Create account
POST /api/auth/login               // Login user
GET  /api/events/my                // Get user's events
POST /api/events                   // Create event
PUT  /api/events/:id               // Update event
DELETE /api/events/:id             // Delete event
GET  /api/swappable-slots          // Get marketplace slots
POST /api/swap-request             // Request swap
POST /api/swap-response/:id        // Accept/reject swap
GET  /api/my-swap-requests         // Get swap requests

// 6. SOCKET.IO
io.on("connection", ...)           // Real-time event broadcasts
\`\`\`

### Frontend - App.jsx Flow

\`\`\`javascript
App.jsx
│
├─ Router (React Router)
│  │
│  ├─ /login          → Login Page
│  ├─ /signup         → SignUp Page
│  ├─ /dashboard      → Dashboard (protected)
│  ├─ /marketplace    → Marketplace (protected)
│  └─ /requests       → Swap Requests (protected)
│
├─ Navbar Component
│  ├─ Navigation links
│  ├─ User info
│  └─ Logout button
│
└─ Socket.IO Connection
   ├─ Real-time event updates
   ├─ Swap notifications
   └─ Auto-refresh on changes
\`\`\`

---

## Part 5: Stopping and Restarting

### To Stop Everything

**Terminal 1 (Backend):** Press `Ctrl+C`
**Terminal 2 (Frontend):** Press `Ctrl+C`

### To Restart

\`\`\`bash
# Terminal 1
cd backend && npm run dev

# Terminal 2 (new terminal)
cd frontend && npm run dev
\`\`\`

---

## Part 6: Debugging Common Issues

### Issue: "Cannot GET /api/..."
**Problem:** Backend not running
**Solution:**
\`\`\`bash
cd backend && npm run dev
# Verify you see "Server running on port 5000"
\`\`\`

### Issue: "Failed to connect to MongoDB"
**Problem:** MongoDB not running
**Solution:**
\`\`\`bash
# Check MongoDB status
mongosh

# If no connection:
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: Start MongoDB from Services

# If using Atlas, verify connection string in .env
\`\`\`

### Issue: "Port 5000 already in use"
**Problem:** Another app using the port
**Solution:**
\`\`\`bash
# Kill the process
lsof -ti:5000 | xargs kill -9

# Or change PORT in backend/.env to 5001
\`\`\`

### Issue: "Port 3000 already in use"
**Solution:**
\`\`\`bash
lsof -ti:3000 | xargs kill -9
\`\`\`

### Issue: Frontend can't connect to backend
**Problem:** Wrong API URL
**Solution:**
\`\`\`bash
cd frontend
# Edit .env and verify:
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Restart frontend: npm run dev
\`\`\`

### Issue: CORS error in browser console
**Problem:** Backend CORS settings
**Solution:**
\`\`\`bash
cd backend
# Edit .env and verify:
FRONTEND_URL=http://localhost:3000

# Restart backend: npm run dev
\`\`\`

---

## Part 7: Environment Variables Reference

### Backend (.env)

\`\`\`
MONGODB_URI
├─ What: Database connection string
├─ Local: mongodb://localhost:27017/slotswapper
├─ Atlas: mongodb+srv://user:pass@cluster.mongodb.net/slotswapper
└─ Docker: mongodb://admin:password@localhost:27017/slotswapper?authSource=admin

JWT_SECRET
├─ What: Secret key for signing JWT tokens
├─ Important: Use a long, random string (min 32 characters)
└─ Example: your_super_secret_key_12345_abcdefgh

PORT
├─ What: Backend server port
└─ Default: 5000

FRONTEND_URL
├─ What: Frontend URL (used for CORS)
└─ Local: http://localhost:3000

NODE_ENV
├─ What: Environment mode
├─ development: More logs, no optimization
└─ production: Optimized, fewer logs
\`\`\`

### Frontend (.env)

\`\`\`
VITE_API_URL
├─ What: Backend API base URL
└─ Default: http://localhost:5000/api

VITE_SOCKET_URL
├─ What: Socket.IO server URL
└─ Default: http://localhost:5000
\`\`\`

---

## Part 8: NPM Scripts Reference

### Backend
\`\`\`bash
npm run dev      # Start with hot reload (for development)
npm start        # Start normally (for production)
\`\`\`

### Frontend
\`\`\`bash
npm run dev      # Start Vite dev server with hot reload
npm run build    # Build for production (creates dist/ folder)
npm run preview  # Preview production build locally
\`\`\`

---

## Part 9: Viewing Real-time Updates

The application uses Socket.IO for real-time notifications. This means:

- When User 1 creates an event, it appears instantly for User 2 in marketplace
- When a swap is completed, both users see updated ownership immediately
- No need to refresh the page

To see this in action:
1. Open frontend on two different browser windows
2. Login as different users
3. Create/modify events
4. Watch real-time updates across both windows!

---

## Part 10: Building for Production

When you're ready to deploy:

\`\`\`bash
# Build frontend
cd frontend
npm run build
# Creates optimized files in dist/ folder

# Backend is already production-ready
# Just set NODE_ENV=production in .env
\`\`\`

---

## Summary

### Quick Checklist
- [ ] Install Node.js
- [ ] Install MongoDB locally or set up MongoDB Atlas
- [ ] Clone/download repository
- [ ] Backend: `cd backend && npm install && cp .env.example .env && npm run dev`
- [ ] Frontend: `cd frontend && npm install && cp .env.example .env && npm run dev`
- [ ] Open http://localhost:3000
- [ ] Sign up and test swapping!

### Key Ports
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- MongoDB: mongodb://localhost:27017

### Critical Files to Edit
- `backend/.env` - Database and JWT settings
- `frontend/.env` - API URLs (usually default is fine)

Need help? Check the error descriptions in Part 6!
