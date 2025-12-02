# Cheatsheet Editor - Setup Guide

## GitHub OAuth Authentication Setup

### 1. Create a GitHub OAuth App

1. Go to GitHub Settings: https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in the application details:
   - **Application name**: Cheatsheet Editor (or any name)
   - **Homepage URL**: `http://localhost:5173` (for development)
   - **Authorization callback URL**: `http://localhost:3001/auth/github/callback`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### 2. Install and Configure MongoDB

**Option A: Local MongoDB Installation**

- macOS: `brew install mongodb-community`
- Ubuntu: `sudo apt install mongodb`
- Windows: Download from https://www.mongodb.com/try/download/community

Start MongoDB:
```bash
# macOS/Linux
sudo systemctl start mongod

# Or use brew services (macOS)
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Use the connection string in your `.env` file

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/cheatsheet
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/cheatsheet

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:3001/auth/github/callback

# Session Configuration
SESSION_SECRET=your_random_session_secret_here_make_it_long_and_random

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Generate a random session secret:**
```bash
# Use this command to generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Application

**Terminal 1 - Start the backend server:**
```bash
npm run server:dev
```

**Terminal 2 - Start the frontend:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### 6. Test the Application

1. Open http://localhost:5173 in your browser
2. Click "Sign in with GitHub"
3. Authorize the application
4. Start creating your cheatsheets!
5. Open the same URL on another device or browser to verify sync

## Production Deployment

### Environment Variables for Production

Update your `.env` for production:

```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
GITHUB_CALLBACK_URL=https://your-domain.com/api/auth/github/callback
```

### Update GitHub OAuth App

1. Go back to your GitHub OAuth App settings
2. Update the Homepage URL and Callback URL to your production domain

### Security Considerations

- Use HTTPS in production
- Set `secure: true` for cookies (already configured in server/index.js)
- Use a strong, unique SESSION_SECRET
- Keep your `.env` file secure and never commit it to git

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongosh` (should connect successfully)
- Check your MONGODB_URI is correct
- For MongoDB Atlas, ensure your IP is whitelisted

### GitHub OAuth Issues
- Verify Client ID and Secret are correct
- Check callback URL matches exactly
- Ensure your app is registered on GitHub

### CORS Issues
- Verify FRONTEND_URL matches your actual frontend URL
- Check that credentials are being sent with requests

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

## Features

- **GitHub Authentication**: Secure login with GitHub OAuth
- **Cloud Sync**: All your cheatsheets automatically sync across devices
- **Real-time Updates**: Changes are saved automatically after 2 seconds
- **Markdown Editor**: Write with live preview
- **Export to PDF**: Share your cheatsheets easily
- **Multi-device Support**: Access from anywhere

## Development Tips

- Backend auto-restarts on file changes with nodemon
- Frontend has hot module replacement (HMR)
- Check browser console and server logs for debugging
- Use MongoDB Compass for viewing database contents
