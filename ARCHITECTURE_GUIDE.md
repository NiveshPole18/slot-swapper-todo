# SlotSwapper Architecture & Flow Diagrams

## System Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET / Browser                       │
│                                                                   │
│  User visits http://localhost:3000                               │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ HTTP/WebSocket
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND (Port 3000)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ React Application (Vite)                                │  │
│  │ ┌─────────────────────────────────────────────────────┐ │  │
│  │ │ Pages:                                              │ │  │
│  │ │ - Login (public)                                    │ │  │
│  │ │ - SignUp (public)                                   │ │  │
│  │ │ - Dashboard (authenticated) - manage events         │ │  │
│  │ │ - Marketplace (authenticated) - browse swaps        │ │  │
│  │ │ - Requests (authenticated) - manage swap requests   │ │  │
│  │ └─────────────────────────────────────────────────────┘ │  │
│  │ ┌─────────────────────────────────────────────────────┐ │  │
│  │ │ Communication:                                      │ │  │
│  │ │ - Axios: HTTP requests for data operations          │ │  │
│  │ │ - Socket.IO: Real-time notifications                │ │  │
│  │ │ - LocalStorage: Store JWT token                     │ │  │
│  │ └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        │ REST API                          │ WebSocket
        │ (JSON over HTTP)                  │ (Socket.IO)
        │                                   │
        ▼                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│              BACKEND SERVER (Port 5000)                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Express.js Server with Socket.IO                           │ │
│  │ ┌──────────────────────────────────────────────────────┐  │ │
│  │ │ Routes:                                              │  │ │
│  │ │                                                      │  │ │
│  │ │ /api/auth/                                           │  │ │
│  │ │   POST /signup     → Create user                     │  │ │
│  │ │   POST /login      → Authenticate & return JWT       │  │ │
│  │ │                                                      │  │ │
│  │ │ /api/events/                                         │  │ │
│  │ │   GET  /my         → Get user's events              │  │ │
│  │ │   POST /           → Create event                    │  │ │
│  │ │   PUT  /:id        → Update event                    │  │ │
│  │ │   DELETE /:id      → Delete event                    │  │ │
│  │ │                                                      │  │ │
│  │ │ /api/ (root)                                         │  │ │
│  │ │   GET  /swappable-slots → List marketplace slots    │  │ │
│  │ │   POST /swap-request    → Create swap request       │  │ │
│  │ │   POST /swap-response   → Accept/reject swap        │  │ │
│  │ │   GET  /my-swap-requests → View all requests        │  │ │
│  │ └──────────────────────────────────────────────────────┘  │ │
│  │ ┌──────────────────────────────────────────────────────┐  │ │
│  │ │ Middleware:                                          │  │ │
│  │ │ - CORS: Allow cross-origin requests                 │  │ │
│  │ │ - JWT Auth: Verify user on protected routes         │  │ │
│  │ │ - JSON Parser: Parse request bodies                 │  │ │
│  │ └──────────────────────────────────────────────────────┘  │ │
│  │ ┌──────────────────────────────────────────────────────┐  │ │
│  │ │ Socket.IO Events:                                   │  │ │
│  │ │ - event-created: Broadcast when event created       │  │ │
│  │ │ - event-updated: Broadcast when event updated       │  │ │
│  │ │ - event-deleted: Broadcast when event deleted       │  │ │
│  │ │ - swap-request: Broadcast new swap request          │  │ │
│  │ │ - swap-response: Broadcast accepted/rejected        │  │ │
│  │ └──────────────────────────────────────────────────────┘  │ │
│  └────────────────┬───────────────────────────────────────────┘ │
└───────────────────┼──────────────────────────────────────────────┘
                    │
                    │ MongoDB Protocol
                    │ (mongoose driver)
                    ▼
┌──────────────────────────────────────────────────────────────────┐
│              DATABASE SERVER (Port 27017)                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ MongoDB                                                    │ │
│  │ Database: slotswapper                                      │ │
│  │                                                            │ │
│  │ Collections:                                               │ │
│  │                                                            │ │
│  │ ┌──────────────────────────────────────────────────────┐ │ │
│  │ │ users                                                │ │ │
│  │ │  _id          ObjectId                              │ │ │
│  │ │  name         String (required)                     │ │ │
│  │ │  email        String (unique, required)             │ │ │
│  │ │  password     String (hashed with bcrypt)           │ │ │
│  │ │  createdAt    Date (default: now)                   │ │ │
│  │ └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │ ┌──────────────────────────────────────────────────────┐ │ │
│  │ │ events                                               │ │ │
│  │ │  _id          ObjectId                              │ │ │
│  │ │  title        String (required)                     │ │ │
│  │ │  startTime    Date (required)                       │ │ │
│  │ │  endTime      Date (required)                       │ │ │
│  │ │  status       Enum: BUSY/SWAPPABLE/SWAP_PENDING     │ │ │
│  │ │  owner        ObjectId (ref: users)                 │ │ │
│  │ │  createdAt    Date (default: now)                   │ │ │
│  │ └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │ ┌──────────────────────────────────────────────────────┐ │ │
│  │ │ swaprequests                                         │ │ │
│  │ │  _id              ObjectId                          │ │ │
│  │ │  requester        ObjectId (ref: users)             │ │ │
│  │ │  responder        ObjectId (ref: users)             │ │ │
│  │ │  requesterSlot    ObjectId (ref: events)            │ │ │
│  │ │  responderSlot    ObjectId (ref: events)            │ │ │
│  │ │  status           Enum: PENDING/ACCEPTED/REJECTED   │ │ │
│  │ │  createdAt        Date (default: now)               │ │ │
│  │ └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

---

## Data Flow: User Signup

\`\`\`
User enters email/password in SignUp form
        ▼
React component captures form data
        ▼
Axios POST to /api/auth/signup
        ▼
Backend receives request
        ▼
Validate: Check email not duplicate
        ▼
Hash password with bcrypt (10 rounds)
        ▼
Create user in MongoDB
        ▼
Sign JWT token with user ID
        ▼
Return token + user info to frontend
        ▼
Store token in localStorage
        ▼
Redirect to Dashboard
\`\`\`

---

## Data Flow: Create & Swap Slots

\`\`\`
USER 1 (Dashboard)                    USER 2 (Marketplace/Requests)
    ▼                                        ▼
Create Event "Team Meeting"            Browse marketplace
    │                                        │
    └─→ POST /api/events                 ◄──┴─ GET /api/swappable-slots
        │                                     │
        └─→ MongoDB: Insert event            └─→ Receive User 1's slot
            │                                      │
            └─→ Socket.IO broadcast              └─→ Display in list
                "event-created"                     │
                    │                               └─→ User 2 clicks to swap
                    └──────────────────────────────→ Opens swap modal
                                                       │
                                                    User 2 selects their
                                                    SWAPPABLE slot
                                                       │
                                                    User 2 clicks "Request"
                                                       │
                                                       └─→ POST /api/swap-request
                                                           │
                                                           └─→ MongoDB:
                                                               1. Find both slots
                                                               2. Mark as SWAP_PENDING
                                                               3. Create SwapRequest
                                                               │
                                                               └─→ Socket.IO
                                                                   broadcast
                                                                   │
                                                                   ▼
                                            User 1 sees incoming
                                            swap request in real-time
                                                   │
                                                   ▼
                                            Goes to Requests page
                                                   │
                                                   ▼
                                            Clicks "Accept"
                                                   │
                                                   └─→ POST /api/swap-response
                                                       │
                                                       └─→ MongoDB Transaction:
                                                           1. Lock both slots
                                                           2. Swap owner IDs
                                                           3. Mark both as BUSY
                                                           4. Update SwapRequest
                                                           status to ACCEPTED
                                                           5. Commit transaction
                                                           │
                                                           └─→ Socket.IO
                                                               broadcast
                                                               "swap-response"
                                                               │
                                                    ┌─────────┴────────┐
                                                    ▼                  ▼
                                            User 1 sees            User 2 sees
                                            swap accepted          swap accepted
                                               │                     │
                                               └─────────────────────┘
                                                   Both refresh UI
\`\`\`

---

## Event Status Lifecycle

\`\`\`
┌──────────────────────────────────────────────────────────────────┐
│                      Event Status Machine                        │
└──────────────────────────────────────────────────────────────────┘

                           ┌─────────────┐
                           │   Created   │
                           │   (BUSY)    │
                           └──────┬──────┘
                                  │
                    User toggles to SWAPPABLE
                                  │
                                  ▼
                           ┌─────────────┐
                           │ SWAPPABLE   │
                           │ (available) │
                           └──────┬──────┘
                                  │
                   User requests swap with this slot
                                  │
                                  ▼
                           ┌─────────────┐
                           │SWAP_PENDING │
                           │ (locked)    │
                           └──────┬──────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                                   │
         Swap Accepted                     Swap Rejected
                │                                   │
                ▼                                   ▼
        ┌──────────────┐                 ┌──────────────┐
        │ BUSY         │                 │ SWAPPABLE    │
        │(new owner)   │                 │(back to list)│
        └──────────────┘                 └──────────────┘
\`\`\`

---

## User Authentication Flow

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                           │
└─────────────────────────────────────────────────────────────────┘

LOGIN PROCESS:
1. User enters email + password
   │
2. Frontend sends POST to /api/auth/login
   │
3. Backend:
   ├─ Find user by email
   ├─ Compare password with bcrypt.compare()
   ├─ If valid: sign JWT token
   └─ If invalid: return 401 error
   │
4. Frontend stores token in localStorage
   │
5. Frontend sets Axios default header:
   Authorization: Bearer <token>
   │
6. Every API request now includes token
   │
7. Backend middleware authMiddleware:
   ├─ Extract token from Authorization header
   ├─ Verify token signature
   ├─ Extract userId from token payload
   ├─ Attach userId to request
   └─ Proceed to route handler
   │
8. If token invalid/expired:
   ├─ Return 401 error
   └─ Frontend redirects to login

TOKEN EXPIRATION:
- Token expires after 7 days
- User must login again
- Refresh token system can be added later
\`\`\`

---

## Real-time Updates with Socket.IO

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│              Socket.IO Real-time Communication                  │
└─────────────────────────────────────────────────────────────────┘

USER 1 (Dashboard)           Backend Server           USER 2 (Dashboard)
     │                             │                         │
     │ npm run dev                 │                         │
     │ (React frontend)            │                         │
     │                   npm run dev                         │
     │                   (Express + Socket.IO)               │
     │                             │      npm run dev        │
     │                             │      (React frontend)   │
     │                             │                         │
     │  WebSocket Connection       │  WebSocket Connection   │
     ├──────────────────────────→  │  ←──────────────────────┤
     │  (socket.io-client)         │  (socket.io-client)     │
     │                    Socket.IO Server                   │
     │                             │                         │
     │  Creates event              │                         │
     ├─ POST /api/events ─────────→ ├─ Broadcasts ─────────→ │
     │  (HTTP)                     │ event-created         │ │
     │                             │ (WebSocket)           │ │
     │                             │                       │ │
     │                             │  React re-renders     │ │
     │                             │  ◄─────────────────── │ │
     │                             │                       │ │
     │                             │  Requests swap        │ │
     │                             │ ←─ POST /api/swap ─── │ │
     │                             │    (HTTP)             │ │
     │                             │                       │ │
     │    Notification via          │  Broadcasts           │ │
     │  ◄─ swap-request event ────→│ swap-request        │ │
     │    (WebSocket)              │ (WebSocket)           │ │
     │                             │                       │ │
     │  Accepts swap               │                       │ │
     ├─ POST /api/swap-response ─→ ├─ Both users update ─→ │ │
     │                             │ Events now swapped     │ │
\`\`\`

---

## Component & Page Structure

\`\`\`
Frontend/src/
│
├── App.jsx (Main Router)
│   │
│   ├── Navbar.jsx
│   │   ├─ Navigation links
│   │   ├─ User info display
│   │   └─ Logout button
│   │
│   └── Routes:
│       │
│       ├─ /login → Login.jsx
│       │   └─ LoginForm component
│       │
│       ├─ /signup → SignUp.jsx
│       │   └─ SignUpForm component
│       │
│       ├─ /dashboard → Dashboard.jsx (Protected)
│       │   ├─ EventForm.jsx (Create event)
│       │   └─ EventCard.jsx (Display & manage events)
│       │       ├─ Show/hide event details
│       │       ├─ Toggle status
│       │       ├─ Edit/Delete buttons
│       │       └─ Status badge
│       │
│       ├─ /marketplace → Marketplace.jsx (Protected)
│       │   └─ SlotCard.jsx (Display swappable slots)
│       │       ├─ Show slot details
│       │       ├─ Swap request modal
│       │       └─ Select your slot to swap
│       │
│       └─ /requests → Requests.jsx (Protected)
│           ├─ Incoming requests section
│           │   └─ SwapRequestCard.jsx (Accept/Reject)
│           │
│           └─ Outgoing requests section
│               └─ SwapRequestCard.jsx (Status)
│
├── components/
│   ├─ EventCard.jsx
│   ├─ SlotCard.jsx
│   ├─ SwapRequestCard.jsx
│   ├─ EventForm.jsx
│   └─ Navbar.jsx
│
├── pages/
│   ├─ Login.jsx
│   ├─ SignUp.jsx
│   ├─ Dashboard.jsx
│   ├─ Marketplace.jsx
│   └─ Requests.jsx
│
├── utils/
│   └─ api.js (Axios instance with auth)
│
├── App.jsx
├── main.jsx
└─ index.css
\`\`\`

---

## Request/Response Examples

### Signup Request
\`\`\`
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

### Create Event Request
\`\`\`
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Team Meeting",
  "startTime": "2024-01-20T10:00:00Z",
  "endTime": "2024-01-20T11:00:00Z"
}

Response (200):
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Team Meeting",
  "startTime": "2024-01-20T10:00:00Z",
  "endTime": "2024-01-20T11:00:00Z",
  "status": "BUSY",
  "owner": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-15T12:30:00Z"
}
\`\`\`

### Swap Request
\`\`\`
POST /api/swap-request
Authorization: Bearer <token>
Content-Type: application/json

{
  "mySlotId": "507f1f77bcf86cd799439012",
  "theirSlotId": "507f1f77bcf86cd799439013"
}

Response (200):
{
  "_id": "507f1f77bcf86cd799439014",
  "requester": "507f1f77bcf86cd799439011",
  "responder": "507f1f77bcf86cd799439010",
  "requesterSlot": "507f1f77bcf86cd799439012",
  "responderSlot": "507f1f77bcf86cd799439013",
  "status": "PENDING",
  "createdAt": "2024-01-15T12:35:00Z"
}

Changes in database:
- Both slots status changed to SWAP_PENDING
- Socket.IO broadcasts "swap-request" to all clients
