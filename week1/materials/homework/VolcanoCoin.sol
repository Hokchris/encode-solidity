// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract VolcanoCoin {
    uint totalSupply = 10000;
    address owner;
    
    event SupplyChange(uint _newSupply);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        if (msg.sender == owner) {
            _;
        }
    }
    
    function getSupply() public view returns(uint) {
        return totalSupply;
    }
    
    function addToSupply() public onlyOwner {
        totalSupply += 1000;
        emit SupplyChange(totalSupply);
    }
    
}

