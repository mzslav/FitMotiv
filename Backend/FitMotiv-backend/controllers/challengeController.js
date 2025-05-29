import Challenge from "../Models/Challenge.js";
import User from "../Models/User.js";

export const createChallenge = async (req, res) => {
  try {
    const { recepient, title, mode, exercises, duration, bet, message } =
      req.body;

    const uid = req.uid;
    let user = await User.findOne({ firebaseUid: uid });
    const creator = user.walletAddress;

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



export const getChallengeData = async (req, res) => {
  const uid = req.uid;
  const { exercise_id } = req.query;

  if (!uid || !exercise_id ) {
    return res.status(400).json({ message: "UID and exercise_id is required" });
  }

  let challenge = await Challenge.findOne({ _id: exercise_id });

  if (challenge) {

    const data = {
      id: challenge._id,
      title: challenge.title,
      description: challenge.message,
      sender: challenge.creator,
      money: challenge.bet,
      deadline: challenge.duration,
      exercises: challenge.exercises.map((e, index) => ({
        id: e._id,
        exerciseType: e.type || "unknown",
        exerciseTitle: e.type || "unknown",
        progression: Math.floor(Math.random() * 100) + 1
      })),
    };

    
    return res.status(201).json({
      message: "Challenges find successfully.",
      challenge: data,
    });
  } else {
    return res.status(404).json({ message: "No challenge with this _id" });
  }
};