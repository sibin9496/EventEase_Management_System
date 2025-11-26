# EventEase - Render.com Deployment Guide

Complete guide to deploy EventEase to Render.com for free hosting.

## Prerequisites
- GitHub account with EventEase repository pushed
- Render.com account (https://render.com)
- MongoDB Atlas account (free tier) for production database

## Part 1: Setup MongoDB Atlas (Cloud Database)

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign in with GitHub" or create account
3. Create a new project
4. Create a cluster (choose Free M0 tier)
5. Wait for cluster to be ready (2-5 minutes)

### 2. Get MongoDB Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select Node.js driver
4. Copy the connection string
5. Replace `<password>` with your database password
6. Format: `mongodb+srv://username:password@cluster.mongodb.net/eventease?retryWrites=true&w=majority`

---

## Part 2: Deploy Backend to Render

### Option A: Using Web Service (Recommended)

1. **Go to Render Dashboard**
   - https://dashboard.render.com

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Select "Deploy an existing repository"
   - Choose "EventEase_Management_System" GitHub repo
   - Select "main" branch

3. **Configure Service**
   - **Name**: `eventease-backend`
   - **Environment**: Node
   - **Region**: Singapore (closest to Asia) or US East
   - **Branch**: main
   - **Build Command**: 
     ```
     cd eventease/backend && npm install
     ```
   - **Start Command**:
     ```
     node server.js
     ```
   - **Plan**: Free

4. **Add Environment Variables**
   - Click "Environment"
   - Add these variables:
     ```
     MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/eventease?retryWrites=true&w=majority
     JWT_SECRET = your_super_secret_jwt_key_change_this
     PORT = 10000
     NODE_ENV = production
     ```

5. **Deploy**
   - Click "Deploy Web Service"
   - Wait for deployment (3-5 minutes)
   - Copy the backend URL (e.g., https://eventease-backend.onrender.com)

---

## Part 3: Deploy Frontend to Render

### Step 1: Create Static Site

1. **Go to Render Dashboard**
   - https://dashboard.render.com

2. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Select "EventEase_Management_System" GitHub repo
   - Select "main" branch

3. **Configure Site**
   - **Name**: `eventease-frontend`
   - **Region**: Singapore or US East
   - **Branch**: main
   - **Build Command**:
     ```
     cd eventease/frontend/eventease && npm install && npm run build
     ```
   - **Publish Directory**: `eventease/frontend/eventease/dist`

4. **Add Environment Variables**
   - Before Deploy, add environment variable:
     ```
     VITE_API_URL = https://eventease-backend.onrender.com/api
     ```
     (Replace with your actual backend URL from Step 2)

5. **Deploy**
   - Click "Deploy Static Site"
   - Wait for deployment (2-3 minutes)
   - Copy the frontend URL (e.g., https://eventease-frontend.onrender.com)

---

## Part 4: Update Frontend API URL (If Needed)

If frontend needs to call backend with different URL:

1. Edit `eventease/frontend/eventease/.env.production`
2. Update:
   ```env
   VITE_API_URL=https://eventease-backend.onrender.com/api
   ```
3. Commit and push to GitHub:
   ```bash
   git add .env.production
   git commit -m "Update production API URL for Render"
   git push origin main
   ```
4. Render will automatically redeploy

---

## Part 5: Configure CORS on Backend

Backend already has CORS configured for localhost. For production, update if needed:

**File**: `eventease/backend/server.js`

Update CORS origins:
```javascript
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://eventease-frontend.onrender.com'  // Add your frontend URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Then commit and push:
```bash
git add eventease/backend/server.js
git commit -m "Update CORS for production"
git push origin main
```

---

## Part 6: Setup MongoDB for Production

### 1. Import Sample Data to Atlas

Run this script locally to seed your Atlas database:

```bash
cd eventease/backend
MONGODB_URI="your_atlas_connection_string" node scripts/addComprehensiveEvents.js
```

### 2. Verify Data

```bash
MONGODB_URI="your_atlas_connection_string" node scripts/checkDatabase.js
```

---

## Part 7: Test Deployment

### Test Backend API
```bash
curl https://eventease-backend.onrender.com/api/health
curl https://eventease-backend.onrender.com/api/events?limit=10
```

### Test Frontend
- Visit: https://eventease-frontend.onrender.com
- Check browser console (F12) for any API errors
- Try registering and logging in

---

## Troubleshooting

### Backend Shows 500 Error
1. Check Render logs: Dashboard → Backend Service → Logs
2. Verify MONGODB_URI is correct
3. Verify MongoDB Atlas whitelist includes Render's IP (set to 0.0.0.0/0)

### Frontend Shows "Failed to Connect"
1. Check frontend environment variable: VITE_API_URL
2. Verify backend URL is correct and running
3. Check CORS settings on backend

### Rebuild on Render
- Make changes locally
- Commit: `git commit -am "Your message"`
- Push: `git push origin main`
- Render automatically deploys

### Free Plan Limitations
- Backend spins down after 15 minutes of inactivity (takes 30 seconds to wake)
- Static site is always active
- 1GB RAM, 0.5 vCPU for web service
- Perfect for testing/demo, upgrade for production

---

## Estimated Costs

- **Backend (Web Service)**: Free tier available
- **Frontend (Static Site)**: Free tier available
- **MongoDB Atlas**: Free tier available (512MB storage)
- **Total**: $0/month for development

---

## Next Steps

1. ✅ Create Render account
2. ✅ Setup MongoDB Atlas
3. ✅ Deploy backend to Render
4. ✅ Deploy frontend to Render
5. ✅ Update API URLs
6. ✅ Test all features
7. ✅ Share deployed URLs

Your app is now live! 🎉

---

## Production Checklist

- [ ] MongoDB Atlas backup enabled
- [ ] JWT_SECRET changed from default
- [ ] CORS origins configured correctly
- [ ] Environment variables set securely
- [ ] Database seeded with events
- [ ] Test login/registration works
- [ ] Test event registration works
- [ ] Admin dashboard accessible
- [ ] Mobile responsive works
- [ ] Share URLs with team

---

## Support

For issues:
1. Check Render logs
2. Check MongoDB Atlas logs
3. Check browser console (F12)
4. Review this guide
5. Check GitHub issues

Happy deploying! 🚀
