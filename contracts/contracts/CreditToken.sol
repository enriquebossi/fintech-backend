// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title CreditToken - simple ERC20 used as credit tokens
contract CreditToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("CreditToken", "CRD") Ownable(initialOwner) {}

    /// @notice Mint tokens to an address
    /// @param to recipient address
    /// @param amount token amount (in wei)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
