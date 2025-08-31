from fastapi import FastAPI, Query, HTTPException
# from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
from fastapi import Header, Body
from fastapi.middleware.cors import CORSMiddleware
import json
from datetime import datetime, timezone

from auth import get_user_verify_from_token, create_user
from db import (
    Database,
)
from models import CompanyDB, UserDB, TransactionDB

app = FastAPI(title="Supabase Auth & Transaction API")
database = Database()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ Allow all domains
    allow_credentials=True,
    allow_methods=["*"],   # ✅ Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],   # ✅ Allow all headers (Authorization, Content-Type, etc.)
)

@app.get("/")
def root():
    return {"message": "Hello, FastAPI is running!"}
# ---------------------------
# 1. Authentication
# ---------------------------
@app.get("/authenticate")
def authenticate_user(authorization: str = Header(...)):
    print(authorization)
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid authorization header format")
    
    token = authorization.split(" ")[1]
    try:
        user = get_user_verify_from_token(token)
        return user   # ✅ return model directly, FastAPI handles UUID serialization
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

# ---------------------------
# 2. Create User
# ---------------------------
@app.post("/create-user", response_model=UserDB)
def create_user_data(auth_user: dict):
    try:
        if not auth_user.get("wallet_address") and not auth_user.get("role"):
            raise HTTPException(status_code=400, detail="Must provide wallet_address or role")
        return create_user(auth_user)
    except Exception as e:
        # Catch & expose actual error
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")



# ---------------------------
# 3. Create Transaction
# ---------------------------
@app.post("/create-transaction", response_model=TransactionDB)
def create_transaction(tx: TransactionDB):
    # Ensure metadata is dict
    metadata = tx.metadata

    result = database.insert_transaction(
        transaction_id=tx.transaction_id,
        sender_wallet_address=tx.sender_wallet_address,
        receiver_wallet_address=tx.receiver_wallet_address,
        credit_id=str(tx.credit_id),
        credits=tx.credits,
        status=tx.status,
        metadata=metadata,  # keep dict
        created_at=tx.created_at,
    )

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to insert transaction")

    return result.data[0]

# ---------------------------
# 4. Get Transaction by ID
# ---------------------------
@app.get("/get-transaction", response_model=TransactionDB)
def get_transaction(transaction_id: str):
    result = database.supabase.table("transactions").select("*").eq("transaction_id", transaction_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return result.data[0]


# ---------------------------
# 5. Get all Transactions by Wallet Address
# ---------------------------
@app.get("/get-all-transactions", response_model=List[TransactionDB])
def get_all_transactions(wallet_address: str):
    result = database.get_transactions_by_user(wallet_address)
    return result.data if result.data else []


# ---------------------------
# 6. Get Pending Transactions (for certifiers)
# ---------------------------
@app.get("/transactions/pending", response_model=List[TransactionDB])
def get_pending_transactions():
    result = database.supabase.table("transactions").select("*").eq("status", "Pending").execute()
    return result.data if result.data else []

# ---------------------------
# 7. Get Verified Transactions (for consumers)
# ---------------------------
@app.get("/transactions/verified", response_model=List[TransactionDB])
def get_verified_transactions():
    result = database.supabase.table("transactions").select("*").eq("status", "Verified").execute()
    return result.data if result.data else []

@app.get("/company/{user_id}", response_model=CompanyDB)
def get_company(user_id: str):
    result = database.get_company_by_id(user_id)
    if not result.data:
        raise HTTPException(status_code=404, detail="Company not found")
    return result.data[0]

@app.post("/company/create", response_model=CompanyDB)
def create_company(company: CompanyDB):
    response = database.update_company(
        user_id=str(company.user_id),
        name=company.name,
        description=company.description,
        created_at=company.created_at.isoformat(),
        metadata=company.metadata
    )

    if not response.data:  # insert failed
        raise HTTPException(status_code=400, detail="Company insert failed")

    return response.data[0]  # return first inserted row as dict


@app.post("/company/update", response_model=CompanyDB)
def update_company(company: CompanyDB):
    response = database.update_company(
        user_id=company.user_id,
        name=company.name,
        description=company.description,
        created_at=company.created_at,
        metadata=company.metadata
    )
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create company")
    return response.data[0]

