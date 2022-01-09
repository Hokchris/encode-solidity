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
    expect(contractName).to.be.equal("VolcanoCoin");
  });

  it("has a version number", async () => {
    let versionNumber = await volcanoContract.CONTRACT_VERSION();
    expect(versionNumber).to.be.equal("1");
  });

  it("upgrades", async () => {
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await upgrades.deployProxy(VolcanoCoin, []);
    let ver1 = await volcanoCoin.CONTRACT_VERSION();
    expect(ver1).to.be.equal("1");

    const VolcanoCoin2 = await ethers.getContractFactory("VolcanoCoin2");
    const volcanoCoin2 = await upgrades.upgradeProxy(
      volcanoCoin.address,
      VolcanoCoin2
    );
    let ver2 = await volcanoCoin2.CONTRACT_VERSION();
    expect(ver2).to.be.equal("2");
  });
});
