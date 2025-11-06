# SlotSwapper API Reference

## Base URL
- Development: http://localhost:5000/api
- Production: https://api.slotswapper.com (example)

## Authentication

All protected endpoints require:
\`\`\`
Authorization: Bearer <jwt_token>
\`\`\`

## Endpoints

### Authentication

#### Sign Up
Create a new user account.

**Request**:
\`\`\`
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

**Errors**:
- 400: Missing fields (name, email, password)
- 400: Email already exists

---

#### Login
Authenticate user and get JWT token.

**Request**:
\`\`\`
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

**Errors**:
- 400: Missing fields
- 401: Invalid credentials

---

### Events

#### Get My Events
Retrieve all events owned by the authenticated user.

**Request**:
\`\`\`
GET /events/my
Authorization: Bearer <token>
\`\`\`

**Response** (200):
\`\`\`json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Team Meeting",
    "startTime": "2024-01-20T10:00:00Z",
    "endTime": "2024-01-20T11:00:00Z",
    "status": "BUSY",
    "owner": "507f1f77bcf86cd799439010",
    "createdAt": "2024-01-19T15:30:00Z"
  }
]
\`\`\`

**Errors**:
- 401: No token provided

---

#### Create Event
Create a new event/slot.

**Request**:
\`\`\`
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Team Meeting",
  "startTime": "2024-01-20T10:00:00Z",
  "endTime": "2024-01-20T11:00:00Z"
}
\`\`\`

**Response** (201):
\`\`\`json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Team Meeting",
  "startTime": "2024-01-20T10:00:00Z",
  "endTime": "2024-01-20T11:00:00Z",
  "status": "BUSY",
  "owner": "507f1f77bcf86cd799439010",
  "createdAt": "2024-01-19T15:30:00Z"
}
\`\`\`

**Errors**:
- 400: Missing required fields
- 401: No token provided

---

#### Update Event
Update an existing event.

**Request**:
\`\`\`
PUT /events/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "SWAPPABLE"
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Team Meeting",
  "startTime": "2024-01-20T10:00:00Z",
  "endTime": "2024-01-20T11:00:00Z",
  "status": "SWAPPABLE",
  "owner": "507f1f77bcf86cd799439010",
  "createdAt": "2024-01-19T15:30:00Z"
}
\`\`\`

**Errors**:
- 404: Event not found
- 401: No token provided

---

#### Delete Event
Remove an event.

**Request**:
\`\`\`
DELETE /events/:id
Authorization: Bearer <token>
\`\`\`

**Response** (200):
\`\`\`json
{
  "ok": true
}
\`\`\`

**Errors**:
- 404: Event not found
- 401: No token provided

---

### Swappable Slots

#### Get Swappable Slots
Get all SWAPPABLE slots from other users (marketplace).

**Request**:
\`\`\`
GET /swappable-slots
Authorization: Bearer <token>
\`\`\`

**Response** (200):
\`\`\`json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Focus Block",
    "startTime": "2024-01-21T14:00:00Z",
    "endTime": "2024-01-21T15:00:00Z",
    "status": "SWAPPABLE",
    "owner": {
      "_id": "507f1f77bcf86cd799439001",
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "createdAt": "2024-01-19T14:00:00Z"
  }
]
\`\`\`

**Query Parameters**:
None

**Errors**:
- 401: No token provided

---

### Swap Requests

#### Create Swap Request
Request to swap one of your slots with another user's slot.

**Request**:
\`\`\`
POST /swap-request
Authorization: Bearer <token>
Content-Type: application/json

{
  "mySlotId": "507f1f77bcf86cd799439011",
  "theirSlotId": "507f1f77bcf86cd799439012"
}
\`\`\`

**Response** (201):
\`\`\`json
{
  "_id": "507f1f77bcf86cd799439013",
  "requester": "507f1f77bcf86cd799439010",
  "responder": "507f1f77bcf86cd799439001",
  "requesterSlot": "507f1f77bcf86cd799439011",
  "responderSlot": "507f1f77bcf86cd799439012",
  "status": "PENDING",
  "createdAt": "2024-01-19T16:00:00Z"
}
\`\`\`

**Errors**:
- 400: Slots not found or not SWAPPABLE
- 401: No token provided

**Side Effects**:
- Both slots marked as SWAP_PENDING
- Socket.IO event "swap-request" broadcasted

---

#### Respond to Swap Request
Accept or reject a swap request.

**Request**:
\`\`\`
POST /swap-response/:requestId
Authorization: Bearer <token>
Content-Type: application/json

{
  "accept": true
}
\`\`\`

**Response** (200) - Accepted:
\`\`\`json
{
  "_id": "507f1f77bcf86cd799439013",
  "requester": "507f1f77bcf86cd799439010",
  "responder": "507f1f77bcf86cd799439001",
  "requesterSlot": "507f1f77bcf86cd799439011",
  "responderSlot": "507f1f77bcf86cd799439012",
  "status": "ACCEPTED",
  "createdAt": "2024-01-19T16:00:00Z"
}
\`\`\`

**Response** (200) - Rejected:
\`\`\`json
{
  "_id": "507f1f77bcf86cd799439013",
  "requester": "507f1f77bcf86cd799439010",
  "responder": "507f1f77bcf86cd799439001",
  "requesterSlot": "507f1f77bcf86cd799439011",
  "responderSlot": "507f1f77bcf86cd799439012",
  "status": "REJECTED",
  "createdAt": "2024-01-19T16:00:00Z"
}
\`\`\`

**Errors**:
- 404: Request not found
- 401: No token provided

**Side Effects** (on accept):
- Slot ownership exchanged
- Both slots marked as BUSY
- Socket.IO event "swap-response" broadcasted

**Side Effects** (on reject):
- Both slots marked as SWAPPABLE
- Socket.IO event "swap-response" broadcasted

---

#### Get Swap Requests
Get all swap requests (incoming and outgoing).

**Request**:
\`\`\`
GET /my-swap-requests
Authorization: Bearer <token>
\`\`\`

**Response** (200):
\`\`\`json
{
  "incoming": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "requester": {
        "_id": "507f1f77bcf86cd799439010",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "requesterSlot": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Team Meeting",
        "startTime": "2024-01-20T10:00:00Z",
        "endTime": "2024-01-20T11:00:00Z"
      },
      "responderSlot": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Focus Block",
        "startTime": "2024-01-21T14:00:00Z",
        "endTime": "2024-01-21T15:00:00Z"
      },
      "status": "PENDING",
      "createdAt": "2024-01-19T16:00:00Z"
    }
  ],
  "outgoing": []
}
\`\`\`

**Errors**:
- 401: No token provided

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

## Socket.IO Events

### Client to Server
(None currently - all actions via REST API)

### Server to Client

#### event-created
Broadcast when any user creates an event.
\`\`\`json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "New Event",
  "status": "BUSY",
  ...
}
\`\`\`

#### event-updated
Broadcast when any event is updated.
\`\`\`json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Updated Event",
  "status": "SWAPPABLE",
  ...
}
\`\`\`

#### event-deleted
Broadcast when any event is deleted.
\`\`\`
"507f1f77bcf86cd799439011"
\`\`\`

#### swap-request
Broadcast when a swap request is created.
\`\`\`json
{
  "swapRequest": { ... },
  "message": "New swap request"
}
\`\`\`

#### swap-response
Broadcast when a swap request is accepted/rejected.
\`\`\`json
{
  "swapRequest": { ... },
  "message": "Swap accepted/rejected"
}
\`\`\`

---

## Rate Limiting

Currently not implemented. Can be added using express-rate-limit middleware.

## Pagination

Currently not implemented. Can be added to marketplace endpoints.

## Filtering & Sorting

Currently not implemented. Can be added as query parameters.

## Changelog

### v1.0.0 (Current)
- Initial release with core features
- User authentication
- Event management
- Swap request system
- Real-time notifications via Socket.IO
