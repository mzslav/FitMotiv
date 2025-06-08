import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number, 
    required: true
  },
  type: { 
    type: String, 
    required: true
  },

}, { timestamps: true });


const userSchema = new mongoose.Schema({
  firebaseUid: { 
    type: String, 
    required: true,
    unique: true, 
  },
  walletAddress: { 
    type: String, 
    default: null,
    unique: true, 
  },
  transactions: {
    type: [transactionSchema],
  }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
