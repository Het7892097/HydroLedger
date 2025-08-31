# HydroLedger Backend - Render Deployment

This FastAPI backend is ready for deployment on Render.com.

## Deployment Steps

### Option 1: Standard Deployment (Try this first)

1. **Push to GitHub**
```bash
git add .
git commit -m "Add Render deployment files with fixed dependencies"
git push origin main
```

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Root Directory**: `backEnd/python`
     - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
     - **Start Command**: `python start.py`

### Option 2: If Build Fails (Lightweight version)

If you get Rust/maturin errors, use the lightweight version:

1. **Rename requirements files**
```bash
mv requirements.txt requirements-full.txt
mv requirements-lite.txt requirements.txt
```

2. **Update your database imports** (if using lightweight version)
In your `db.py` and `auth.py`, replace:
```python
from supabase import create_client, Client
```
with:
```python
from simple_supabase import SimpleSupabaseClient as Client
```

### 3. Environment Variables
Add these in Render dashboard:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon/service key

## Files Added

- `requirements.txt`: Main dependencies (with fixed supabase version)
- `requirements-lite.txt`: Lightweight alternative
- `simple_supabase.py`: Lightweight Supabase client
- `start.py`: Entry point for Render
- `runtime.txt`: Python version specification
- `.python-version`: Python version file
- `pip.conf`: Pip configuration for better builds
- `render.yaml`: Render service configuration

## Troubleshooting

1. **Rust/maturin errors**: Use Option 2 (lightweight version)
2. **Build timeout**: The free tier has build time limits
3. **Memory errors**: Consider upgrading to a paid plan

## Notes
- Downgraded supabase from 2.0.2 to 1.0.4 to avoid Rust compilation issues
- Added backup lightweight client using httpx
- Configured pip for better build performance on Render

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
