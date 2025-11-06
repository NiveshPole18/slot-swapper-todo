# SlotSwapper Testing Guide

## Manual Testing

### Test Case 1: User Registration & Login
**Steps**:
1. Click "Sign Up" button
2. Fill form with name, email, password
3. Submit
4. Should redirect to dashboard

**Expected**: New account created, logged in automatically

**Test Case 1b: Login with existing account**
1. Click "Logout"
2. Click "Login"
3. Enter email and password
4. Submit

**Expected**: Redirected to dashboard

### Test Case 2: Event Creation
**Steps**:
1. Go to Dashboard
2. Click "+ New Event"
3. Fill form:
   - Title: "Team Meeting"
   - Start: 2024-01-20 10:00 AM
   - End: 2024-01-20 11:00 AM
4. Click "Create Event"

**Expected**: Event appears in list with BUSY status

### Test Case 3: Make Event Swappable
**Steps**:
1. Find event on Dashboard
2. Click "Make Swappable" button
3. Event status changes to green

**Expected**: Event status shows SWAPPABLE

### Test Case 4: View Marketplace
**Steps**:
1. Go to Marketplace
2. Should see other users' SWAPPABLE slots

**Expected**: List of available slots from other users

### Test Case 5: Request Swap (Happy Path)
**Setup**: Need 2 user accounts, each with SWAPPABLE events

**Steps** (as User A):
1. Go to Marketplace
2. Find User B's slot
3. Click "Request Swap"
4. Modal appears showing my SWAPPABLE slots
5. Select User A's slot
6. Click "Request"

**Expected**: Swap request created, status shows PENDING

### Test Case 6: Accept Swap
**Setup**: Swap request exists in pending state

**Steps** (as User B):
1. Go to Requests page
2. Find incoming request from User A
3. Click "Accept"

**Expected**:
- Request status changes to ACCEPTED (green)
- Both slots now show owner changed
- Both slots marked as BUSY

### Test Case 7: Reject Swap
**Setup**: Pending swap request exists

**Steps** (as User B):
1. Go to Requests page
2. Find incoming request
3. Click "Reject"

**Expected**:
- Request status changes to REJECTED (red)
- Both slots revert to SWAPPABLE

### Test Case 8: Real-time Updates
**Setup**: Two browser windows, each logged in as different user

**Steps**:
1. Window 1: Create new event
2. Window 2: Watch marketplace update automatically
3. Window 1: Change event to SWAPPABLE
4. Window 2: Should see change appear

**Expected**: Changes appear without page refresh

### Test Case 9: Delete Event
**Steps**:
1. Click event on Dashboard
2. Click "Delete" button
3. Confirm deletion

**Expected**: Event removed from list

### Test Case 10: Session Persistence
**Steps**:
1. Log in
2. Refresh page (F5)
3. Should still be logged in

**Expected**: Token persists in localStorage, user remains logged in

## API Testing

### Test User Creation
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'
\`\`\`

### Test Unauthorized Request
\`\`\`bash
curl -X GET http://localhost:5000/api/events/my
\`\`\`

**Expected**: 401 error "No token"

### Test with Invalid Token
\`\`\`bash
curl -X GET http://localhost:5000/api/events/my \
  -H "Authorization: Bearer invalid_token"
\`\`\`

**Expected**: 401 error "Invalid token"

## Edge Cases to Test

1. **Empty Marketplace**: Create events but don't mark as SWAPPABLE
   - Result: Should show "No slots available"

2. **No Swappable Slots**: Try to request swap when you have no SWAPPABLE slots
   - Result: Modal shows empty message

3. **Same User**: Prevent user from requesting swap with themselves
   - Result: Their own slots shouldn't appear in marketplace

4. **Concurrent Swaps**: Try to swap same slot twice simultaneously
   - Result: Second request should fail (slot marked SWAP_PENDING)

5. **Time Validation**: Create event with end time before start time
   - Result: Should show validation error

## Performance Testing

### Load Testing
1. Create 100+ events
2. Test marketplace load time
3. Test dashboard rendering speed

### Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Check:
   - API response times
   - Payload sizes
   - Cache usage

## Debugging Tips

### Browser Console
- Check for JavaScript errors
- Monitor network requests
- View Socket.IO connection status

### Backend Logs
- Watch for MongoDB connection issues
- Monitor API response times
- Check authorization failures

### Network Tab
- Verify correct API URLs
- Check request/response headers
- Monitor for failed requests

## Test Results Template

\`\`\`markdown
## Test Run Date: YYYY-MM-DD

### Passed Tests
- [ ] User Registration
- [ ] User Login
- [ ] Event Creation
- [ ] Make Swappable
- [ ] View Marketplace
- [ ] Request Swap
- [ ] Accept Swap
- [ ] Reject Swap
- [ ] Real-time Updates
- [ ] Session Persistence

### Failed Tests
None

### Issues Found
None

### Performance Notes
- Dashboard load: <500ms
- Marketplace load: <1s
- Swap request: <200ms
\`\`\`
