# Frontend Deployment Guide

## Your Backend URL
**Backend API:** `https://slot-swapper-todo.onrender.com/api`  
**Backend Socket.IO:** `https://slot-swapper-todo.onrender.com`

---

## Deploy Frontend to Vercel (Recommended)

### Step 1: Prepare Frontend Environment Variables

Before deploying, you need these environment variables:

```
VITE_API_URL=https://slot-swapper-todo.onrender.com/api
VITE_SOCKET_URL=https://slot-swapper-todo.onrender.com
```

### Step 2: Deploy to Vercel

1. **Go to:** https://vercel.com
2. **Sign up/Login** (use GitHub)
3. **Click "Add New" → "Project"**
4. **Import your repository:** `slot-swapper-todo`
5. **Configure:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` ← Important!
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

6. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add:
     - **Name:** `VITE_API_URL`
     - **Value:** `https://slot-swapper-todo.onrender.com/api`
   - Add:
     - **Name:** `VITE_SOCKET_URL`
     - **Value:** `https://slot-swapper-todo.onrender.com`

7. **Click "Deploy"**
8. **Wait 2-3 minutes**
9. **Get your frontend URL** (e.g., `https://slot-swapper-todo.vercel.app`)

### Step 3: Update Backend CORS

After frontend is deployed:

1. **Go to Render dashboard**
2. **Your backend service → Environment**
3. **Update `FRONTEND_URL`:**
   - Change from: `http://localhost:3000`
   - Change to: `https://your-frontend-url.vercel.app` (your actual Vercel URL)
4. **Save** (Render will auto-redeploy)

---

## Deploy Frontend to Netlify (Alternative)

### Step 1: Deploy to Netlify

1. **Go to:** https://netlify.com
2. **Sign up/Login** (use GitHub)
3. **Click "Add new site" → "Import an existing project"**
4. **Connect GitHub → Select:** `slot-swapper-todo`
5. **Configure:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

6. **Add Environment Variables:**
   - Site settings → Environment variables
   - Add:
     - **Key:** `VITE_API_URL`
     - **Value:** `https://slot-swapper-todo.onrender.com/api`
   - Add:
     - **Key:** `VITE_SOCKET_URL`
     - **Value:** `https://slot-swapper-todo.onrender.com`

7. **Deploy site**
8. **Get your frontend URL** (e.g., `https://slot-swapper-todo.netlify.app`)

### Step 2: Update Backend CORS

Same as Vercel - update `FRONTEND_URL` in Render to your Netlify URL.

---

## Environment Variables Summary

### Frontend (Vercel/Netlify)
```
VITE_API_URL=https://slot-swapper-todo.onrender.com/api
VITE_SOCKET_URL=https://slot-swapper-todo.onrender.com
```

### Backend (Render) - After Frontend Deploy
```
FRONTEND_URL=https://your-frontend-url.vercel.app
```
(Replace with your actual frontend URL)

---

## Testing After Deployment

1. **Open your frontend URL**
2. **Try to sign up** - should work!
3. **Create an event** - should save to MongoDB
4. **Check real-time updates** - Socket.IO should work

---

## Troubleshooting

### CORS Error
- Make sure `FRONTEND_URL` in Render matches your frontend URL exactly
- Include `https://` in the URL
- No trailing slash

### API Not Working
- Check `VITE_API_URL` in frontend is correct
- Should be: `https://slot-swapper-todo.onrender.com/api`

### Socket.IO Not Connecting
- Check `VITE_SOCKET_URL` in frontend is correct
- Should be: `https://slot-swapper-todo.onrender.com`
- Check backend logs in Render for Socket.IO connection errors

