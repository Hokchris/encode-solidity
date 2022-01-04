const { expect, use } = require("chai");
const { ethers } = require("hardhat");
const {
  constants, // Common constants, like the zero address and largest integers
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const { solidity } = require("ethereum-waffle");
use(solidity);

// https://www.chaijs.com/guide/styles/
// https://ethereum-waffle.readthedocs.io/en/latest/matchers.html

describe("Volcano Coin", () => {
  let volcanoContract;
  let owner, addr1, addr2, addr3;

  beforeEach(async () => {
    const Volcano = await ethers.getContractFactory("VolcanoCoin");
    volcanoContract = await Volcano.deploy();
    await volcanoContract.deployed();

    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("has a name", async () => {
    let contractName = await volcanoContract.name();
    expect(contractName).to.equal("Volcano Coin");
  });

  it("reverts when transferring tokens to the zero address", async () => {
    await expectRevert(
      volcanoContract.transfer(constants.ZERO_ADDRESS, 10),
      "ERC20: transfer to the zero address"
    );
  });

  //homework
  it("has a symbol", async () => {
    let symbolName = await volcanoContract.symbol();
    expect(symbolName).to.equal("VLC");
  });
  it("has 18 decimals", async () => {
    let decimals = await volcanoContract.decimals();
    expect(decimals).to.equal(18);
  });
  it("assigns initial balance", async () => {
    let initial = await volcanoContract.totalSupply();
    expect(initial).to.equal(10000);
  });

  it("increases allowance for address1", async () => {
    let increaseAmount = 100;
    let o = owner.address;
    let a1 = addr1.address;
    let allowanceBefore = await volcanoContract.allowance(o, a1);

    let tx = await volcanoContract.increaseAllowance(a1, increaseAmount);
    await tx.wait();

    let allowanceAfter = await volcanoContract.allowance(o, a1);
    expect(allowanceAfter - allowanceBefore).to.be.equal(increaseAmount);
  });
  it("decreases allowance for address1", async () => {
    // give initial allowance
    let increaseAmount = 100;
    let o = owner.address;
    let a1 = address1.address;
    let tx1 = await volcanoContract.increaseAllowance(a1, increaseAmount);
    await tx1.wait();
    let allowanceBefore = await volcanoContract.allowance(o, a1);

    // reduce from allowance
    let decreaseAmount = 10;
    let tx2 = await volcanoContract.decreaseAllowance(a1, decreaseAmount);
    await tx2.wait();
    let allowanceAfter = await volcanoContract.allowance(o, a1);

    expect(allowanceBefore - allowanceAfter).to.be.equal(decreaseAmount);
  });
  it("emits an event when increasing allowance", async () => {});
  it("revets decreaseAllowance when trying decrease below 0", async () => {});

  it("updates balances on successful transfer from owner to addr1", async () => {});
  it("revets transfer when sender does not have enough balance", async () => {});

  it("reverts transferFrom addr1 to addr2 called by the owner without setting allowance", async () => {});
  it("updates balances after transferFrom addr1 to addr2 called by the owner", async () => {});
});
