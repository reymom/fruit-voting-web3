import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

require("dotenv").config();
const { INFURA_URL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  networks: {
    sepolia: {
      url: INFURA_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      gas: 10000000,
      timeout: 60000,
    },
  },
  solidity: "0.8.19",
};

export default config;
