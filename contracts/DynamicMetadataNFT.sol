// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DynamicMetadataNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    constructor(address initialOwner) ERC721("Checkpoint NFT", "CPNFT") Ownable(initialOwner) {}

    function mintWithURI(address to, string memory uri) external onlyOwner returns (uint256) {
        uint256 tokenId = ++tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function updateTokenURI(uint256 tokenId, string memory uri) external onlyOwner {
        _setTokenURI(tokenId, uri);
    }
}
