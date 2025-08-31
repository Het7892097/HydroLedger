from web3 import Web3
from dotenv import load_dotenv
import os
import json
load_dotenv()


class TransactionManager:

    def __init__(self):
        self.enumerate_roles = ["Producer", "Consumer", "Certifier"]
        self.contract = None
        self.INFURA_URL = os.getenv("INFURA_URL")
        self.CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
        self.contract = self._load_contract()

    def _load_contract(self):
        # connect to RPC
        w3 = Web3(Web3.HTTPProvider(self.INFURA_URL))
        path = os.getcwd()
        with open(os.path.join(path, "backEnd/blockchain/artifacts/contracts/GreenHydrogenCredit.sol/GreenHydrogenCredit.json"), "r") as f:
            abi = json.load(f)["abi"]
        contract = w3.eth.contract(address=self.CONTRACT_ADDRESS, abi=abi)
        return contract

    def check_role(self, account_address: str):
        if self.contract!=None:
            is_producer = self.contract.functions.isProducer(account_address).call()
            is_consumer = self.contract.functions.isConsumer(account_address).call()
            is_verifier = self.contract.functions.isVerifier(account_address).call()
            if is_producer:
                role = self.enumerate_roles[0]
            elif is_consumer:
                role = self.enumerate_roles[1]
            elif is_verifier:
                role = self.enumerate_roles[2]
            else:
                role="empty"
            return role
        return "empty"



    def get_producer_transactions(self, account_address: str):
        role = self.check_role(account_address)
        if role == "Producer":
            transactions = self.contract.functions.getCreditsByProducer(account_address).call()
            return transactions
        return {"error": "Account is not a producer"}

# # Get single credit
# credit = contract.functions.getCredit(0).call()
# print("Credit[0]:", credit)
# # Params: creditId (uint256)

# # Returns: (id, producer, amount, consumed, status, metadata)

# # status = 0: Pending, 1: Verified, 2: Rejected

# # Get balances
# print("Producer balance:", contract.functions.getBalance(role).call())
# # Params: address

# # Returns: uint256 (balance in credits)

# # Check consumer verification
# print("Consumer verified:", contract.functions.isConsumerVerified(role).call())
# # Params: address

# # Returns: bool


# # Get all credits created by producer
# producer_credits = contract.functions.getCreditsByProducer(role).call()
# print("Producer credits:", producer_credits)
# # Params: producer_address

# # Returns: list of Credit structs
# # Each element is (id, producer, amount, consumed, status, metadata)



# consumer_credits = contract.functions.getCreditsByConsumer(role).call()
# print("Consumer credits:", consumer_credits)
# # Params: consumer_address

# # Returns: list of Credit structs
# # Each element is (id, producer, amount, consumed, status, metadata)



