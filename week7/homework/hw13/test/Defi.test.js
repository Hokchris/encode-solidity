const { expect, use } = require("chai");
const { ethers } = require("hardhat");

const { solidity } = require("ethereum-waffle");
use(solidity);

const DAIAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const AAVEAddress = "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9";
const UNIAddress = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";

const unlockedAddress = "0x503828976D22510aad0201ac7EC88293211D23Da";

describe("DeFi", () => {
  let owner;
  let DAI_TokenContract;
  let USDC_TokenContract;
  let AAVE_TokenContract;
  let UNI_TokenContract;
  let DeFi_Instance;
  const INITIAL_AMOUNT = 99999999900000;
  before(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

    const whale = await ethers.getSigner(unlockedAddress);

    console.log("owner account is ", owner.address);

    DAI_TokenContract = await ethers.getContractAt("ERC20", DAIAddress);
    USDC_TokenContract = await ethers.getContractAt("ERC20", USDCAddress);
    AAVE_TokenContract = await ethers.getContractAt("ERC20", AAVEAddress);
    UNI_TokenContract = await ethers.getContractAt("ERC20", UNIAddress);

    const symbol = await DAI_TokenContract.symbol();
    console.log("SYMBOL: ", symbol);

    const DeFi = await ethers.getContractFactory("DeFi");
    await DAI_TokenContract.connect(whale).transfer(
      owner.address,
      BigInt(INITIAL_AMOUNT * 5)
    );

    DeFi_Instance = await DeFi.deploy();
  });

  it("should check transfer succeeded", async () => {
    let daiBalance = await DAI_TokenContract.balanceOf(owner.address);
    expect(daiBalance > 0);
  });
  it("should sendDAI to contract", async () => {
    await DAI_TokenContract.transfer(
      DeFi_Instance.address,
      BigInt(INITIAL_AMOUNT),
      {
        from: owner.address,
        gasPrice: 0,
      }
    );

    const daiBalance = await DAI_TokenContract.balanceOf(DeFi_Instance.address);
    expect(daiBalance.toNumber() > 0);
  });
  it("should make a swap", async () => {
    await DeFi_Instance.swapDAItoUSDC(9999999990000, {
      from: owner.address,
      gasPrice: 0,
    });

    let usdcBalance = await USDC_TokenContract.balanceOf(owner.address);
    expect(usdcBalance.toNumber() > 0);
  });

  it("should swap DAI to AAVE", async () => {
    const aaveBalanceBefore = await AAVE_TokenContract.balanceOf(owner.address);
    let sendDAI = await DAI_TokenContract.connect(owner).transfer(
      DeFi_Instance.address,
      INITIAL_AMOUNT
    );
    await sendDAI.wait();

    let swapDAItoAAVE = await DeFi_Instance.connect(owner).swapTokens(
      DAI_TokenContract.address,
      AAVE_TokenContract.address,
      INITIAL_AMOUNT
    );
    await swapDAItoAAVE.wait();

    let aaveBalanceAfter = await AAVE_TokenContract.balanceOf(owner.address);
    expect(aaveBalanceAfter - aaveBalanceBefore).to.be.above(0);
  });

  it("should swap DAI to UNI", async () => {
    let uniBalanceBefore = await UNI_TokenContract.balanceOf(owner.address);
    let sendDAI = await DAI_TokenContract.connect(owner).transfer(
      DeFi_Instance.address,
      INITIAL_AMOUNT
    );
    await sendDAI.wait();

    let swapDAItoUNI = await DeFi_Instance.connect(owner).swapTokens(
      DAI_TokenContract.address,
      UNI_TokenContract.address,
      INITIAL_AMOUNT
    );
    await swapDAItoUNI.wait();

    let uniBalanceAfter = await UNI_TokenContract.balanceOf(owner.address);
    expect(uniBalanceAfter - uniBalanceBefore).to.be.above(0);
  });
});
