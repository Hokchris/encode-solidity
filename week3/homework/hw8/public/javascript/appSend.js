const Web3 = require("web3");
const nftAbi = require("./build/contracts/EncodeErc721.json");
const web3 = new Web3("http://127.0.0.1:8545");
const ownerPub = "0x536F8222C676b6566FF34E539022De6c1c22cc06";

web3.eth.accounts.wallet.add({
  privateKey: "4e05f623e5e7a057db5b80d8f3ae73f9efac3595ae02efca0df1f0e25222439b";
  address: ownerPub
});

const encodeNft = new web3.eth.Contract(nftAbi.abi, "0xA97409103E409f93ecB7599C8d2f13a1845049EB");

(async () => {
  const mint = await encodeNft.methods
    .mintToken(ownerPub, "abc.com")
    .send({ from: ownerPub, gas: 500000 });

  console.log(mint);
})