// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RJSBridgeSepolia is Ownable {
    using SafeERC20 for IERC20;
    IERC20 public immutable token;

    event Locked(address indexed user, uint256 amount, string targetChain, address targetAddress);
    event Unlocked(address indexed user, uint256 amount);

    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        require(tokenAddress != address(0), "Zero token");
        token = IERC20(tokenAddress);
    }

    function lock(uint256 amount, string calldata targetChain, address targetAddress) external {
        require(amount > 0, "Zero amount");
        require(bytes(targetChain).length > 0, "Empty chain");
        require(targetAddress != address(0), "Zero target");

        token.safeTransferFrom(msg.sender, address(this), amount);
        emit Locked(msg.sender, amount, targetChain, targetAddress);
    }

    function unlock(address user, uint256 amount) external onlyOwner {
        require(user != address(0), "Zero user");
        require(amount > 0, "Zero amount");

        token.safeTransfer(user, amount);
        emit Unlocked(user, amount);
    }
}

