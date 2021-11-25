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
        uint numTokens = tokenOwnership[msg.sender].length;
        
        for (uint i=0; i < numTokens; i++) {
            if (_tokenId == tokenOwnership[msg.sender][i].tokenId) {
                // delete tokenOwnership[msg.sender][i];  // delete seems to set all values to default, ie uints -> 0 etc.
                
                // if token to remove is not last in struct array, set it to have value of last item in array
                if (i != numTokens - 1) {
                    tokenOwnership[msg.sender][i] = tokenOwnership[msg.sender][numTokens - 1];
                }
                
                tokenOwnership[msg.sender].pop();
                break;
            }
        }
    }
    
    function tokenURI(uint _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "Invalid token ID");
        Metadata[] memory userTokens = tokenOwnership[ownerOf(_tokenId)];
        
        for (uint i=0; i < userTokens.length; i++) {
            if (_tokenId == userTokens[i].tokenId) {
                return userTokens[i].tokenURI;
            }
        }
    }
    
    function userTokenOwnerships(address _address) public view returns (Metadata[] memory) {
        return tokenOwnership[_address];
    }
    
}