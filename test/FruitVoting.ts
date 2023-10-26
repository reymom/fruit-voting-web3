import { expect } from "chai";
import hre from "hardhat";

describe("FruitVoting", function () {
  async function testConfig() {
    return await hre.viem.deployContract("FruitVoting");
  }

  describe("Votes", function () {
    it("Should have no votes initially", async function () {
      const contract = await testConfig();

      expect(await contract.read.getVotesForFruit([""])).to.equal(0n);
      expect(await contract.read.getVotesForFruit(["Apple"])).to.equal(0n);
    });

    it("Adds votes properly", async function () {
      const contract = await testConfig();

      await contract.write.voteForFruit(["Apple"]);
      expect(await contract.read.getVotesForFruit(["Apple"])).to.equal(1n);
      expect(await contract.read.getVotesForFruit(["Peach"])).to.equal(0n);

      for (let i = 0; i < 9; i++) {
        await contract.write.voteForFruit(["Apple"]);
      }
      expect(await contract.read.getVotesForFruit(["Apple"])).to.equal(10n);
    });
  });

  describe("Events", function () {
    it("Should emit an event on vote", async function () {
      const contract = await testConfig();

      await contract.write.voteForFruit(["Apple"]);
      let voteEvents = await contract.getEvents.FruitVoted();
      expect(voteEvents).to.have.lengthOf(1);
      expect(voteEvents[0].args.fruit).to.equal("Apple");
      expect(voteEvents[0].args.votes).to.equal(1n);
    });

    it("Should update vote info on event", async function () {
      const contract = await testConfig();

      await contract.write.voteForFruit(["Apple"]);
      await contract.write.voteForFruit(["Apple"]);

      const voteEvents = await contract.getEvents.FruitVoted();
      expect(voteEvents).to.have.lengthOf(1);
      expect(voteEvents[0].args.fruit).to.equal("Apple");
      expect(voteEvents[0].args.votes).to.equal(2n);
    });
  });
});
