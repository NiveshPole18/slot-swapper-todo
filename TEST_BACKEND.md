# Test Your Backend API

## Your Backend URL
**Base URL:** `https://slot-swapper-todo.onrender.com`  
**API Base:** `https://slot-swapper-todo.onrender.com/api`

## Test Endpoints

### 1. Test Signup (No auth required)
```bash
curl -X POST https://slot-swapper-todo.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### 2. Test Login
```bash
curl -X POST https://slot-swapper-todo.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

### 3. Test Protected Endpoint (Need token)
```bash
# First get token from signup/login, then:
curl -X GET https://slot-swapper-todo.onrender.com/api/events/my \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Test in Browser
Open: `https://slot-swapper-todo.onrender.com/api`

You might see "Cannot GET /api" - that's normal! It means the server is running.

## Check Logs in Render
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. You should see:
   ```
   MongoDB connected
   Server running on port 5000
   ```

