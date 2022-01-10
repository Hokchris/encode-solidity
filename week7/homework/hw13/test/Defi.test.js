require("dotenv").config();

const { expect, use } = require("chai");
const { ethers } = require("hardhat");

const { solidity } = require("ethereum-waffle");
use(solidity);

const DAIAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

const unlockedAddress = "0x503828976D22510aad0201ac7EC88293211D23Da";

describe("DeFi", () => {
  let owner;
  let DAI_TokenContract;
  let USDC_TokenContract;
  let DeFi_Instance;
  const TRANSFER_QUANTITY = 99999999900000;
  before(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

    // steps taken from https://stackoverflow.com/questions/67942401/how-to-connect-ethers-js-library-with-rinkeby-programmatically
    const provider = new ethers.providers.InfuraProvider(
      "rinkeby",
      process.env.INFURA_API_KEY
    );

    const wallet = new ethers.Wallet(
      "0x009a50b30b820d2567ebe89cde62b46922a692bdfde30473ca68bb8cab00ee8e",
      provider
    );

    const signer = wallet.connect(provider);

    // console.log(provider);
    // console.log(wallet);
    // console.log(signer);

    // ethers.getSigner not recognised as function?
    // const whale = await ethers.getSigner(
    //   "0x503828976D22510aad0201ac7EC88293211D23Da"
    // );

    // const test = await ethers.provider.getSigner(
    //   0x503828976d22510aad0201ac7ec88293211d23da
    // );

    // const b = await test.getBalance();

    console.log("owner account is ", owner.address);

    console.log(addr5);

    const bal = owner.getBalance();

    const ownerBalance = await owner.getBalance();
    console.log("FUNDS: ", ethers.utils.formatEther(ownerBalance));

    DAI_TokenContract = await ethers.getContractAt("ERC20", DAIAddress);
    USDC_TokenContract = await ethers.getContractAt("ERC20", USDCAddress);
    const symbol = await DAI_TokenContract.symbol();
    console.log("SYMBOL: ", symbol);

    const DeFi = await ethers.getContractFactory("DeFi");
    await DAI_TokenContract.transfer(owner.address, BigInt(TRANSFER_QUANTITY), {
      from: unlockedAddress,
      gasPrice: 0,
    });

    DeFi_Instance = await DeFi.deployed();

    const ownerBalance2 = await owner.getbalance();
    console.log("FUNDS: ", ethers.utils.formatEther(ownerBalance2));
  });

  it("should check transfer succeeded", async () => {});
  it("should sendDAI to contract", async () => {});
  it("should make a swap", async () => {});
});
