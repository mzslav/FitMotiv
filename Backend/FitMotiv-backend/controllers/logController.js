import Challenge from "../Models/Challenge.js";
import User from "../Models/User.js";

export const getUserDataChallenges = async (req, res) => {
  const uid = req.uid;

  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  try {
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      const wallet = user.walletAddress;
      let RawChallenges = await Challenge.find({ creator: wallet });

      let RawChallengeActions = await Challenge.find({ creator: wallet, ChallengeStatus: 'Completed' });
      
      let RawNewActions = await Challenge.find({ recepient: wallet, ChallengeStatus: 'Awaiting' });



      const challengesCreated = RawChallenges.map(challenge => {
        return {
            id: challenge._id,
            recepeintAddress: challenge.recepient,
            Status: challenge.ChallengeStatus
        }
      })

     const challengesAccepted = RawChallenges.map(challenge => {
        return {
            id: challenge._id,
            recepeintAddress: challenge.creator,
            Title: challenge.title
        }
      })

      let amountTasks = 0;
      let amountEarn = 0;
      let newChallenges = 0;

      RawNewActions.forEach((challenge) => {
        newChallenges += 1;
      })

     RawChallengeActions.forEach((challenge) => {
        amountEarn += challenge.bet;
        amountTasks += 1;
     })


      return res.status(200).json({
        challengesCreated,
        challengesAccepted,
        amountEarn,
        amountTasks,
        newChallenges
      });
    }
  } catch (error) {
    console.error("Error getting CreatedChallenge:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
