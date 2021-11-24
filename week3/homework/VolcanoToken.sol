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
    
    function mintToken(address _user) public {
        
        _safeMint(_user, tokenId);
        
        Metadata memory tokenMetadata = Metadata(
                {
                timestamp: block.timestamp,
                tokenId: tokenId,
                tokenURI: "testURI"
                }
            );
        
        tokenOwnership[_user].push(tokenMetadata);
        tokenId += 1;
        
    }
    
    function burnToken(uint _tokenId) public {
        require(msg.sender==owner(), "Only owner can burn their tokens.");
        removeToken(_tokenId);
        _burn(_tokenId);
    }
    
    function removeToken(uint _tokenId) internal {
        Metadata[] memory userTokens = tokenOwnership[msg.sender];
        
        for (uint i=0; i < userTokens.length; i++) {
            if (_tokenId == userTokens[i].tokenId) {
                delete userTokens[i];
            }
        }
    
    }
    
    function tokURI(uint _tokenId) public returns (string memory) {
        require(_exists(_tokenId), "Invalid token ID");
    }
    
}