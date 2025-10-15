// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NFTRegistration
 * @dev Contract for managing NFT airdrop registrations with dynamic pricing
 * Users pay an increasing amount of ERC20 tokens (ORO) to register for the airdrop
 */
contract NFTRegistration is Ownable, Pausable, ReentrancyGuard {
    /**
     * @dev The ERC20 token (ORO) used for registration payments
     */
    IERC20 public immutable oroToken;

    /**
     * @dev The initial registration price in ORO tokens (with decimals)
     */
    uint256 public immutable initialPrice;

    /**
     * @dev The percentage increase per registration (in basis points, e.g., 500 = 5%)
     */
    uint256 public immutable priceIncreasePercentage;

    /**
     * @dev The timestamp when registration starts
     */
    uint256 public immutable startDate;

    /**
     * @dev The maximum number of registration spots available
     */
    uint256 public maxSpots;

    /**
     * @dev The current price for registration in ORO tokens
     * Updated after each successful registration
     */
    uint256 public currentPrice;

    /**
     * @dev Array of addresses that have registered
     */
    address[] private registrants;

    /**
     * @dev Mapping to track if an address has registered
     */
    mapping(address => bool) private registered;

    /**
     * @dev Emitted when a user successfully registers
     * @param user The address of the registered user
     * @param spotNumber The spot number assigned (1-indexed)
     * @param pricePaid The amount of ORO tokens paid
     */
    event Registered(
        address indexed user,
        uint256 spotNumber,
        uint256 pricePaid
    );

    /**
     * @dev Emitted when the owner withdraws ORO tokens
     * @param owner The address of the owner
     * @param amount The amount of ORO tokens withdrawn
     */
    event Withdrawn(address indexed owner, uint256 amount);

    /**
     * @dev Emitted when the owner changes the maximum number of spots
     * @param oldMaxSpots The previous maximum number of spots
     * @param newMaxSpots The new maximum number of spots
     */
    event MaxSpotsChanged(uint256 oldMaxSpots, uint256 newMaxSpots);

    /**
     * @dev Error thrown when registration has not started yet
     */
    error RegistrationNotStarted();

    /**
     * @dev Error thrown when all registration spots are taken
     */
    error NoSpotsAvailable();

    /**
     * @dev Error thrown when a user tries to register twice
     */
    error AlreadyRegistered();

    /**
     * @dev Error thrown when token transfer fails
     */
    error TransferFailed();

    /**
     * @dev Error thrown when there are no funds to withdraw
     */
    error NoFundsToWithdraw();

    /**
     * @dev Error thrown when trying to set maxSpots to an invalid value
     */
    error InvalidMaxSpots();

    /**
     * @dev Constructor to initialize the registration contract
     * @param _oroTokenAddress The address of the ORO ERC20 token
     * @param _initialPrice The initial registration price in ORO tokens
     * @param _priceIncreasePercentage The percentage increase per registration (in basis points)
     * @param _startDate The timestamp when registration opens
     * @param _maxSpots The maximum number of registration spots
     */
    constructor(
        address _oroTokenAddress,
        uint256 _initialPrice,
        uint256 _priceIncreasePercentage,
        uint256 _startDate,
        uint256 _maxSpots
    ) Ownable(msg.sender) {
        require(_oroTokenAddress != address(0), "Invalid token address");
        require(_initialPrice > 0, "Initial price must be greater than 0");
        require(_maxSpots > 0, "Max spots must be greater than 0");

        oroToken = IERC20(_oroTokenAddress);
        initialPrice = _initialPrice;
        currentPrice = _initialPrice;
        priceIncreasePercentage = _priceIncreasePercentage;
        startDate = _startDate;
        maxSpots = _maxSpots;
    }

    /**
     * @dev Registers the caller for the NFT airdrop
     * Requires payment of the current registration price in ORO tokens
     * Can only be called when not paused, after start date, and when spots are available
     */
    function register() external whenNotPaused nonReentrant {
        if (block.timestamp < startDate) {
            revert RegistrationNotStarted();
        }

        if (registrants.length >= maxSpots) {
            revert NoSpotsAvailable();
        }

        if (registered[msg.sender]) {
            revert AlreadyRegistered();
        }

        uint256 price = currentPrice;

        // Transfer ORO tokens from user to contract
        bool success = oroToken.transferFrom(msg.sender, address(this), price);
        if (!success) {
            revert TransferFailed();
        }

        // Add user to registrants list
        registrants.push(msg.sender);
        registered[msg.sender] = true;

        emit Registered(msg.sender, registrants.length, price);

        // Update price for next registration
        // currentPrice = currentPrice * (1 + priceIncreasePercentage/10000)
        currentPrice =
            (currentPrice * (10000 + priceIncreasePercentage)) /
            10000;
    }

    /**
     * @dev Checks if an address has registered
     * @param user The address to check
     * @return True if the address has registered, false otherwise
     */
    function hasRegistered(address user) external view returns (bool) {
        return registered[user];
    }

    /**
     * @dev Returns the total number of registrants
     * @return The count of registered users
     */
    function count() external view returns (uint256) {
        return registrants.length;
    }

    /**
     * @dev Checks if there are remaining registration spots available
     * @return True if spots remain, false if all spots are taken
     */
    function hasRemainingSpots() external view returns (bool) {
        return registrants.length < maxSpots;
    }

    /**
     * @dev Returns the number of remaining registration spots
     * @return The number of spots still available
     */
    function remainingSpots() external view returns (uint256) {
        if (registrants.length >= maxSpots) {
            return 0;
        }
        return maxSpots - registrants.length;
    }

    /**
     * @dev Returns the list of all registered addresses
     * @return Array of addresses that have registered
     */
    function getRegistrants() external view returns (address[] memory) {
        return registrants;
    }

    /**
     * @dev Allows the owner to withdraw all ORO tokens from the contract
     * Can only be called by the contract owner
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = oroToken.balanceOf(address(this));

        if (balance == 0) {
            revert NoFundsToWithdraw();
        }

        bool allowanceApproved = oroToken.approve(address(this), balance);
        if (!allowanceApproved) {
            revert TransferFailed();
        }

        bool success = oroToken.transferFrom(address(this), owner(), balance);
        if (!success) {
            revert TransferFailed();
        }

        emit Withdrawn(owner(), balance);
    }

    /**
     * @dev Allows the owner to withdraw a specific amount of ORO tokens
     * @param amount The amount of ORO tokens to withdraw
     * Can only be called by the contract owner
     */
    function withdrawAmount(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(
            oroToken.balanceOf(address(this)) >= amount,
            "Insufficient balance"
        );

        bool allowanceApproved = oroToken.approve(address(this), amount);
        if (!allowanceApproved) {
            revert TransferFailed();
        }

        bool success = oroToken.transferFrom(address(this), owner(), amount);
        if (!success) {
            revert TransferFailed();
        }

        emit Withdrawn(owner(), amount);
    }

    /**
     * @dev Pauses the contract, preventing new registrations
     * Can only be called by the contract owner
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract, allowing registrations to resume
     * Can only be called by the contract owner
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Allows the owner to change the maximum number of registration spots
     * @param _newMaxSpots The new maximum number of spots
     * Can only be called by the contract owner
     * New max spots must be greater than 0 and greater than or equal to current registrants
     */
    function setMaxSpots(uint256 _newMaxSpots) external onlyOwner {
        if (_newMaxSpots == 0 || _newMaxSpots < registrants.length) {
            revert InvalidMaxSpots();
        }

        uint256 oldMaxSpots = maxSpots;
        maxSpots = _newMaxSpots;

        emit MaxSpotsChanged(oldMaxSpots, _newMaxSpots);
    }

    /**
     * @dev Returns the contract's current ORO token balance
     * @return The balance of ORO tokens held by the contract
     */
    function getContractBalance() external view returns (uint256) {
        return oroToken.balanceOf(address(this));
    }
}
