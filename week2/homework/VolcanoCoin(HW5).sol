// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VolcanoCoin is ERC20, Ownable {
    
    uint tokenSupply = 10000;
    
    mapping(address => Payment[]) payments;
    
    struct Payment {
        uint amount;
        address recipientAddress;
    }
    
    constructor(string memory _tokenName, string memory _symbol) ERC20(_tokenName, _symbol) {
        _mint(msg.sender, tokenSupply);
    }
    
    function giveToOwner(uint _amount) public onlyOwner {
        _mint(owner(), _amount);    
    }
    
    function getSupply() public view returns(uint) {
        return tokenSupply;
    }
    
    // function getPayments(address _address) public view returns (Payment[] memory) {
    //     return payments[_address];
    // }

}

