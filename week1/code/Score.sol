// SPDX-License-Identifier: UNLICENSED

// Character in front of version can be: ">", "<", "^" or none
pragma solidity ^0.8.0;

contract Score {
    
    uint score;
    address owner;
    
    event NewScore(uint _newScore);
    
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender == owner) {
            _;
        }
    }

    // first keyword after function definition: "public", "internal", "external", "private"
    // second keyword after function definition: "view", "pure"
    function getScore() public view returns (uint) {
        return score;
    }
    
    function setScore(uint _newScore) public onlyOwner {
        score = _newScore;
        
        emit NewScore(score);
    }
    
}

