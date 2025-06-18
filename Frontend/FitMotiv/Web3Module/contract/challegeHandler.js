import { parseEther, formatEther } from "ethers";
import { getContract } from "./challengeContract";

export const createChallenge = async (challengeId, receiver, amountEth) => {
  try {
    const contract = await getContract();
    if (!contract) throw new Error("Contract not initialized");

    const value = parseEther(amountEth.toString());
    const tx = await contract.createChallenge(challengeId, receiver, { value });
    const receipt = await tx.wait();

    const parsedLogs = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const event = parsedLogs.find((log) => log.name === "ChallengeCreated");

    if (event) {
      const { challengeId, sender, receiver, amount } = event.args;
      return {
        challengeId,
        sender,
        receiver,
        amount: formatEther(amount),
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error creating challenge:", err);
    return null;
  }
};

export const completeChallenge = async (challengeId) => {
  try {
    const contract = await getContract();
    if (!contract) throw new Error("Contract not initialized");

    const tx = await contract.completeChallenge(challengeId);
    const receipt = await tx.wait();

    const parsedLogs = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const event = parsedLogs.find((log) => log.name === "ChallengeCompleted");

    if (event) {
      const { challengeId, ChallengeSender, receiver, amount } = event.args;
      return {
        challengeId,
        ChallengeSender,
        receiver,
        amount: formatEther(amount),
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error creating challenge:", err);
    return null;
  }
};

export const activateChallengeH = async (challengeId) => {
  try {
    const contract = await getContract();
    if (!contract) throw new Error("Contract not initialized");

    await contract.activateChallenge(challengeId);
  } catch (err) {
    console.error("Error creating challenge:", err);
    return null;
  }
};
