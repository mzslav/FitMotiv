import Challenge from "../Models/Challenge.js";
import User from "../Models/User.js";

export const createChallenge = async (req, res) => {
  try {
    const { recepient, title, mode, exercises, duration, bet, message } =
      req.body;

    const creator = req.uid;

    if (
      !creator ||
      !recepient ||
      !title ||
      !mode ||
      !exercises ||
      !duration ||
      !bet
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res
        .status(400)
        .json({ message: "Exercises must be a non-empty array." });
    }

    for (const ex of exercises) {
      if (!ex.type || typeof ex.repetitions !== "number") {
        return res
          .status(400)
          .json({
            message:
              "Each exercise must have a type and a number of repetitions.",
          });
      }
    }

    const newChallenge = new Challenge({
      creator,
      recepient,
      title,
      mode,
      exercises,
      duration,
      bet,
      message,
    });

    await newChallenge.save();

    return res.status(201).json({
      message: "Challenge created successfully.",
      challenge: newChallenge,
    });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getUserChallenges = async (req, res) => {
  const uid = req.uid;

  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  let user = await User.findOne({ firebaseUid: uid });

  if (user) {
    const wallet = user.walletAddress;
    let challenges = await Challenge.find({ recepient: wallet });

    const data = challenges.map(c => ({
        id: c._id,
        ChallengeTitle: c.title,
        ChallengeStatus: 'Active',
        Price: c.bet,

    }))
    return res.status(201).json({
      message: "Challenges find successfully.",
      challenges: data,
    });
  } else {
    return res.status(404).json({ message: "No user with this address" });
  }
};
