# Deployment Guide

This guide will help you deploy your cheatsheet app for free using:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" and create an account
3. Create a **free M0 cluster**:
   - Choose your nearest cloud provider and region
   - Cluster name: `cheatsheet` (or any name you like)
4. **Create a database user**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `your_username`
   - Password: `your_password` (save this!)
   - User Privileges: "Read and write to any database"
5. **Whitelist all IP addresses**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add `0.0.0.0/0`)
6. **Get your connection string**:
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/cheatsheet`

**Save this connection string! You'll need it for Render.**

---

## Step 2: Create GitHub OAuth App

You need to create a GitHub OAuth app for production:

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `Cheatsheet App`
   - **Homepage URL**: `https://your-app-name.vercel.app` (you'll update this later)
   - **Authorization callback URL**: `https://your-backend-name.onrender.com/auth/github/callback`
4. Click "Register application"
5. **Save your Client ID** (shown on the page)
6. Click "Generate a new client secret"
7. **Save your Client Secret** (you can only see it once!)

---

## Step 3: Deploy Backend to Render

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

2. Go to https://render.com and sign up (use GitHub to sign in)

3. Click "New +" → "Web Service"

4. Connect your GitHub repository

5. Configure the service:
   - **Name**: `cheatsheet-backend` (or any name)
   - **Region**: Choose nearest to you
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. **Add Environment Variables** (click "Advanced" or scroll down):
   - `NODE_ENV` = `production`
   - `PORT` = `3001`
   - `MONGODB_URI` = `your-mongodb-atlas-connection-string`
   - `GITHUB_CLIENT_ID` = `your-github-oauth-client-id`
   - `GITHUB_CLIENT_SECRET` = `your-github-oauth-client-secret`
   - `GITHUB_CALLBACK_URL` = `https://your-backend-name.onrender.com/auth/github/callback`
   - `SESSION_SECRET` = `your-random-secret-from-env-file`
   - `FRONTEND_URL` = `https://your-app-name.vercel.app` (you'll update this later)

7. Click "Create Web Service"

8. Wait for deployment to complete (5-10 minutes)

9. **Copy your backend URL**: `https://your-backend-name.onrender.com`

**Important Notes:**
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- If you need always-on, upgrade to paid tier ($7/month)

---

## Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up (use GitHub to sign in)

2. Click "Add New..." → "Project"

3. Import your GitHub repository

4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-name.onrender.com`

6. Click "Deploy"

7. Wait for deployment to complete (2-3 minutes)

8. **Copy your frontend URL**: `https://your-app-name.vercel.app`

---

## Step 5: Update GitHub OAuth Callback URLs

Now that you have your deployed URLs, update your GitHub OAuth app:

1. Go back to https://github.com/settings/developers
2. Click on your OAuth app
3. Update:
   - **Homepage URL**: `https://your-app-name.vercel.app`
   - **Authorization callback URL**: `https://your-backend-name.onrender.com/auth/github/callback`
4. Click "Update application"

---

## Step 6: Update Environment Variables

1. **Update Render** (Backend):
   - Go to your Render dashboard
   - Click on your service
   - Go to "Environment"
   - Update `FRONTEND_URL` = `https://your-app-name.vercel.app`
   - Click "Save Changes" (this will redeploy)

2. **Update Vercel** (Frontend):
   - Already set in Step 4, but double-check `VITE_API_URL` is correct

---

## Step 7: Test Your Deployment

1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Click "Login with GitHub"
3. You should be redirected to GitHub for authorization
4. After authorizing, you should be redirected back and logged in
5. Test creating and saving content

---

## Troubleshooting

### Backend sleeps on Render free tier
- **Problem**: First request takes 30 seconds
- **Solution**: Upgrade to paid tier OR accept the delay

### CORS errors
- **Check**: Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly (no trailing slash)

### OAuth redirect issues
- **Check**: GitHub OAuth callback URL matches your Render backend URL exactly

### MongoDB connection errors
- **Check**: Connection string is correct
- **Check**: Password doesn't contain special characters (or is URL-encoded)
- **Check**: Network access allows `0.0.0.0/0`

### Environment variables not working
- **Render**: Changes require redeployment (automatic when you save)
- **Vercel**: Redeploy after changing environment variables

---

## Updating Your App

**For code changes:**

1. Make changes locally
2. Test locally with `npm run dev` and `npm run server:dev`
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your change description"
   git push
   ```
4. Render and Vercel will automatically redeploy!

---

## Cost Summary

- **MongoDB Atlas**: Free (512MB storage)
- **Render**: Free (sleeps after 15 min inactivity)
- **Vercel**: Free (unlimited projects)

**Total: $0/month** 🎉

---

## Optional: Custom Domain

Both Vercel and Render support custom domains for free:

1. Buy a domain (e.g., from Namecheap, Google Domains)
2. In Vercel: Settings → Domains → Add your domain
3. In Render: Settings → Custom Domains → Add your domain
4. Update DNS records as instructed
5. Update GitHub OAuth URLs with your custom domain

---

Need help? Check the logs in Render/Vercel dashboard or reach out!
