// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/// @title CheckpointNFT - ERC721 token with dynamic metadata
contract CheckpointNFT is ERC721URIStorage, Ownable {
    struct Meta {
        uint256 cycleId;
        string status;
    }

    mapping(uint256 => Meta) private _metadata;
    uint256 private _tokenIdCounter;

    constructor(address initialOwner) ERC721("CheckpointNFT", "CKPT") Ownable(initialOwner) {}

    /// @notice Mint a new NFT representing a cycle checkpoint
    /// @param to recipient address
    /// @param cycleId cycle identifier
    /// @param status description stored in metadata
    function mint(address to, uint256 cycleId, string memory status) external onlyOwner returns (uint256) {
        uint256 tokenId = ++_tokenIdCounter;
        _safeMint(to, tokenId);
        _metadata[tokenId] = Meta(cycleId, status);
        return tokenId;
    }

    /// @dev Generates token URI on the fly using Base64 encoded JSON
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721: invalid token");
        Meta memory m = _metadata[tokenId];
        string memory json = string(abi.encodePacked(
            '{"name":"Checkpoint ', Strings.toString(tokenId), '",',
            '"description":"Cycle ', Strings.toString(m.cycleId), ' status: ', m.status, '",' ,
            '"attributes":[{"trait_type":"cycleId","value":', Strings.toString(m.cycleId), '}]}'
        ));
        return string(abi.encodePacked('data:application/json;base64,', Base64.encode(bytes(json))));
    }
}
