from datetime import datetime
from supabase_client import supabase
import os
from dotenv import load_dotenv
import requests
import json

load_dotenv()

class Database:

    def __init__(self):
        self.supabase = supabase

    # def update_user(self, uuid: str, wallet_address: str, role: str):
    #     user = self.get_user_by_uuid(uuid)
    #     if user:
    #         if user.wallet_address == "empty" and user.role == "empty":   # ❌ problem here
    #             self.supabase.table("users").update({"wallet_address": wallet_address, "role": role}).eq("id", uuid).execute()
    #     return user
    def get_user_by_uuid(self, uuid: str):
        return self.supabase.table("users").select("*").eq("id", uuid).execute()

    def get_transactions_by_user(self, wallet_address: str):
        return self.supabase.table("transactions").select("*").or_(
            f"sender_wallet_address.eq.{wallet_address},receiver_wallet_address.eq.{wallet_address}"
        ).execute()

    def insert_transaction(
        self,
        transaction_id: str,
        sender_wallet_address: str,
        receiver_wallet_address: str,
        credit_id: int,
        credits: float,
        status: str,
        metadata: str,
        created_at: datetime,   # keep as datetime here
    ):
        transaction = { 
            "transaction_id": str(transaction_id),
            "sender_wallet_address": sender_wallet_address,
            "receiver_wallet_address": receiver_wallet_address,
            "credit_id": credit_id,
            "credits": credits,
            "status": status,
            "metadata": metadata,
            "created_at": created_at.isoformat() if created_at else None,  # ✅ serialize
        }
        result = self.supabase.table("transactions").insert(transaction).execute()
        return result


    def update_company(self, user_id: str, name: str, description: str, created_at: str, metadata: str):
        company = {
            "user_id": user_id,
            "created_at": created_at,
            "name": name,
            "description": description,
            "metadata": metadata
        }
        response = self.supabase.table("company").insert(company).execute()
        return response  # <-- return actual inserted row(s)
        
    
    def get_company_by_id(self, id: str):
        return self.supabase.table("company").select("*").eq("user_id", id).execute()


# ETHERSCAN_API_URL = os.getenv("ETHERSCAN_API_URL")  # replace with your real API URL
# ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")  # replace with your real API key



# def get_transaction(tx_hash: str):
#     params = {
#         "module": "proxy",
#         "action": "eth_getTransactionByHash",
#         "txhash": tx_hash,
#         "apikey": ETHERSCAN_API_KEY
#     }
#     response = requests.get(ETHERSCAN_API_URL, params=params)
    
#     if response.status_code != 200:
#         raise Exception(f"Error fetching transaction: {response.text}")
    
#     data = response.json()
    
#     print(data)

# def get_transaction_status(tx_hash: str):
#     params = {
#         "module": "proxy",
#         "action": "eth_getTransactionReceipt",
#         "txhash": tx_hash,
#         "apikey": ETHERSCAN_API_KEY
#     }
#     response = requests.get(ETHERSCAN_API_URL, params=params)
    
#     if response.status_code != 200:
#         raise Exception(f"Error fetching transaction: {response.text}")
    
#     data = response.json()
    
#     print(data)


