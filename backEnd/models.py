from datetime import datetime
from typing import Optional, Literal, Dict
from pydantic import BaseModel, Field
from uuid import UUID
from typing import Dict, Any, Union
# ----------------------
# User Models
# ----------------------



class UserDB(BaseModel):
    """Model for reading from Supabase"""
    id: UUID
    email_id: str
    full_name: str
    wallet_address: str
    role: str
    created_at: datetime


    class Config:
        json_encoders = {
            UUID: str,
            datetime: lambda v: v.isoformat() if v else None
        }


# ----------------------
# Transaction Models
# ----------------------

class TransactionBase(BaseModel):
    sender_wallet_address: str
    receiver_wallet_address: str
    credit_id: int
    credits: int
    metadata: str

class TransactionDB(TransactionBase):
    transaction_id: str
    status: Literal["Pending", "Verified", "Rejected"]
    created_at: datetime

    class Config:
        json_encoders = {
            UUID: str,
            datetime: lambda v: v.isoformat() if v else None
        }


class CompanyDB(BaseModel):
    user_id: UUID
    created_at: datetime
    name: str
    description: str
    metadata: str

    class Config:
        json_encoders = {
            UUID: str,
            datetime: lambda v: v.isoformat() if v else None
        }