import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from supabase import create_client, Client

from models import UserDB

# -------------------------
# ENV + Supabase Setup
# -------------------------
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("❌ Supabase credentials not set in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# -------------------------
# Auth Helpers
# -------------------------

def get_user_from_token(access_token: str) -> UserDB:
    """
    Authenticate user with Supabase access token.
    - Validates token with Supabase auth
    - Checks if user exists in UserTable
    - Creates user if missing
    Returns: UserDB
    """
    # 1. Get auth user info from Supabase
    try:
        user_response = supabase.auth.get_user(access_token)
    except Exception as e:
        raise ValueError(f"❌ Invalid or expired Supabase access token: {e}")

    if not user_response or not user_response.user:
        raise ValueError("❌ No user found for this access token")

    auth_user = user_response.user
    user_id = auth_user.id
    email = auth_user.email or ""
    full_name = auth_user.user_metadata.get("name", "")

    # 2. Check in users
    existing = supabase.table("users").select("*").eq("id", user_id).execute()

    if existing.data:
        user_row = existing.data[0]
    else:
        # 3. Insert if missing
        new_user = {
            "id": user_id,
            "email_id": email,
            "full_name": full_name,
            "wallet_address": "empty",  # empty until linked
            "role": "empty",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        result = supabase.table("users").insert(new_user).execute()
        user_row = result.data[0]

    # 4. Return strongly typed UserDB
    return UserDB(**user_row)

access_token = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkVwSUlDUkZ4TjM4RGg2TGkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3V0c29rdXFkbGtrZ3BnaWR0aHRxLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJhODAyYWUzZi0xODIwLTQ4MjktOTk4NC0xZmY4NzdhZmFkNjYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU2NTM2MjU1LCJpYXQiOjE3NTY1MzI2NTUsImVtYWlsIjoiaGV0NDE2NjRAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJnb29nbGUiLCJwcm92aWRlcnMiOlsiZ29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKNzlZUUxIM0YwcW82THZDVmcyZVFzUUQ5Q0RMWWQxaWtEeFhUUU94N1ZRYTM5aVdNPXM5Ni1jIiwiZW1haWwiOiJoZXQ0MTY2NEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiSGV0IFBhdGVsIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tIiwibmFtZSI6IkhldCBQYXRlbCIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0o3OVlRTEgzRjBxbzZMdkNWZzJlUXNRRDlDRExZZDFpa0R4WFRRT3g3VlFhMzlpV009czk2LWMiLCJwcm92aWRlcl9pZCI6IjExNzEyMTU5MzQ0NjQ5Mjg1MDI1MiIsInN1YiI6IjExNzEyMTU5MzQ0NjQ5Mjg1MDI1MiJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNzU2NTMyNjU1fV0sInNlc3Npb25faWQiOiIwYjNlZmU3MS1iY2RiLTQ5ZTctYjk1My01YjdmYmNjMDFkOGEiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.L7dp45xIYc3EYHrn9bCwCOdOJ8fzeCiM5QAgWmE5dVk"
try:
    user = get_user_from_token(access_token)
    # print("✅ Authenticated:", user)
except ValueError as e:
    print("Auth failed:", e)
