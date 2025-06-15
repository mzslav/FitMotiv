import { ethers } from 'ethers';
import cron from 'node-cron';
import Challenge from '../Models/Challenge.js';
import abi from './abi.json' with { type: "json" };
import dotenv from 'dotenv';

dotenv.config();

const CONTRACT_ADDRESS = '0xd6A28e0188538e20715631575b54E7627AC5b8Ab';
const PRIVATE_KEY = process.env.PRIVATE_KEY; 
const PROVIDER_URL = process.env.PROVIDER_URL; 

const provider = new ethers.JsonRpcProvider(PROVIDER_URL);


const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

const updateExpiredChallenges = async () => {
  try {
    console.log('Checking for expired challenges...');
    const currentTimestamp = Date.now();

    const expiredChallenges = await Challenge.find({
      ChallengeStatus: { $in: ['Active', 'Awaiting'] },
      duration: { $lt: currentTimestamp }
    });

    if (expiredChallenges.length > 0) {
      const idsToUpdate = expiredChallenges.map(c => c._id);

      const updateResult = await Challenge.updateMany(
        { _id: { $in: idsToUpdate } },
        {
          $set: {
            ChallengeStatus: 'Expired',
            completedAt: new Date()
          }
        }
      );

      console.log(`Updated ${updateResult.modifiedCount} challenges in MongoDB`);

      for (const challenge of expiredChallenges) {
        try {
          const tx = await contract.setExpiredChallenge(challenge._id.toString());
          await tx.wait();
          console.log(`Challenge ${challenge._id} expired on blockchain (tx: ${tx.hash})`);
        } catch (blockchainError) {
          console.error(`Blockchain error for challenge ${challenge._id}:`, blockchainError);
        }
      }
    } else {
      console.log('No expired challenges found');
    }

  } catch (error) {
    console.error('Error updating expired challenges:', error);
  }
};

const startChallengeScheduler = () => {
  cron.schedule('*/30 * * * *', () => {
    console.log('Running scheduled challenge check...');
    updateExpiredChallenges();
  });

  console.log('Running initial challenge check...');
  updateExpiredChallenges();
};

const manualCheckExpiredChallenges = async () => {
  console.log('Manual challenge check triggered...');
  await updateExpiredChallenges();
};

export {
  startChallengeScheduler,
  updateExpiredChallenges,
  manualCheckExpiredChallenges
};
