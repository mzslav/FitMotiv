import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  repetitions: { 
    type: Number, 
    required: true 
  },
  exerciseTitle: {
    type: String, 
    required: true 
  },
  progression: {
    type: Number, 
    required: true ,
  },
});

const challengeSchema = new mongoose.Schema(
  {
    creator: { 
    type: String,  
    required: true 
    },
    recepient: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    exercises: {
      type: [exerciseSchema],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    bet: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
    },
    ChallengeStatus: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
