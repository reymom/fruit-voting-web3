export const FRUIT_CONTRACT_ADDRESS =
  "0x9025e74D23384f664CfEB07F1d8ABd19570758B5";

export const FRUIT_CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "fruit",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "votes",
        type: "uint256",
      },
    ],
    name: "FruitVoted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "fruitVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "fruit",
        type: "string",
      },
    ],
    name: "getVotesForFruit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "fruit",
        type: "string",
      },
    ],
    name: "voteForFruit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
