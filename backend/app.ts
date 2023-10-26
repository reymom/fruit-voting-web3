import { Request, Response } from "express";

import { getFruitContract, signer } from "./utils/evm";
import server from "./utils/setup";

server.get("/vote/:fruitName", async (req: Request, res: Response) => {
  try {
    const { fruitName } = req.params;
    const wallet = signer();
    const fruitContract = getFruitContract(wallet);
    const unsigned = await fruitContract["voteForFruit"].populateTransaction(
      fruitName
    );

    return res.status(200).json(unsigned);
  } catch (e) {
    const error = (e as Error).toString();
    res.status(400).json({ error });
  }
});

server.get("/getVotes/:fruitName", async (req: Request, res: Response) => {
  try {
    const { fruitName } = req.params;
    const fruitContract = getFruitContract(signer());
    const votes = await fruitContract.getVotesForFruit(fruitName);

    return res.status(200).json({
      fruit: fruitName,
      votes: votes.toString(),
    });
  } catch (e) {
    const error = (e as Error).toString();
    res.status(400).json({ error });
  }
});
