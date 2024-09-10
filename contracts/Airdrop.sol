// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PreSigningData {
    uint256 constant TOKEN_AMOUNT = 1_000_000_000_000_000_000; // 1 Kii

    struct UserData {
        bool agreeTnC;
        string shipName;
        address walletAddress;
        string referralCode;
        bool redempted;
    }

    mapping(address => UserData) private userRecords;
    mapping(string => address) private userReferrarCodes;

    event UserRegistered(
        address indexed user,
        bool agreeTnC,
        string shipName,
        address walletAddress,
        string referralCode
    );

    function registerUser(
        bool _agreeTnC,
        string memory _shipName,
        address _address,
        string memory _referralCode
    ) public {
        require(bytes(_shipName).length > 0, "Ship name cannot be empty.");
        require(
            userRecords[_address].walletAddress == address(0),
            "This wallet is already registered."
        );
        require(
            userReferrarCodes[_referralCode] == address(0),
            "Referral code already in use."
        );

        // Save user data into the mapping
        userRecords[_address] = UserData({
            agreeTnC: _agreeTnC,
            shipName: _shipName,
            walletAddress: _address,
            referralCode: _referralCode,
            redempted: false
        });

        // Associate the referrarCode with the address
        userReferrarCodes[_referralCode] = _address;

        emit UserRegistered(
            _address,
            _agreeTnC,
            _shipName,
            _address,
            _referralCode
        );
    }

    function getUserData(
        address _user
    ) public view returns (bool, string memory, address, string memory, bool) {
        UserData memory userData = userRecords[_user];
        return (
            userData.agreeTnC,
            userData.shipName,
            userData.walletAddress,
            userData.referralCode,
            userData.redempted
        );
    }

    function redeemReward(string memory referralCode) external {
        // Validate referral code
        address userAddress = userReferrarCodes[referralCode];
        require(userAddress != address(0), "Referral Code does not exist");

        // Validate User
        UserData storage user = userRecords[userAddress];
        require(user.redempted == false, "User already redempted reward");
        require(
            address(this).balance >= TOKEN_AMOUNT,
            "The contract doesn't have enought balance for redeem"
        );

        // Update user's conditions
        user.redempted = true;
        userRecords[userAddress] = user;

        // Send Token
        payable(user.walletAddress).transfer(TOKEN_AMOUNT);
    }

    // Allow the contract receive founds
    receive() external payable {}
}
