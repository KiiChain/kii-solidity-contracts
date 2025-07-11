// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RJSBridgeSepolia is Ownable {
    IERC20 public token;

    event Locked(address indexed user, uint256 amount, string targetChain, address targetAddress);
    event Unlocked(address indexed user, uint256 amount);

    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        token = IERC20(tokenAddress);
    }

    function lock(uint256 amount, string calldata targetChain, address targetAddress) external {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit Locked(msg.sender, amount, targetChain, targetAddress);
    }

    function unlock(address user, uint256 amount) external onlyOwner {
        require(token.transfer(user, amount), "Transfer failed");
        emit Unlocked(user, amount);
    }
}

