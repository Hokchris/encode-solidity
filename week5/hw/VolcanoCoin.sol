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
  
//   function getPayments(address _address) public view returns(Payment[] memory) {
//     return payments[_address];
//   }

  function viewPaymentDetails() public view returns (Payment[] memory) {
    return payments[msg.sender];
  }

  event SinglePayment(Payment payment);
  function viewPaymentDetailsReadable() public {
    Payment[] memory allPayments = payments[msg.sender];
    
    require(allPayments.length > 0, "No payments to show.");
    for (uint i=0; i < allPayments.length; i++) {
      Payment memory currPayment = allPayments[i];
      emit SinglePayment(currPayment);
    }
  }

  event PaymentUpdated(Payment updated);
  function updatePayment(
    uint _paymentId, 
    PaymentType _newPaymentType, 
    bytes32 _newComment
  ) public view {
    Payment[] memory userPayments = payments[msg.sender];
    require(userPayments.length > 0, "No payments to update.");

    for (uint i=0; i < userPayments; i++) {
      Payment memory currPayment = userPayments[i];
      if (currPayment.identifier == _paymentId) {
        currPayment.paymentType = _newPaymentType;
        currPayment.comment = _newComment;

        emit PaymentUpdated(currPayment);
        break;
      }
    }
  }


  // 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

  // 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
  // 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db

}
