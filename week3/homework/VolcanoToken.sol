// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract VolcanoToken is ERC721("VolcanoToken", "VOLT"), Ownable {
    
    uint256 private tokenId;
    
    struct Metadata {
        uint timestamp;
        uint tokenId;
        string tokenURI;
    }
    
    mapping(address => Metadata[]) public tokenOwnership;
    
    function mintToken(string memory _tokenURI) public {
        
        _safeMint(msg.sender, tokenId);
        
        Metadata memory tokenMetadata = Metadata(
                {
                timestamp: block.timestamp,
                tokenId: tokenId,
                tokenURI: _tokenURI
                }
            );
        
        tokenOwnership[msg.sender].push(tokenMetadata);
        tokenId += 1;
        
    }
    
    function burnToken(uint _tokenId) public {
        require(msg.sender==ownerOf(_tokenId), "Only owner can burn their tokens.");
        removeToken(_tokenId);
        _burn(_tokenId);
    }
    
    function removeToken(uint _tokenId) internal {
        Metadata[] memory userTokens = tokenOwnership[msg.sender];
        
        for (uint i=0; i < userTokens.length; i++) {
            if (_tokenId == userTokens[i].tokenId) {
                delete tokenOwnership[msg.sender][i];
            }
        }
    
    }
    
    function tokenURI(uint _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "Invalid token ID");
        return "a";
    }
    
    function test(address _addr) public view returns (Metadata[] memory) {
        return tokenOwnership[_addr];
    }
    
}