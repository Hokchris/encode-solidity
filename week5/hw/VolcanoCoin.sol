// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VolcanoCoin is ERC20("VolcanoCoin", "VLC"), Ownable {
    
  uint private tokenSupply = 10000;
  uint private currentId = 1;
  
  event SupplyChange(uint _newSupply);
  mapping(address => Payment[]) public payments;

  enum PaymentType{UNKNOWN, BASIC, REFUND, DIVIDEND, GROUP}  

  struct Payment {
    uint amount;
    address recipientAddress;
    uint identifier;
    uint256 timestamp;
    PaymentType paymentType;
    bytes32 comment;
  }
  
  constructor() {
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
    Payment memory _rec = Payment(
      {
        amount: _amount, 
        recipientAddress: _receiver,
        identifier: currentId,
        timestamp: block.timestamp,
        paymentType: PaymentType.UNKNOWN,
        comment: ""
      });
    
    currentId++;
    payments[msg.sender].push(_rec); 

  }
  
  function getPayments(address _address) public view returns(Payment[] memory) {
    return payments[_address];
  }

  function viewPaymentDetails() public view returns (Payment[] memory) {
    return payments[msg.sender];
  }

}
