// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lock {
    address public owner;

    event Withdraw(address indexed to, uint256 amount);

    constructor() payable {
        owner = msg.sender;
    }

    function withdraw(uint256 amount) public {
        require(msg.sender == owner, "Not the owner");
        require(amount <= address(this).balance, "Insufficient balance");

        payable(owner).transfer(amount);

        emit Withdraw(owner, amount);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
