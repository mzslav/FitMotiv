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
        return res.status(400).json({
          message:
            "Each exercise must have a type and a number of repetitions.",
        });
      }
    }

    const exercisesWithProgression = exercises.map((ex) => ({
      ...ex,
      progression: 0,
      exerciseTitle: `${ex.repetitions} ${ex.type}`,
    }));

    const ChallengeStatus = "Awaiting";

    const newChallenge = new Challenge({
      creator,
      recepient,
      title,
      mode,
      exercises: exercisesWithProgression,
      duration,
      bet,
      message,
      ChallengeStatus,
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

    const data = challenges.map((c) => ({
      id: c._id,
      ChallengeTitle: c.title,
      ChallengeStatus: c.ChallengeStatus,
      Price: c.bet,
    }));
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

  if (!uid || !exercise_id) {
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
      ChallengeStatus: challenge.ChallengeStatus,
      exercises: challenge.exercises.map((e, index) => ({
        id: e._id,
        exerciseType: e.type || "unknown",
        exerciseTitle: e.exerciseTitle || "unknown",
        progression: e.progression,
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

export const setActiveChallenge = async (req, res) => {
  const uid = req.uid;
  const { exercise_id } = req.body;

  if (!uid || !exercise_id) {
    return res.status(400).json({ message: "UID and exercise_id is required" });
  }

  try {
    const challenge = await Challenge.findOne({ _id: exercise_id });

    if (!challenge) {
      return res.status(404).json({ message: "No challenge with this _id" });
    }

    challenge.ChallengeStatus = "Active";
    await challenge.save();

    return res
      .status(200)
      .json({ message: "Challenge status updated to Active." });
  } catch (error) {
    console.error("Error updating challenge status:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getExpectedAmount = async (req, res) => {
  const uid = req.uid;

  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  try {
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      const wallet = user.walletAddress;
      let challenges = await Challenge.find({
        recepient: wallet,
        ChallengeStatus: "Awaiting" || "Active",
      });
      let amount = 0;
      let amountTasks = 0;
      challenges.forEach((challenge) => {
        amount += challenge.bet;
        amountTasks += 1;
      });

      return res.status(200).json({ amount, amountTasks });
    }
  } catch (error) {
    console.error("Error updating challenge status:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
