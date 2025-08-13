// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RJSBridge is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public token;
    mapping(address => uint256) public wrappedBalance;

    event Wrapped(address indexed user, uint256 amount);
    event Unwrapped(address indexed user, uint256 amount);

    constructor(address tokenAddress) Ownable(msg.sender) {
        require(tokenAddress != address(0), "Token address cannot be zero");
        token = IERC20(tokenAddress);
    }

    function wrap(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        token.safeTransferFrom(msg.sender, address(this), amount);
        wrappedBalance[msg.sender] += amount;
        emit Wrapped(msg.sender, amount);
    }

    function unwrap(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(wrappedBalance[msg.sender] >= amount, "Insufficient wrapped balance");
        wrappedBalance[msg.sender] -= amount;
        token.safeTransfer(msg.sender, amount);
        emit Unwrapped(msg.sender, amount);
    }
}

