const { ethers, upgrades } = require("hardhat");

async function main() {
  // contract deployment
  const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
  const volcanoCoin = await upgrades.deployProxy(VolcanoCoin, []);
  await volcanoCoin.deployed();

  let v1 = await volcanoCoin.CONTRACT_VERSION();
  console.log("VolcanoCoin deployed to: ", volcanoCoin.address);
  console.log("Version: ", v1);

  // contract upgrade
  const VolcanoCoin2 = await ethers.getContractFactory("VolcanoCoin2");
  const upgraded = await upgrades.upgradeProxy(
    volcanoCoin.address,
    VolcanoCoin2
  );
  await upgraded.deployed();

  let v2 = await upgraded.CONTRACT_VERSION();
  console.log("Upraded, new contract at address: ", upgraded.address);
  console.log("Version: ", v2);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
