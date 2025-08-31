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


@app.get("/get-user", response_model=UserDB)
def get_user(uuid: str):
    result = database.supabase.table("users").select("*").eq("id", uuid).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return result.data[0]


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
        credit_id=tx.credit_id,
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
@app.get("/get-transaction-id", response_model=TransactionDB)
def get_transaction(transaction_id: str):
    result = database.supabase.table("transactions").select("*").eq("transaction_id", transaction_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return result.data[0]


# ---------------------------
# 5. Get all Transactions by Wallet Address
# ---------------------------
@app.get("/get-all-transactions-wallet", response_model=List[TransactionDB])
def get_all_transactions(wallet_address: str):
    result = database.get_transactions_by_user(wallet_address)
    return result.data if result.data else []


@app.get("/get-all-transactions-credit", response_model=List[TransactionDB])
def get_all_transactions(credit_id: int):
    result = database.supabase.table("transactions").select("*").eq("credit_id", credit_id).execute()
    return result.data if result.data else []

@app.get("/get-combined-transactions-wallet", response_model=List[dict])
def get_combined_transactions(wallet_address: str):
    """
    Fetch all transactions for a given wallet, including sender/receiver user info
    and their company names.
    """

    # fetch transactions with sender + receiver users joined in one query
    tx_result = (
        database.supabase.table("transactions")
        .select(
            """
            *,
            sender:users!transactions_sender_wallet_address_fkey(id, full_name, wallet_address),
            receiver:users!transactions_receiver_wallet_address_fkey(id, full_name, wallet_address)
            """
        )
        .or_(f"sender_wallet_address.eq.{wallet_address},receiver_wallet_address.eq.{wallet_address}")
        .execute()
    )


    txs = tx_result.data or []
    if not txs:
        return []

    # collect all user IDs (sender + receiver) to fetch companies in one go
    user_ids = set()
    for tx in txs:
        if tx.get("sender"):
            user_ids.add(tx["sender"]["id"])
        if tx.get("receiver"):
            user_ids.add(tx["receiver"]["id"])

    company_by_user = {}
    if user_ids:
        comp_result = (
            database.supabase.table("company")
            .select("user_id, name")
            .in_("user_id", list(user_ids))
            .execute()
        )
        for c in comp_result.data or []:
            company_by_user[c["user_id"]] = c["name"]

    # annotate each transaction with sender/receiver names + companies
    transactions = []
    for tx in txs:
        tx_copy = tx.copy()

        sender = tx.get("sender")
        receiver = tx.get("receiver")

        tx_copy["sender_name"] = sender["full_name"] if sender else None
        tx_copy["sender_company_name"] = company_by_user.get(sender["id"]) if sender else None

        tx_copy["receiver_name"] = receiver["full_name"] if receiver else None
        tx_copy["receiver_company_name"] = company_by_user.get(receiver["id"]) if receiver else None

        transactions.append(tx_copy)

    return transactions

# ---------------------------
# 6. Get Pending Transactions (for certifiers)
# ---------------------------
@app.get("/transactions-pending", response_model=List[TransactionDB])
def get_pending_transactions():
    result = database.supabase.table("transactions").select("*").eq("status", "Pending").execute()
    return result.data if result.data else []

# ---------------------------
# 7. Get Verified Transactions (for consumers)
# ---------------------------
@app.get("/transactions-verified", response_model=List[TransactionDB])
def get_verified_transactions():
    result = database.supabase.table("transactions").select("*").eq("status", "Verified").execute()
    return result.data if result.data else []




@app.get("/get-company", response_model=CompanyDB)
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

