import Challenge from "../Models/Challenge.js";
import User from "../Models/User.js";

export const getExerciseData = async (req, res) => {
  const uid = req.uid;
  const {challenge_id, exercise_id} = req.query;


  if (!uid || !exercise_id || !challenge_id) {
    return res.status(400).json({ message: "Missed required params" });
  }

  try {
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {

      let challenge = await Challenge.findOne({ _id: challenge_id });

      const exerciseRaw = challenge.exercises.find((ex) => {
        return ex._id == exercise_id;
      })

      if (!exerciseRaw) {
      return res.status(404).json({ message: "Exercise not found" });
      }



        const exercise = {
        id: exerciseRaw._id,
        exerciseType: exerciseRaw.type,
        progression: exerciseRaw.progression,
        exerciseTitle: exerciseRaw.exerciseTitle,
        };

      return res.status(200).json(exercise);
    }
  } catch (error) {
    console.error("Error getting CreatedChallenge:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
