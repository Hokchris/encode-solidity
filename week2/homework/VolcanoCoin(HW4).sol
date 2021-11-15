// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract VolcanoCoin {
    uint totalSupply = 10000;
    address owner;
    
    mapping(address => uint) balance;
    mapping(address => Payment[]) payments;
    
    event SupplyChange(uint _newSupply);
    event Transfer(uint _amount, address _recipientAddress);
    
    struct Payment {
        uint amount;
        address recipientAddress;
    }
    
    constructor() {
        owner = msg.sender;
        balance[owner] = totalSupply;
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
    
    function getBalance(address _address) public view returns(uint) {
        return balance[_address];
    }
    
    function transfer(uint _amount, address _recipientAddress) public {
        require(
            _amount <= balance[msg.sender],    
            "Too little funds, cannot transfer."
        );
        
        balance[_recipientAddress] += _amount;
        balance[msg.sender] -= _amount;
        
        emit Transfer(_amount, _recipientAddress);
    }
    
    function getPayments(address _address) public view returns (Payment[] memory) {
        return payments[_address];
    }
    
    
}

