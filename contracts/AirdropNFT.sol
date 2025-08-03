// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract AirdropNFT is ERC721URIStorage {
    uint256 private _tokenId;

    // Mapping tokenId ke harga token
    mapping(uint256 => uint256) public tokenPrices;

    // Mapping pemilik ke daftar tokenId yang dimiliki
    mapping(address => uint256[]) private _ownedTokens;

    // Mapping tokenId ke kategori NFT
    mapping(uint256 => string[]) private categories;

    // ✅ Mapping untuk mengecek apakah token pernah dibuat
    mapping(uint256 => bool) private tokenExists;

    event TokenPurchased(address indexed buyer, uint256 indexed tokenId, uint256 price);

    constructor() ERC721("InkiiCollection", "InkiiNFTs") {}

    function CreateToken(
        string memory tokenURI,
        uint256 price,
        string[] memory _categories
    ) public returns (uint256) {
        require(bytes(tokenURI).length > 0, "Token URI must be provided");
        require(price > 0, "Price must be provided");

        _tokenId += 1;
        uint256 newTokenId = _tokenId;

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenExists[newTokenId] = true;

        _ownedTokens[msg.sender].push(newTokenId);
        categories[newTokenId] = _categories;
        setTokenPrice(newTokenId, price);

        // ✅ Catat bahwa token telah dibuat
        

        return newTokenId;
    }

    function setTokenPrice(uint256 tokenId, uint256 price) public {
        require(exists(tokenId), "Token does not exist");
        address owner = ownerOf(tokenId);
        require(msg.sender == owner, "Only the owner can set the price");
        tokenPrices[tokenId] = price;
    }

    function buyToken(uint256 tokenId) public payable {
        require(exists(tokenId), "Token does not exist");
        uint256 price = tokenPrices[tokenId];
        require(msg.value >= price, "Insufficient funds");

        address owner = ownerOf(tokenId);
        require(owner != msg.sender, "Owner cannot buy their own NFT");

        _removeOwnedToken(owner, tokenId);
        _transfer(owner, msg.sender, tokenId);

        payable(owner).transfer(price);

        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        _ownedTokens[msg.sender].push(tokenId);

        emit TokenPurchased(msg.sender, tokenId, price);
    }

    function tokensByAddress(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function getNFTCategories(uint256 tokenId) public view returns (string[] memory) {
        return categories[tokenId];
    }

    // ✅ Fungsi untuk cek eksistensi token (pengganti _exists)
    function exists(uint256 tokenId) public view returns (bool) {
        return tokenExists[tokenId];
    }

    function _removeOwnedToken(address owner, uint256 tokenId) private {
        uint256 length = _ownedTokens[owner].length;
        for (uint256 i = 0; i < length; i++) {
            if (_ownedTokens[owner][i] == tokenId) {
                _ownedTokens[owner][i] = _ownedTokens[owner][length - 1];
                _ownedTokens[owner].pop();
                break;
            }
        }
    }
}
