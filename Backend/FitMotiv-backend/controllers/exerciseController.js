import Challenge from "../Models/Challenge.js";
import User from "../Models/User.js";

export const getExerciseData = async (req, res) => {
  const uid = req.uid;
  const { challenge_id, exercise_id } = req.query;

  if (!uid || !exercise_id || !challenge_id) {
    return res.status(400).json({ message: "Missed required params" });
  }

  try {
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      let challenge = await Challenge.findOne({ _id: challenge_id });

      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }

      const mode = challenge.mode;
      const deadline = challenge.duration;
      const now = Date.now();
      const msPerDay = 1000 * 60 * 60 * 24;
      let daysLeft = Math.ceil((deadline - now) / msPerDay);
      if (daysLeft < 1) daysLeft = 1;

      const exerciseRaw = challenge.exercises.find((ex) => {
        return ex._id == exercise_id;
      });

      if (!exerciseRaw) {
        return res.status(404).json({ message: "Exercise not found" });
      }

      let repetitions = exerciseRaw.repetitions;
      let exerciseTitle = exerciseRaw.exerciseTitle;
      let exerciseType = exerciseRaw.type;

      if (mode === "per") {
        repetitions = Math.ceil(repetitions / daysLeft);
        if (exerciseType === "plank") {
          exerciseTitle = `${exerciseTitle} (${repetitions} sec for today)`;
        } else {
          exerciseTitle = `${exerciseTitle} (${repetitions} for today)`;
        }
      }

      const exercise = {
        id: exerciseRaw._id,
        exerciseType: exerciseRaw.type,
        progression: exerciseRaw.progression,
        exerciseTitle: exerciseTitle,
        repetitions: repetitions,
      };

      return res.status(200).json({ exercise, mode });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error getting CreatedChallenge:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const saveExerciseProgress = async (req, res) => {
  const uid = req.uid;
  const { challenge_id, exercise_id } = req.query;
  const { progressionValue } = req.body;

  if (!uid || !exercise_id || !challenge_id) {
    return res.status(400).json({ message: "Missed required params" });
  }

  try {
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const challenge = await Challenge.findOne({ _id: challenge_id });
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const exercise = challenge.exercises.find((ex) => ex._id == exercise_id);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    exercise.progression = progressionValue;

    const allCompleted = challenge.exercises.every(
      (ex) => ex.progression >= ex.repetitions
    );

    let justCompleted = false;

    const alreadyRewarded = user.transactions.some(
      (t) => t.type === "Challenge Completed" && t.amount === challenge.bet
    );

    if (
      allCompleted &&
      challenge.ChallengeStatus !== "Completed" &&
      !alreadyRewarded
    ) {
      challenge.ChallengeStatus = "Completed";
      user.transactions.push({
        amount: challenge.bet,
        type: "Challenge Completed",
      });

      await user.save();
      justCompleted = true;
    }

    await challenge.save();

    return res.status(200).json({
      message: "Successfully saved data",
      completed: allCompleted || justCompleted,
    });
  } catch (error) {
    console.error("Error saving exercise progress:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
