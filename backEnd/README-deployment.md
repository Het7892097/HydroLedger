# HydroLedger Backend - Render Deployment

This FastAPI backend is ready for deployment on Render.com.

## Deployment Steps

### 1. Push to GitHub (if not already done)
```bash
git add .
git commit -m "Add Render deployment files"
git push origin main
```

### 2. Deploy on Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select the `HydroLedger` repository
5. Configure the service:
   - **Name**: `hydroledger-backend`
   - **Root Directory**: `backEnd`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start Command**: `python start.py`

### 3. Environment Variables
Add these environment variables in Render dashboard:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon/service key

### 4. Deploy
Click "Create Web Service" and Render will automatically deploy your app.

## Files Added for Deployment

- `requirements.txt`: Python dependencies
- `start.py`: Entry point that handles Render's PORT environment variable
- `runtime.txt`: Specifies Python version
- `Procfile`: Process type declaration (backup for start command)
- `render.yaml`: Render service configuration
- `README-deployment.md`: This deployment guide

## Local Testing
To test locally before deployment:
```bash
cd backEnd/python
pip install -r requirements.txt
python start.py
```

## API Endpoints
Your deployed API will be available at: `https://your-service-name.onrender.com`

Main endpoints:
- `GET /`: Health check
- `GET /authenticate`: User authentication
- `POST /create-user`: Create new user
- `POST /create-transaction`: Create transaction
- `GET /get-all-transactions-wallet`: Get user transactions
- And more...

## Notes
- The app automatically binds to the PORT environment variable provided by Render
- CORS is configured to allow all origins (adjust in production if needed)
- Make sure your Supabase credentials are correctly set in environment variables
