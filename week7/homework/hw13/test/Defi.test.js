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
      BigInt(INITIAL_AMOUNT * 2)
    );

    DeFi_Instance = await DeFi.deploy();
  });

  it("should check transfer succeeded", async () => {
    let daiBalance = await DAI_TokenContract.balanceOf(owner.address);
    // let daiBalanceCoinbase = await DAI_TokenContract.balanceOf(unlockedAddress);

    // console.log("DeFi contract DAI balance: ", ethers.utils.formatUnits(daiBalance, 18));
    // console.log("Coinbase contract DAI balance: ", ethers.utils.formatUnits(daiBalanceCoinbase, 18));

    expect(daiBalance > 0);
  });
  it("should sendDAI to contract", async () => {
    // let daiBalanceBefore = await DAI_TokenContract.balanceOf(owner.address);

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
    /**
    let daiBalanceAfter = await DAI_TokenContract.balanceOf(owner.address);

    console.log("Before: ", ethers.utils.formatUnits(daiBalanceBefore, 18));
    console.log("After: ", ethers.utils.formatUnits(daiBalanceAfter, 18));
    
    let diff =  daiBalanceBefore - daiBalanceAfter;
    
    console.log(INITIAL_AMOUNT, " -> ", diff);

    expect(diff == INITIAL_AMOUNT);
    */
  });
  it("should make a swap", async () => {
    // let usdcBalance = await USDC_TokenContract.balanceOf(owner.address);
    // let daiBalance = await DAI_TokenContract.balanceOf(DeFi_Instance.address);

    // console.log("USDC: ", usdcBalance);
    // console.log("DAI: ", daiBalance);

    await DeFi_Instance.swapDAItoUSDC(9999999990000, {
      from: owner.address,
      gasPrice: 0,
    });

    let usdcBalance2 = await USDC_TokenContract.balanceOf(owner.address);
    // let daiBalance2 = await DAI_TokenContract.balanceOf(DeFi_Instance.address);

    // console.log("USDC: ", usdcBalance2);
    // console.log("DAI: ", daiBalance2);

    expect(usdcBalance2.toNumber() > 0);
  });

  it("should swap DAI to AAVE", async () => {
    let aaveBalance1 = await AAVE_TokenContract.balanceOf(owner.address);
    let daiBalance1 = await DAI_TokenContract.balanceOf(owner.address);
    // console.log("AAVE before: ", aaveBalance1.toNumber());
    // console.log("DAI OWNER: ", daiOwner.toNumber());

    // console.log("OWNER DAI: ", daiBalance1);
    // console.log("OWNER AAVE: ", aaveBalance1);

    // console.log("DEFI DAI: ", await DAI_TokenContract.balanceOf(DeFi_Instance.address));
    // console.log("DEFI AAVE: ", await AAVE_TokenContract.balanceOf(DeFi_Instance.address))

    let sendDAI = await DAI_TokenContract.transfer(
      DeFi_Instance.address,
      INITIAL_AMOUNT,
      {
        from: owner.address,
      }
    );
    await sendDAI.wait();

    // let swapDAItoAAVE = await DeFi_Instance.swapTokens(
    //   DAIAddress,
    //   AAVEAddress,
    //   INITIAL_AMOUNT,
    //   {
    //     from: owner.address,
    //   }
    // );
    // await swapDAItoAAVE.wait();

    let aaveBalance2 = await AAVE_TokenContract.balanceOf(owner.address);
    // console.log(aaveBalance1);
    // console.log(aaveBalance2);
    expect(aaveBalance2 - aaveBalance1).to.be.above(0);
  });
});
