const Web3 = require("web3");
const nftAbi = require("./build/contracts/EncodeErc721.json");
const web3 = new Web3("http://127.0.0.1:8545");
const ownerPub = "0x536F8222C676b6566FF34E539022De6c1c22cc06";
const encodeNft = new web3.eth.contract(
  nftAbi.abi,
  "0xA97409103E409f93ecB7599C8d2f13a1845049EB"
);

async () => {
  const name = await encodeNft.methods.name().call();

  console.log(name);

  const balance = await encodeNft.methods.balanceOf(ownerPub).call();

  console.log(balance);
};
