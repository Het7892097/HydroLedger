from web3 import Web3
import json
import os
from dotenv import load_dotenv

# Load environment variables (store keys in .env file)
load_dotenv()

INFURA_URL = os.getenv("INFURA_URL")  # Example: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY = os.getenv("PRIVATE_KEY")  # Your wallet private key
ACCOUNT_ADDRESS = os.getenv("ACCOUNT_ADDRESS")  # Your wallet public address

# Connect to Infura Sepolia RPC
w3 = Web3(Web3.HTTPProvider(INFURA_URL))

if not w3.is_connected():
    raise Exception("❌ Failed to connect to Ethereum node")

print("✅ Connected to Ethereum network")

# Load compiled contract artifact (from Hardhat build folder)
path = os.path.join(os.getcwd())
with open(os.path.join(path, "backEnd/blockchain/artifacts/contracts/GreenHydrogenCredit.sol/GreenHydrogenCredit.json")) as f:
    contract_artifact = json.load(f)

abi = contract_artifact["abi"]
bytecode = contract_artifact["bytecode"]

print(abi)
print(bytecode)
# Create contract instance
contract = w3.eth.contract(abi=abi, bytecode=bytecode)

# Create contract object
contract = w3.eth.contract(abi=abi, bytecode=bytecode)

# Get latest nonce
nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)

# Build transaction
transaction = contract.constructor().build_transaction({
    "chainId": 11155111,  # Example: Sepolia Testnet
    "from": ACCOUNT_ADDRESS,
    "nonce": nonce,
    "gas": 3000000,
    "gasPrice": w3.to_wei("10", "gwei")
})

# Sign transaction
signed_txn = w3.eth.account.sign_transaction(transaction, private_key=PRIVATE_KEY)

# Send transaction
tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)

# Wait for transaction receipt
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

# ✅ Contract address after deployment
print(f"Contract deployed at address: {tx_receipt.contractAddress}")