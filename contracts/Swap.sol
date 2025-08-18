// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Cosmos} from "./libraries/Cosmos.sol";

interface Bank {
    function send(
        address toAddress,
        Cosmos.Coin[] calldata amount
    ) external payable returns (bool);
    function getAllSpendableBalances(
        address accountAddress
    ) external view returns (Cosmos.Coin[] memory);
    function getBalance(
        address accountAddress,
        string calldata denom
    ) external view returns (uint256);
}

contract Swap {
    // pre-compiled cosmos bank module contract
    address public bankContractAddress =
        0x4381dC2aB14285160c808659aEe005D51255adD7;

    function buySkii() external payable {
        require(msg.value >= 1 ether, "Insufficient KII sent");

        // Calculate the amount of sKii tokens to transfer
        uint256 tokensToTransfer = (msg.value / 1 ether) * 1000000;

        // Ensure the contract has enough sKii tokens to transfer
        Bank bankContract = Bank(bankContractAddress);
        Cosmos.Coin[] memory availableBalance = bankContract
            .getAllSpendableBalances(address(this));
        require(
            availableBalance[0].amount >= tokensToTransfer,
            "Insufficient sKii tokens in contract"
        );

        // Transfer sKii tokens to the buyer
        Cosmos.Coin[] memory transferCoins = new Cosmos.Coin[](1);
        transferCoins[0] = (
            Cosmos.Coin(tokensToTransfer, availableBalance[0].denom)
        );

        bool success = bankContract.send(msg.sender, transferCoins);
        require(success, "Failed to buy sKii");
    }

    function sellSkii(uint256 amount) external {
        Bank bankContract = Bank(bankContractAddress);
        Cosmos.Coin[] memory availableBalance = bankContract
            .getAllSpendableBalances(address(this));
        uint256 userBalance = bankContract.getBalance(
            msg.sender,
            availableBalance[0].denom
        );

        // Ensure the sender has enough sKii tokens to sell
        require(userBalance >= amount * 1000000, "Insufficient sKii tokens");

        // Calculate the amount of ether to transfer
        uint256 etherAmount = amount * 1 ether;

        // Transfer ether to the seller
        payable(msg.sender).transfer(etherAmount);
    }
}
