// SPDX-License Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EncodeToken is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("EncodeToken", "ENC") {}

  mapping(address => uint256[]) internal nfts;

  function mintToken(address _tokenOwner, string memory _tokenURI) public returns (uint256) {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(_tokenOwner, newItemId);
    _setTokenURI(newItemId, _tokenURI);
    nfts[_tokenOwner].push(newItemId);
    return newItemId;
  }

  function getNfts(address _tokenOwner) public view returns (uint256[] memory) {
    return nfts[_tokenOwner];
  }

  function transferNft(address _oldOwner, address _newOwner, uint256 _index) public {
    safeTransferFrom(_oldOwner, _newOwner, _index);

    uint _newIndex = _index - 1;
    nfts[_newOwner].push(nfts[_oldOwner][_newIndex]);
    delete nfts[_oldOwner][_newIndex];
  }

}
