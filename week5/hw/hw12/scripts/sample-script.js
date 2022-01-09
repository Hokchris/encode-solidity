const { ethers, upgrades } = require("hardhat");

async function main() {
  // contract deployment
  const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
  const volcanoCoin = await upgrades.deployProxy(VolcanoCoin, []);
  await volcanoCoin.deployed();
  console.log("VolcanoCoin deployed to: ", volcanoCoin.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
