import hre from "hardhat";

async function main() {
  const fruitVoting = await hre.viem.deployContract("FruitVoting");

  console.log(`FruitVoting deployed to ${fruitVoting.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
