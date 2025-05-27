import mongoose from 'mongoose';

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

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
