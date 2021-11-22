// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VolcanoCoin is ERC20, Ownable {
    
    string private TOK_NAME = "VolcanoCoin";
    string private TOK_SYMBOL = "VOLC";
    uint private tokenSupply = 10000;
    
    event SupplyChange(uint _newSupply);
    
    mapping(address => Payment[]) public payments;
    
    struct Payment {
        uint amount;
        address recipientAddress;
    }
    
    constructor() ERC20(TOK_NAME, TOK_SYMBOL) {
        _mint(msg.sender, tokenSupply);
    }
    
    function addToSupply(uint _amount) public onlyOwner {
        _mint(msg.sender, _amount);
        tokenSupply += _amount;
        emit SupplyChange(tokenSupply);
    }
    
    function getSupply() public view returns(uint) {
        return tokenSupply;
    }
    
    function makeTransfer(address _sender, address _receiver, uint _amount) public {
        require(msg.sender == _sender);
        require(balanceOf(msg.sender) >= _amount, "Not enough funds.");
        
        transfer(_receiver, _amount);
        Payment memory _rec = Payment({amount: _amount, recipientAddress: _receiver});
        payments[msg.sender].push(_rec); 

    }
    
    function getPayments(address _address) public view returns(Payment[] memory) {
        return payments[_address];
    }

}
