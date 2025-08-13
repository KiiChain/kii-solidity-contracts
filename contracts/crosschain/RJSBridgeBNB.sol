// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract RJSBridgeBNB is Ownable {
    using SafeERC20 for IERC20;

    event Locked(address token, uint256 amount, address recipient, string targetChain);
    event Unlocked(address token, uint256 amount, address recipient, string sourceChain);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function lock(address token, uint256 amount, address recipient, string calldata targetChain) external {
        require(token != address(0), "Zero token");
        require(recipient != address(0), "Zero recipient");
        require(amount > 0, "Zero amount");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit Locked(token, amount, recipient, targetChain);
    }

    function unlock(address token, uint256 amount, address recipient, string calldata sourceChain) external onlyOwner {
        require(token != address(0), "Zero token");
        require(recipient != address(0), "Zero recipient");
        require(amount > 0, "Zero amount");

        IERC20(token).safeTransfer(recipient, amount);
        emit Unlocked(token, amount, recipient, sourceChain);
    }
}

