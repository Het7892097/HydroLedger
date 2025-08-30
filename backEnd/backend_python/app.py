from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone

from auth import get_user_from_token
from db import (
    update_user,
    get_user_by_uuid,
    get_transactions_by_user,
    insert_transaction,
    supabase,
)
from models import UserDB, TransactionDB, TransactionCreate

app = FastAPI(title="Supabase Auth & Transaction API")


# ---------------------------
# 1. Authentication
# ---------------------------
@app.get("/authenticate")
def authenticate_user(token: str):
    try:
        user = get_user_from_token(token)
        return JSONResponse(content=user.dict())
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


# ---------------------------
# 2. Update Wallet/Role
# ---------------------------
@app.get("/updateuser")
def update_user_data(
    uuid: str = Query(..., description="User UUID"),
    wallet_address: Optional[str] = None,
    role: Optional[str] = None,
):
    if not wallet_address and not role:
        raise HTTPException(status_code=400, detail="Must provide wallet_address or role")

    update_user(uuid, wallet_address, role)
    user = get_user_by_uuid(uuid)
    if user.data:
        return JSONResponse(content=user.data[0])
    else:
        return JSONResponse(content={"message": "User not found"})


# ---------------------------
# 3. Create Transaction
# ---------------------------
@app.post("/create-transaction", response_model=TransactionDB)
def create_transaction(tx: TransactionCreate):
    tx_hash = f"tx_{datetime.now().timestamp()}"  # Simple ID generator
    created_at = datetime.now(timezone.utc).isoformat()

    result = insert_transaction(
        tx_hash=tx_hash,
        sender_wallet_address=tx.sender_wallet_address,
        receiver_wallet_address=tx.receiver_wallet_address,
        credit_id=str(tx.credit_id),
        credits=tx.credits,
        status=tx.status,
        metadata=str(tx.metadata),
        created_at=created_at,
    )

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to insert transaction")

    return result.data[0]


# ---------------------------
# 4. Get Transaction by ID
# ---------------------------
@app.get("/get-transaction", response_model=TransactionDB)
def get_transaction(transaction_id: str):
    result = supabase.table("transactions").select("*").eq("transaction_id", transaction_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return result.data[0]


# ---------------------------
# 5. Get all Transactions by Wallet Address
# ---------------------------
@app.get("/get-all-transactions", response_model=List[TransactionDB])
def get_all_transactions(wallet_address: str):
    result = get_transactions_by_user(wallet_address)
    return result.data if result.data else []


# ---------------------------
# 6. Get Pending Transactions (for certifiers)
# ---------------------------
@app.get("/transactions/pending", response_model=List[TransactionDB])
def get_pending_transactions():
    result = supabase.table("transactions").select("*").eq("status", "Pending").execute()
    return result.data if result.data else []


# ---------------------------
# 7. Get Verified Transactions (for consumers)
# ---------------------------
@app.get("/transactions/verified", response_model=List[TransactionDB])
def get_verified_transactions():
    result = supabase.table("transactions").select("*").eq("status", "Verified").execute()
    return result.data if result.data else []

