// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RJSBridgeBNB is Ownable {
    event Locked(address token, uint256 amount, address recipient, string targetChain);
    event Unlocked(address token, uint256 amount, address recipient, string sourceChain);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function lock(address token, uint256 amount, address recipient, string memory targetChain) external {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit Locked(token, amount, recipient, targetChain);
    }

    function unlock(address token, uint256 amount, address recipient, string memory sourceChain) external onlyOwner {
        require(IERC20(token).transfer(recipient, amount), "Transfer failed");
        emit Unlocked(token, amount, recipient, sourceChain);
    }
}

