import User from "../Models/User.js";

export const auth = async (req, res) => {
  const uid = req.uid;

  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  try {
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      return res.status(200).json({ message: "User logged successfully" });
    }

    user = new User({ firebaseUid: uid });
    await user.save();
    res.status(200).json({ uid });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const sendWalletData = async (req, res) => {
  const uid = req.uid;

  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  try {

  let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.walletAddress) {
      return res.status(200).json({
        message: "User wallet exist",
        address: user.walletAddress,
      });
    }

    return res.status(200).json({
      message: "User wallet is not set",
      address: null,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createWallet = async (req, res) => {
  const uid = req.uid;
  const { address } = req.body;

  if (!uid || !address) {
    return res.status(400).json({ message: "UID and address are required" });
  }

  try {
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      user.walletAddress = address;
      await user.save();

      return res
        .status(200)
        .json({ message: "User updated successfully", user });
    }

    await user.save();
    res.status(200);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
