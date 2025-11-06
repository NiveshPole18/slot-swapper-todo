# SlotSwapper Local Setup Guide

## Quick Setup

### Backend (Terminal 1)
\`\`\`bash
cd backend
cp .env.example .env
npm install
npm run dev
\`\`\`

### Frontend (Terminal 2)
\`\`\`bash
cd frontend
cp .env.example .env
npm install
npm run dev
\`\`\`

### Open http://localhost:3000

---

## Prerequisites

1. **Node.js 16+** - https://nodejs.org/
2. **MongoDB** - One of:
   - Local installation
   - MongoDB Atlas (free cloud)
   - Docker: `docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:6`

---

## MongoDB Setup

### Option 1: Local MongoDB

**macOS:**
\`\`\`bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
mongosh  # Verify connection
\`\`\`

**Windows:**
- Download: https://www.mongodb.com/try/download/community
- Run installer
- Start from Services

**Linux:**
\`\`\`bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
mongosh  # Verify connection
\`\`\`

### Option 2: MongoDB Atlas (Recommended for Beginners)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster
4. Get connection string
5. Use in backend/.env as `MONGODB_URI`

---

## Backend Setup

\`\`\`bash
# Navigate to backend
cd backend

# Copy template
cp .env.example .env

# Install dependencies
npm install

# Edit .env with your MongoDB URL
# For local: mongodb://localhost:27017/slotswapper
# For Atlas: mongodb+srv://user:pass@cluster.mongodb.net/slotswapper

# Start server
npm run dev
\`\`\`

Expected output:
\`\`\`
MongoDB connected
Server running on port 5000
\`\`\`

---

## Frontend Setup

\`\`\`bash
# Navigate to frontend (new terminal)
cd frontend

# Copy template
cp .env.example .env

# Install dependencies
npm install

# (Optional) Edit .env if backend is on different URL
# VITE_API_URL=http://localhost:5000/api

# Start server
npm run dev
\`\`\`

Expected output:
\`\`\`
VITE v4.x ready in XXX ms
➜ Local: http://localhost:3000/
\`\`\`

---

## Testing the Application

1. **Sign up** - Create test account
2. **Dashboard** - Create event with SWAPPABLE status
3. **Marketplace** - (Other user) Browse available slots
4. **Requests** - Make swap request
5. **Accept** - Accept incoming request

Slots instantly swap ownership!

---

## Error Solutions

| Error | Solution |
|-------|----------|
| "Port 5000 in use" | `lsof -ti:5000 \| xargs kill -9` |
| "MongoDB connection failed" | Verify MongoDB running: `mongosh` |
| "Cannot connect to backend" | Check `VITE_API_URL` in frontend/.env |
| "CORS error" | Verify `FRONTEND_URL` in backend/.env |

---

## Environment Variables

### backend/.env
\`\`\`
MONGODB_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=any_long_random_string_here_32_chars_min
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### frontend/.env
\`\`\`
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
\`\`\`

---

For detailed guide, see INSTALLATION_GUIDE.md
