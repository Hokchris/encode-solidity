const { expect, use } = require("chai");
const { ethers, upgrades } = require("hardhat");
const {
  constants, // Common constants, like the zero address and largest integers
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const { solidity } = require("ethereum-waffle");
use(solidity);

describe("VolcanoCoin", () => {
  let VolcanoContract;
  let volcanoContract;
  let owner, addr1, addr2, addr3;

  beforeEach(async () => {
    VolcanoContract = await ethers.getContractFactory("VolcanoCoin");
    volcanoContract = await upgrades.deployProxy(VolcanoContract, []);

    await volcanoContract.deployed();
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("has a name", async () => {
    let contractName = await volcanoContract.name();
    console.log("NAME IS ", contractName);
    expect(contractName).to.be.equal("VolcanoCoin");
  });

  it("has a version number", async () => {
    let versionNumber = await volcanoContract.CONTRACT_VERSION();
    expect(versionNumber).to.be.equal("1");
  });
});
