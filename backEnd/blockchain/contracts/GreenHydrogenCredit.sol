// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract GreenHydrogenCredit is AccessControl, ReentrancyGuard, Pausable {
    uint256 public nextCreditId = 0;
    uint256 public constant MAX_METADATA_LENGTH = 1000;

    enum CreditStatus {
        Pending,
        Verified,
        Rejected
    }

    struct Credit {
        uint256 id;
        address producer;
        uint256 amount;
        uint256 consumed;
        CreditStatus status;
        string metadata;
    }

    mapping(uint256 => Credit) private credits;
    mapping(address => uint256) private balances;
    mapping(address => bool) private verifiedConsumers;
    mapping(address => uint256[]) private consumerCredits;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant CONSUMER_ROLE = keccak256("CONSUMER_ROLE");

    // Events
    event CreditCreated(
        uint256 indexed id,
        address indexed producer,
        uint256 amount,
        string metadata
    );
    event CreditVerified(uint256 indexed id, address indexed verifier);
    event CreditRejected(uint256 indexed id, address indexed verifier);
    event CreditConsumed(
        uint256 indexed id,
        address indexed producer,
        address indexed consumer,
        uint256 amount
    );
    event ConsumerVerified(address indexed consumer, address indexed verifier);

    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(PRODUCER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(VERIFIER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(CONSUMER_ROLE, ADMIN_ROLE);
    }

    /// ADMIN FUNCTIONS
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function verifyConsumer(address consumer)
        external
        onlyRole(ADMIN_ROLE)
        whenNotPaused
    {
        require(consumer != address(0), "Invalid address");
        verifiedConsumers[consumer] = true;
        emit ConsumerVerified(consumer, msg.sender);
    }

    function addProducer(address account) external {
        grantRole(PRODUCER_ROLE, account);
    }

    function addVerifier(address account) external {
        grantRole(VERIFIER_ROLE, account);
    }

    function addConsumer(address account) external {
        grantRole(CONSUMER_ROLE, account);
    }

    /// ✅ Check roles
    function isProducer(address account) external view returns (bool) {
        return hasRole(PRODUCER_ROLE, account);
    }

    function isConsumer(address account) external view returns (bool) {
        return hasRole(CONSUMER_ROLE, account);
    }

    function isVerifier(address account) external view returns (bool) {
        return hasRole(VERIFIER_ROLE, account);
    }

    /// PRODUCER FUNCTION
    function createCredit(
        address producer,
        uint256 amount,
        string calldata metadata
    ) external onlyRole(PRODUCER_ROLE) whenNotPaused returns (uint256) {
        require(amount > 0, "Amount must be > 0");
        require(producer != address(0), "Invalid producer");
        require(
            bytes(metadata).length <= MAX_METADATA_LENGTH,
            "Metadata too long"
        );

        uint256 id = nextCreditId;
        nextCreditId++;

        credits[id] = Credit({
            id: id,
            producer: producer,
            amount: amount,
            consumed: 0,
            status: CreditStatus.Pending,
            metadata: metadata
        });

        emit CreditCreated(id, producer, amount, metadata);
        return id;
    }

    /// VERIFIER FUNCTION
    function verifyCredit(uint256 creditId, bool approve)
        external
        onlyRole(VERIFIER_ROLE)
        whenNotPaused
    {
        require(creditId < nextCreditId, "Invalid credit ID");
        Credit storage c = credits[creditId];
        require(c.status == CreditStatus.Pending, "Already finalized");

        if (approve) {
            c.status = CreditStatus.Verified;
            balances[c.producer] += c.amount;
            emit CreditVerified(creditId, msg.sender);
        } else {
            c.status = CreditStatus.Rejected;
            emit CreditRejected(creditId, msg.sender);
        }
    }

    /// CONSUMER FUNCTION
    function consumeCredit(
        uint256 creditId,
        uint256 amount,
        address consumer
    ) external onlyRole(CONSUMER_ROLE) nonReentrant whenNotPaused {
        require(creditId < nextCreditId, "Invalid credit ID");
        require(amount > 0, "Amount > 0");

        Credit storage c = credits[creditId];
        require(c.status == CreditStatus.Verified, "Not verified");
        require(c.consumed + amount <= c.amount, "Exceeds credit");
        require(
            balances[c.producer] >= amount,
            "Insufficient producer balance"
        );
        require(consumer != address(0), "Invalid consumer");
        require(verifiedConsumers[consumer], "Consumer not verified");

        balances[c.producer] -= amount;
        balances[consumer] += amount;
        c.consumed += amount;

        consumerCredits[consumer].push(creditId);
        emit CreditConsumed(creditId, c.producer, consumer, amount);
    }

    /// VIEW FUNCTIONS
    function getCredit(uint256 creditId)
        external
        view
        returns (
            uint256 id,
            address producer,
            uint256 amount,
            uint256 consumed,
            CreditStatus status,
            string memory metadata
        )
    {
        require(creditId < nextCreditId, "Invalid credit ID");
        Credit storage c = credits[creditId];
        return (c.id, c.producer, c.amount, c.consumed, c.status, c.metadata);
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    function isConsumerVerified(address consumer) external view returns (bool) {
        return verifiedConsumers[consumer];
    }

    function getCreditsByProducer(address producer)
        external
        view
        returns (Credit[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < nextCreditId; i++) {
            if (credits[i].producer == producer) {
                count++;
            }
        }
        Credit[] memory result = new Credit[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextCreditId; i++) {
            if (credits[i].producer == producer) {
                result[index] = credits[i];
                index++;
            }
        }
        return result;
    }

    function getCreditsByConsumer(address consumer)
        external
        view
        returns (Credit[] memory)
    {
        uint256[] storage ids = consumerCredits[consumer];
        Credit[] memory result = new Credit[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = credits[ids[i]];
        }
        return result;
    }
}