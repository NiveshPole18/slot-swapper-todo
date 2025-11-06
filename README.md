# SlotSwapper - Peer-to-Peer Time-Slot Scheduling App

A full-stack MERN application that enables users to swap time slots with each other in a peer-to-peer marketplace.

## Features

- **User Authentication**: Sign up and login with JWT-based auth
- **Event Management**: Create, edit, and delete your calendar events
- **Swappable Slots**: Mark events as swappable to make them available to others
- **Marketplace**: Browse and request swaps for available slots from other users
- **Swap Requests**: Accept or reject incoming swap requests
- **Real-time Notifications**: Socket.IO integration for live updates
- **Responsive Design**: Modern UI with Framer Motion animations

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- Socket.IO for real-time updates

**Frontend:**
- React 18
- TailwindCSS
- Framer Motion for animations
- Axios for API calls
- React Router for navigation

## Quick Start (Local Development)

### Prerequisites
- Node.js 16+ installed
- MongoDB installed or MongoDB Atlas account
- npm or yarn

### Backend Setup (Terminal 1)

\`\`\`bash
cd backend
cp .env.example .env
npm install
npm run dev
\`\`\`

The backend will start on `http://localhost:5000`

### Frontend Setup (Terminal 2)

\`\`\`bash
cd frontend
cp .env.example .env
npm install
npm run dev
\`\`\`

The frontend will start on `http://localhost:3000`

## Configuration

### Backend (.env)
\`\`\`
MONGODB_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=your_super_secret_key_min_32_chars_long
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### Frontend (.env)
\`\`\`
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events/my` - Get all user's events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/swappable-slots` - Get all swappable slots from other users

### Swap Requests
- `POST /api/swap-request` - Create swap request
- `POST /api/swap-response/:requestId` - Accept/reject swap request
- `GET /api/my-swap-requests` - Get incoming and outgoing swap requests

## Usage

1. **Sign Up**: Create an account with name, email, and password
2. **Create Events**: Add events to your calendar with title and time
3. **Make Swappable**: Mark events as SWAPPABLE to offer them for swap
4. **Browse Marketplace**: View other users' swappable slots
5. **Request Swap**: Select your available slot to request a swap
6. **Manage Requests**: Accept or reject incoming swap requests

## Design Decisions

- **Transactional Swaps**: Uses MongoDB transactions for atomic slot exchanges
- **Real-time Updates**: Socket.IO provides instant notifications
- **Optimistic UI**: Frontend updates immediately for better UX
- **Status Management**: Prevents conflicts with SWAP_PENDING status

## Error Handling

- Server-side validation for all inputs
- JWT token verification for protected routes
- Comprehensive error messages for client feedback
- MongoDB session handling for transaction safety

## Running Tests

Backend tests can be added using Jest or Mocha. Current setup provides the foundation for comprehensive testing of swap logic.

## Project Structure

\`\`\`
slotswapper/
├── backend/                 # Node.js + Express API
│   ├── server.js           # Main server & routes
│   ├── package.json        # Dependencies
│   ├── .env.example        # Environment template
│   └── .gitignore          # Git exclusions
│
├── frontend/               # React + Vite Frontend
│   ├── src/
│   │   ├── main.jsx        # Entry point
│   │   ├── App.jsx         # Main component
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   └── index.css       # Styles
│   ├── package.json        # Dependencies
│   ├── .env.example        # Environment template
│   ├── vite.config.js      # Build config
│   ├── tailwind.config.js  # TailwindCSS config
│   └── postcss.config.js   # PostCSS config
│
├── README.md               # This file
└── INSTALLATION_GUIDE.md   # Detailed setup instructions
\`\`\`

## Future Enhancements

- Email notifications for swap requests
- Calendar integrations (Google, Outlook)
- User ratings and trust scores
- Advanced filtering and search
- Time zone support

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongosh`
- Check connection string in `backend/.env`
- Verify username/password if using auth

### Backend Won't Start
- Check port 5000 is available: `lsof -ti:5000 | xargs kill -9`
- Verify all dependencies: `cd backend && npm install`

### Frontend Can't Connect to Backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env` is set to `http://localhost:5000/api`
- Clear browser cache

## Support & Resources

- MongoDB Docs: https://docs.mongodb.com/
- Express Docs: https://expressjs.com/
- React Docs: https://react.dev/
- Socket.IO Docs: https://socket.io/docs/

---

For detailed setup instructions, see INSTALLATION_GUIDE.md
