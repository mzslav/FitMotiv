import cron from 'node-cron';
import Challenge from '../Models/Challenge.js';

const updateExpiredChallenges = async () => {
  try {
    console.log('Checking for expired challenges...');
    
    const currentTimestamp = Date.now();

    const expiredChallenges = await Challenge.find({
      ChallengeStatus: { $in: ['Active', 'Awaiting'] },
      duration: { $lt: currentTimestamp }
    });

    if (expiredChallenges.length > 0) {
      const updateResult = await Challenge.updateMany(
        { 
          _id: { $in: expiredChallenges.map(c => c._id) },
          ChallengeStatus: { $in: ['Active', 'Awaiting'] }
        },
        { 
          $set: { 
            ChallengeStatus: 'Completed',
            completedAt: new Date()
          }
        }
      );

      console.log(`Updated ${updateResult.modifiedCount} expired challenges to Completed status`);
      const activeExpired = expiredChallenges.filter(c => c.ChallengeStatus === 'Active');
      const awaitingExpired = expiredChallenges.filter(c => c.ChallengeStatus === 'Awaiting');
      
      if (activeExpired.length > 0) {
        console.log(`- ${activeExpired.length} Active challenges expired:`);
        activeExpired.forEach(challenge => {
          console.log(`  * "${challenge.title}" (ID: ${challenge._id}) - was Active`);
        });
      }
      
      if (awaitingExpired.length > 0) {
        console.log(`- ${awaitingExpired.length} Awaiting challenges expired:`);
        awaitingExpired.forEach(challenge => {
          console.log(`  * "${challenge.title}" (ID: ${challenge._id}) - was Awaiting`);
        });
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