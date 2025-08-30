from web3 import Web3
import os
import json
from dotenv import load_dotenv
from db import insert_transaction

load_dotenv()

INFURA_URL = os.getenv("INFURA_URL")
w3 = Web3(Web3.HTTPProvider(INFURA_URL))

if not w3.is_connected():
    raise Exception("❌ Blockchain connection failed")

# Load compiled contract artifact (from Hardhat build folder)
path = os.path.join(os.getcwd())
with open(os.path.join(path, "artifacts/contracts/GreenHydrogenCredit.sol/GreenHydrogenCredit.json")) as f:
    contract_artifact = json.load(f)

contract_address = os.getenv("CONTRACT_ADDRESS")
contract = w3.eth.contract(address=contract_address, abi=contract_artifact["abi"])


def get_transaction(tx_hash: str):
    """Fetch tx details from blockchain"""
    tx = w3.eth.get_transaction(tx_hash)
    receipt = w3.eth.get_transaction_receipt(tx_hash)
    
    tx_data = {
        "transaction_id": tx_hash,
        "sender_wallet_address": tx["from"],
        "receiver_wallet_address": tx["to"],
        "status": "verified" if receipt["status"] == 1 else "rejected",
        "credits": tx["value"],  # Example: can be token value
        "metadata": {"blockNumber": receipt["blockNumber"]}
    }
    
    # Store in Supabase
    insert_transaction(tx_data)
    return tx_data
