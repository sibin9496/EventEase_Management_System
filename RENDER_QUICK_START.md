# 🚀 Deploy EventEase to Render - Quick Start Guide

## Step 1: Create Accounts
1. **Render**: https://render.com (Sign up with GitHub)
2. **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas

## Step 2: Setup MongoDB

1. Go to MongoDB Atlas → Create Cluster (Free M0 tier)
2. Click "Connect" → "Connect your application"
3. Copy connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
4. Keep this safe - you'll need it

## Step 3: Deploy Backend to Render

1. Go to https://dashboard.render.com
2. Click **"New +" → "Web Service"**
3. Connect GitHub repository: `sibin9496/EventEase_Management_System`
4. Configure:
   - **Name**: `eventease-backend`
   - **Environment**: Node
   - **Build Command**: `cd eventease/backend && npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
5. Click **"Environment"** → Add variables:
   ```
   MONGODB_URI = (paste your MongoDB connection string)
   JWT_SECRET = (create a strong random key)
   NODE_ENV = production
   PORT = 10000
   ```
6. Click **"Deploy Web Service"**
7. **WAIT** for deployment (3-5 minutes)
8. **Copy the backend URL** when ready (e.g., https://eventease-backend.onrender.com)

## Step 4: Deploy Frontend to Render

1. Go to https://dashboard.render.com
2. Click **"New +" → "Static Site"**
3. Connect same GitHub repository
4. Configure:
   - **Name**: `eventease-frontend`
   - **Build Command**: `cd eventease/frontend/eventease && npm install && npm run build`
   - **Publish Directory**: `eventease/frontend/eventease/dist`
5. Click **"Environment"** → Add variable:
   ```
   VITE_API_URL = (paste your backend URL from Step 3)/api
   ```
   Example: `https://eventease-backend.onrender.com/api`
6. Click **"Deploy Static Site"**
7. **WAIT** for deployment (2-3 minutes)
8. **Copy the frontend URL** when ready

## Step 5: Test Your Deployment

### Backend Health Check
```
https://eventease-backend.onrender.com/api/health
```

### Frontend
```
https://eventease-frontend.onrender.com
```

### Test API
```
https://eventease-backend.onrender.com/api/events?limit=10
```

## Step 6: Optional - Seed Database

To add sample events to your production database:

1. Locally run:
```bash
cd eventease/backend
MONGODB_URI="your_atlas_connection_string" node scripts/addComprehensiveEvents.js
```

2. Or use MongoDB Atlas UI to insert sample data

## ✅ You're Live!

- **Frontend**: https://eventease-frontend.onrender.com
- **Backend**: https://eventease-backend.onrender.com/api/events

## 📝 Important Notes

### Free Tier Limitations:
- Backend spins down after 15 minutes of inactivity (wakes in 30 seconds)
- Static site always active
- 0.5 vCPU, 1GB RAM
- Perfect for demo/testing

### If Frontend Shows "API Error":
1. Check VITE_API_URL is correct in environment
2. Make sure backend is running (might be spinning up)
3. Check browser console (F12) for exact error
4. Verify CORS is enabled on backend

### To Update Code:
1. Make changes locally
2. `git commit -am "Your message"`
3. `git push origin main`
4. Render auto-deploys in 2-5 minutes

## 🎉 Deployment Complete!

Your EventEase app is now live on the internet!

For detailed troubleshooting, see: `DEPLOYMENT_GUIDE.md`
