# SlotSwapper - Quick Start Guide

## 5 Minute Setup

### Prerequisites
- Node.js 16+ installed
- MongoDB installed or Atlas account

### Start Backend (Terminal 1)
\`\`\`bash
cd backend
cp .env.example .env
npm install
npm run dev
\`\`\`

Output: `Server running on port 5000`

### Start Frontend (Terminal 2)
\`\`\`bash
cd frontend
cp .env.example .env
npm install
npm run dev
\`\`\`

Output: `VITE ready in XXX ms ➜ Local: http://localhost:3000/`

### Open Browser
\`\`\`
http://localhost:3000
\`\`\`

---

## Commands Reference

### Backend
\`\`\`bash
cd backend
npm install                    # Install once
npm run dev                    # Start with auto-reload
npm start                      # Start production version
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install                    # Install once
npm run dev                    # Start with hot reload
npm run build                  # Build for production
\`\`\`

### MongoDB
\`\`\`bash
# Start local MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
# Windows: Start from Services

# Connect to MongoDB
mongosh
\`\`\`

---

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend API | 5000 | http://localhost:5000/api |
| MongoDB | 27017 | mongodb://localhost:27017 |
| Socket.IO | 5000 | http://localhost:5000 |

---

## Configuration Files

### Backend (.env)
\`\`\`
MONGODB_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=your_secret_key_here_min_32_chars
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### Frontend (.env)
\`\`\`
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
\`\`\`

---

## Test Flow

1. **Sign up** two users (alice@test.com, bob@test.com)
2. **User 1**: Create event → Mark SWAPPABLE
3. **User 2**: Browse marketplace → Request swap
4. **User 1**: Go to Requests → Accept swap
5. **Both**: Verify slot ownership changed

---

## API Endpoints

\`\`\`
POST   /api/auth/signup                # Sign up
POST   /api/auth/login                 # Login
GET    /api/events/my                  # Your events
POST   /api/events                     # Create event
PUT    /api/events/:id                 # Update event
DELETE /api/events/:id                 # Delete event
GET    /api/swappable-slots            # Marketplace
POST   /api/swap-request               # Request swap
POST   /api/swap-response/:id          # Accept/reject
GET    /api/my-swap-requests           # View requests
\`\`\`

---

## Troubleshooting

\`\`\`bash
# Port already in use?
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# MongoDB not connecting?
mongosh

# Clear and reinstall?
rm -rf node_modules && npm install

# Check backend is running?
curl http://localhost:5000/api

# Check frontend is running?
curl http://localhost:3000
\`\`\`

---

## Key Concepts

- **BUSY**: Event not available for swap
- **SWAPPABLE**: Event available for swap
- **SWAP_PENDING**: Event in active swap request
- **JWT Token**: Authentication credentials (stored in browser)
- **Socket.IO**: Real-time updates without page refresh
- **MongoDB**: Database for users, events, swap requests

---

For detailed setup, see INSTALLATION_GUIDE.md
