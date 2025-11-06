# Deployment URLs - Quick Reference

## ✅ Backend (Deployed)
**URL:** `https://slot-swapper-todo.onrender.com`  
**API Base:** `https://slot-swapper-todo.onrender.com/api`  
**Socket.IO:** `https://slot-swapper-todo.onrender.com`

---

## 📝 Current Configuration

### Backend Environment Variables (Render)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
FRONTEND_URL=http://localhost:3000  ← Update after frontend deploy
NODE_ENV=production
```

### Frontend Environment Variables (To be set in Vercel/Netlify)
```
VITE_API_URL=https://slot-swapper-todo.onrender.com/api
VITE_SOCKET_URL=https://slot-swapper-todo.onrender.com
```

---

## 🚀 Next Steps

1. **Deploy Frontend** (Vercel or Netlify)
   - Root Directory: `frontend`
   - Add environment variables above
   - Get frontend URL (e.g., `https://slot-swapper-todo.vercel.app`)

2. **Update Backend CORS**
   - Go to Render → Your service → Environment
   - Update `FRONTEND_URL` to your frontend URL
   - Save (auto-redeploys)

3. **Test Everything**
   - Open frontend URL
   - Sign up → Create event → Test swap requests

---

## 🔗 Quick Links

- **Backend Dashboard:** https://dashboard.render.com
- **Backend Logs:** Render dashboard → Your service → Logs
- **Test API:** https://slot-swapper-todo.onrender.com/api

