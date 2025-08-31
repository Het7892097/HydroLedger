from http.client import HTTPException
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

def get_user_verify_from_token(access_token: str) -> dict:
    try:
        user_response = supabase.auth.get_user(access_token)
    except Exception as e:
        raise ValueError(f"❌ Invalid or expired Supabase access token: {e}")

    if not user_response or not user_response.user:
        raise ValueError("❌ No user found for this access token")

    user_id = user_response.user.id
    email = user_response.user.email or ""
    full_name = user_response.user.user_metadata.get("name", "")

    # 2. Check in users
    existing = supabase.table("users").select("*").eq("id", user_id).execute()

    if existing.data:
        user_row = existing.data[0]
        return user_row
    else:
        return {
            'id': user_id,
            'email_id': email,
            'full_name': full_name,
        }

def create_user(auth_user: dict) -> dict:
    user_data = {
        "id": auth_user['id'],
        "email_id": auth_user['email_id'],
        "full_name": auth_user['full_name'],
        "wallet_address": auth_user['wallet_address'],
        "role": auth_user['role'],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    response = supabase.table("users").insert(user_data).execute()

    if response.data:  # if insert was successful
        return response.data[0]   # return the inserted row
    else:
        raise HTTPException(status_code=400, detail="Failed to create user")

    

# def get_user_from_token(access_token: str) -> UserDB:
#     """
#     Authenticate user with Supabase access token.
#     - Validates token with Supabase auth
#     - Checks if user exists in UserTable
#     - Creates user if missing
#     Returns: UserDB
#     """

#     auth_user = get_user_verify_from_token(access_token)
#     user_id = auth_user.id
#     email = auth_user.email or ""
#     full_name = auth_user.user_metadata.get("name", "")

#     # 2. Check in users
#     existing = supabase.table("users").select("*").eq("id", user_id).execute()

#     if existing.data:
#         print("Existing User")
#         user_row = existing.data[0]
#     else:
#         print("New User")
#         # 3. Insert if missing
#         new_user = {
#             "id": user_id,
#             "email_id": email,
#             "full_name": full_name,
#             "wallet_address": None,
#             "role": None,
#             "created_at": datetime.now(timezone.utc).isoformat(),
#         }
#         result = supabase.table("users").insert(new_user).execute()
#         user_row = result.data[0]

#     # 4. Return strongly typed UserDB
#     return UserDB(**user_row)