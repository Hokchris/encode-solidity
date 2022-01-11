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

    // didn't work when running on terminal on own PC but worked with gitpod (??)
    const whale = await ethers.getSigner(unlockedAddress);

    console.log("owner account is ", owner.address);

    DAI_TokenContract = await ethers.getContractAt("ERC20", DAIAddress);
    USDC_TokenContract = await ethers.getContractAt("ERC20", USDCAddress);
    const symbol = await DAI_TokenContract.symbol();
    console.log("SYMBOL: ", symbol);

    const DeFi = await ethers.getContractFactory("DeFi");
    await DAI_TokenContract.connect(whale).transfer(
      owner.address,
      BigInt(TRANSFER_QUANTITY)
    );

    DeFi_Instance = await DeFi.deploy();
  });

  it("should check transfer succeeded", async () => {});
  it("should sendDAI to contract", async () => {});
  it("should make a swap", async () => {});
});
