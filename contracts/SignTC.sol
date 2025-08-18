// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SignTC is Ownable {
    struct UserSignInfo {
        string userName;
        string email;
        string signDate;
    }

    mapping(string => UserSignInfo) private signedUsers;

    event TCSigned(string indexed username, string email, string signDate);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function signTC(
        string memory username,
        string memory email,
        string memory signDate
    ) public onlyOwner {
        require(bytes(username).length > 0, "Username cannot be empty");
        require(bytes(email).length > 0, "Email cannot be empty");
        require(bytes(signDate).length > 0, "Sign Date cannot be empty");

        // Validate whether user already signed
        require(
            bytes(signedUsers[username].userName).length == 0,
            "User already signed T&C"
        );

        // Create the UserSignInfo struct
        signedUsers[username] = UserSignInfo(username, email, signDate);

        // Emit an event to log the signing action
        emit TCSigned(username, email, signDate);
    }

    // Function to retrieve user info by their username
    function getUserSignInfo(
        string memory username
    ) public view returns (string memory, string memory, string memory) {
        require(bytes(username).length > 0, "Username cannot be empty");

        UserSignInfo memory userInfo = signedUsers[username];

        // Check if user exists (name should not be empty)
        require(bytes(userInfo.userName).length > 0, "User not found");

        return (userInfo.userName, userInfo.email, userInfo.signDate);
    }
}
