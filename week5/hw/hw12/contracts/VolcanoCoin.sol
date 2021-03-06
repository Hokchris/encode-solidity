// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract VolcanoCoin is ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
  uint256 public constant CONTRACT_VERSION = 1;
  uint256 private currentId;
  address private adminAddress;
  bool private initialized;

  event SupplyChange(uint _newSupply);
  mapping(address => Payment[]) public payments; 

  enum PaymentType{UNKNOWN, BASIC, REFUND, DIVIDEND, GROUP}  

  struct Payment {
    uint amount;
    address recipientAddress;
    uint256 identifier;
    uint256 timestamp;
    PaymentType paymentType;
    string comment;
  }
  
  modifier onlyAdmin {
    if (msg.sender == adminAddress) {
        _;
    }
  }

  function initialize() public initializer  {
    require(!initialized, "Contract already initialized");
    initialized = true;
    __ERC20_init("VolcanoCoin", "VLC");
    __Ownable_init();
    __UUPSUpgradeable_init();
    _mint(msg.sender, 10000);
    adminAddress = msg.sender;
  }
  
  function _authorizeUpgrade(address _newImplementation) onlyOwner internal override {}

  // function addToSupply(uint _amount) public onlyOwner {
  //   _mint(msg.sender, _amount);
  //   tokenSupply += _amount;
  //   emit SupplyChange(tokenSupply);
  // }
  
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
  
  function viewPaymentDetails() public view returns (Payment[] memory) {
    return payments[msg.sender];
  }

  event SinglePayment(Payment payment);
  function viewPaymentDetailsReadable(address _userAddress) public {
    Payment[] memory allPayments = payments[_userAddress];
    
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
    string memory _newComment
  ) public {
    require(currentId > _paymentId, "Invalid payment ID.");
    require((uint(_newPaymentType) >= 0) && (uint(_newPaymentType) < 5),  
      "Wrong payment type range, please choose value between 0 and 4.");  // enum values cast to integers when inputting

    payments[msg.sender][_paymentId].paymentType = _newPaymentType;
    payments[msg.sender][_paymentId].comment = _newComment;

    emit PaymentUpdated(payments[msg.sender][_paymentId]);
  }

  event Test(Payment payment);
  function adminUpdatePayment(
      address _userAddress,
      uint _paymentId,
      PaymentType _newPaymentType
  ) public onlyAdmin {

    require(currentId > _paymentId, "Invalid payment ID.");
    require((uint(_newPaymentType) >= 0) && (uint(_newPaymentType) < 5),  
        "Wrong payment type range, please choose value between 0 and 4.");

    payments[_userAddress][_paymentId].paymentType = _newPaymentType;
    payments[_userAddress][_paymentId].comment = string(
        abi.encodePacked(
            payments[_userAddress][_paymentId].comment, 
            " updated by 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
        )
    );

  }

}
