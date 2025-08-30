from datetime import datetime
from typing import Optional, Literal, Dict
from pydantic import BaseModel, Field
from uuid import UUID

# ----------------------
# User Models
# ----------------------

class UserBase(BaseModel):
    email_id: str
    full_name: str
    wallet_address: str
    role: str

class UserDB(UserBase):
    """Model for reading from Supabase"""
    id: UUID
    created_at: datetime


# ----------------------
# Transaction Models
# ----------------------

class TransactionBase(BaseModel):
    sender_wallet_address: str
    receiver_wallet_address: str
    credits: int
    credit_id: int
    metadata: Optional[Dict] = Field(default_factory=dict)

class TransactionCreate(TransactionBase):
    """For creating new blockchain → DB entries"""
    status: Literal["Pending", "Verified", "Rejected"] = "Pending"

class TransactionDB(TransactionBase):
    """For reading transaction records"""
    transaction_id: str
    status: Literal["Pending", "Verified", "Rejected"]
    created_at: datetime


