// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AssetToken (RWA) for Kiichain
 * @dev ERC20 token with real-world asset metadata and mint/redeem functionality.
 */
contract AssetToken is ERC20, Ownable {
    string public assetType;
    string public issuer;
    string public region;

    constructor(
    string memory name_,
    string memory symbol_,
    string memory assetType_,
    string memory issuer_,
    string memory region_
) ERC20(name_, symbol_) Ownable(msg.sender) {
    assetType = assetType_;
    issuer = issuer_;
    region = region_;
}

    /**
     * @dev Mint new tokens to an address.
     * Only the contract owner can call this.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Redeem tokens by burning them from caller's balance.
     */
    function redeem(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Update asset metadata.
     */
    function updateMetadata(string memory newAssetType, string memory newIssuer, string memory newRegion) external onlyOwner {
        assetType = newAssetType;
        issuer = newIssuer;
        region = newRegion;
    }
}

