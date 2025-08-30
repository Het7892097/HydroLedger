from supabase import create_client, Client
import os
from dotenv import load_dotenv
import requests

load_dotenv()



SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def update_user(uuid:str ,wallet_address: str, role: str):
    user = get_user_by_uuid(uuid)
    if user:
        if user.wallet_address == "empty" and user.role == "empty":
            supabase.table("users").update({"wallet_address": wallet_address, "role": role}).eq("id", uuid).execute()


def get_user_by_uuid(uuid: str):
    return supabase.table("users").select("*").eq("id", uuid).execute()

def get_transactions_by_user(wallet_address: str):
    return supabase.table("transactions").select("*").or_(
        f"sender_wallet_address.eq.{wallet_address},receiver_wallet_address.eq.{wallet_address}"
    ).execute()


def insert_transaction(tx_hash: str, sender_wallet_address: str, receiver_wallet_address: str, credit_id: str, credits: float, status: str, metadata: str, created_at: str):
    transaction = {
        "transaction_id": tx_hash,
        "sender_wallet_address": sender_wallet_address,
        "receiver_wallet_address": receiver_wallet_address,
        "credit_id": credit_id,
        "credits": credits,
        "status": status,
        "metadata": metadata,
        "created_at": created_at,
    }
    result = supabase.table("transactions").insert(transaction).execute()
    return result



ETHERSCAN_API_URL = os.getenv("ETHERSCAN_API_URL")  # replace with your real API URL
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")  # replace with your real API key



def get_transaction(tx_hash: str):
    params = {
        "module": "proxy",
        "action": "eth_getTransactionByHash",
        "txhash": tx_hash,
        "apikey": ETHERSCAN_API_KEY
    }
    response = requests.get(ETHERSCAN_API_URL, params=params)
    
    if response.status_code != 200:
        raise Exception(f"Error fetching transaction: {response.text}")
    
    data = response.json()
    
    print(data)

def get_transaction_status(tx_hash: str):
    params = {
        "module": "proxy",
        "action": "eth_getTransactionReceipt",
        "txhash": tx_hash,
        "apikey": ETHERSCAN_API_KEY
    }
    response = requests.get(ETHERSCAN_API_URL, params=params)
    
    if response.status_code != 200:
        raise Exception(f"Error fetching transaction: {response.text}")
    
    data = response.json()
    
    print(data)
