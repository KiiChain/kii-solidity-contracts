// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Import ERC20 implementation
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// ERC20 Smart contract
contract OroToken is ERC20, Ownable {
    uint constant _decimals = 1 * (1 ** 18);
    uint constant _initial_suply = 100_000_000 * (10 ** 18);
    uint public oroConvetionRate = 15_000_000_000; // 1 ORO = 15.000M ukii

    address public pointerContract; // Address of the Pointer Contract

    constructor(
        address initialOwner
    ) ERC20("oro", "ORO") Ownable(initialOwner) {
        _mint(address(this), _initial_suply);
    }

    // Overwrite transfer function to allow owner and pointer contract
    function transfer(
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        require(
            msg.sender == owner() || msg.sender == pointerContract,
            "Only owner or pointer contract can transfer tokens"
        );
        return super.transfer(recipient, amount);
    }

    // Function to set the Pointer Contract address
    function setPointerContract(address _pointerContract) external onlyOwner {
        require(_pointerContract != address(0), "Invalid pointer address");
        pointerContract = _pointerContract;
    }

    // Mint oro with Kii into the contract balance
    function mint(uint256 oroAmount) public onlyOwner {
        // Calculate how many Kii I need to mint
        uint256 requiredKii = oroAmount * oroConvetionRate;
        require(
            address(this).balance >= requiredKii,
            "Not enough kii in contract to mint oro"
        );

        // Spend the Kii
        payable(address(0)).transfer(requiredKii);

        // Mint tokens
        _mint(address(this), oroAmount);
    }

    // Transfer oro tokens from contract to a recipient
    function transferFromContract(
        address recipient,
        uint256 amount
    ) external onlyOwner {
        require(
            balanceOf(address(this)) >= amount,
            "Not enough tokens in contract"
        );
        _transfer(address(this), recipient, amount);
    }

    // Swap oro by Kii in a specific wallet
    function withdrawal(uint256 oroAmount, address wallet) external {
        require(balanceOf(msg.sender) >= oroAmount, "Insufficient oro balance");

        // Calculate Kii to send
        uint256 kiiAmount = oroAmount * oroConvetionRate;
        require(
            address(this).balance >= kiiAmount,
            "Contract has insufficient KII to withdrawal"
        );

        // Receive sender's oro
        _transfer(msg.sender, address(this), oroAmount);

        // Send Kii from the contract to the sender
        payable(wallet).transfer(kiiAmount);
    }

    // Edit the conversion ratio
    function editConvetionRate(uint ratio) public onlyOwner returns (bool) {
        require(ratio > 0, "You must provide a valid conversion ratio");
        oroConvetionRate = ratio;
        return true;
    }

    // Allow the contract to Receive Kii from any wallet
    receive() external payable {}
}
