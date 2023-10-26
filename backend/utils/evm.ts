import { Wallet, Contract, InfuraProvider } from "ethers";
import { FRUIT_CONTRACT_ADDRESS, FRUIT_CONTRACT_ABI } from "../consts";
import * as dotenv from "dotenv";

dotenv.config();
const PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;

if (!PRIVATE_KEY) {
  throw new Error("Account private key not provided in env file");
}

const getProvider = () => {
  const provider = new InfuraProvider(
    process.env.ETHEREUM_NETWORK,
    process.env.INFURA_API_KEY,
    process.env.INFURA_API_SECRET
  );
  return provider;
};

export const signer = () => new Wallet(PRIVATE_KEY, getProvider());

export const getFruitContract = (signer: Wallet) => {
  return new Contract(FRUIT_CONTRACT_ADDRESS, FRUIT_CONTRACT_ABI, signer);
};
