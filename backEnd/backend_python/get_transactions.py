from web3 import Web3
from dotenv import load_dotenv
import os
import json
load_dotenv()

INFURA_URL = os.getenv("INFURA_URL")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
ACCOUNT_ADDRESS = os.getenv("ACCOUNT_ADDRESS")
# connect to RPC
w3 = Web3(Web3.HTTPProvider(INFURA_URL))

with open("backEnd/blockchain/artifacts/contracts/GreenHydrogenCredit.sol/GreenHydrogenCredit.json","r") as f:
    abi = json.load(f)["abi"]


contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

role = ACCOUNT_ADDRESS

# Check roles
print("Is Producer:", contract.functions.isProducer(role).call())
print("Is Consumer:", contract.functions.isConsumer(role).call())
print("Is Verifier:", contract.functions.isVerifier(role).call())

# Get single credit
credit = contract.functions.getCredit(0).call()
print("Credit[0]:", credit)
# Params: creditId (uint256)

# Returns: (id, producer, amount, consumed, status, metadata)

# status = 0: Pending, 1: Verified, 2: Rejected

# Get balances
print("Producer balance:", contract.functions.getBalance(producer).call())
# Params: address

# Returns: uint256 (balance in credits)

# Check consumer verification
print("Consumer verified:", contract.functions.isConsumerVerified(consumer).call())
# Params: address

# Returns: bool


# Get all credits created by producer
producer_credits = contract.functions.getCreditsByProducer(producer).call()
print("Producer credits:", producer_credits)
# Params: producer_address

# Returns: list of Credit structs
# Each element is (id, producer, amount, consumed, status, metadata)



consumer_credits = contract.functions.getCreditsByConsumer(consumer).call()
print("Consumer credits:", consumer_credits)
# Params: consumer_address

# Returns: list of Credit structs
# Each element is (id, producer, amount, consumed, status, metadata)



