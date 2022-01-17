const { expect, use } = require("chai");
const { ethers } = require("hardhat");

const { solidity } = require("ethereum-waffle");
use(solidity);

const DAIAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const cDAIAddress = "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643";

describe("DeFi", () => {
  let owner;
  let DAI_TokenContract;
  let cDAI_TokenContract;
  let DeFi_Instance;

  before(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
   
    DAI_TokenContract = await ethers.getContractAt("Erc20", DAIAddress);
    cDAI_TokenContract = await ethers.getContractAt("CErc20", cDAIAddress);

    // .symbol() not available as they are not ERC20 contracts
    // const daiSymbol = await DAI_TokenContract.symbol();
    // const cdaiSymbol = await cDAI_TokenContract.symbol();

    // console.log("dai => ", daiSymbol);
    // console.log("cdai => ", cdaiSymbol);

    const DeFi = await ethers.getContractFactory("DeFi");
    DeFi_Instance = await DeFi.deploy();

  });

  it("should send DAI to contract", async () => {
    const daiBalance = await DAI_TokenContract.balanceof(DeFi_Instance.address);

    console.log(daiBalance);
  });

  it("should swap DAI to cDAI", async () => {

  });

  it("should have cDAI", async() => {

  })


});
