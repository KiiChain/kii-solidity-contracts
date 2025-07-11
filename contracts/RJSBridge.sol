// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RJSBridge is Ownable {
    IERC20 public token;
    mapping(address => uint256) public wrappedBalance;

    event Wrapped(address indexed user, uint256 amount);
    event Unwrapped(address indexed user, uint256 amount);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function wrap(uint256 amount) external {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        wrappedBalance[msg.sender] += amount;
        emit Wrapped(msg.sender, amount);
    }

    function unwrap(uint256 amount) external {
        require(wrappedBalance[msg.sender] >= amount, "Insufficient wrapped balance");
        wrappedBalance[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "Unwrap transfer failed");
        emit Unwrapped(msg.sender, amount);
    }
}

