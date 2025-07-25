import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, mfaEnabled } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash, mfaEnabled });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: `Server error ${err}` });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({
          error:
            "No account exists with this email, Please create a new account first.",
        });

    if (user.lockUntil && user.lockUntil > Date.now()) {
      // Check if account is locked
      const waitTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res
        .status(403)
        .json({ error: `Account locked. Try again in ${waitTime} minute(s).` });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }

      await user.save();
      return res.status(401).json({ error: "Invalid password" });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    if (user.mfaEnabled) {
      const otpCode = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
      user.otpCode = otpCode;
      user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
      await user.save();
      return res.status(200).json({ mfaRequired: true, email });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: `Server error ${err}` });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.mfaEnabled)
      return res.status(401).json({ error: "Invalid request" });

    const now = new Date();

    if (!user.otpCode || user.otpExpiry < now) {
      return res.status(401).json({ error: "OTP expired or invalid" });
    }

    if (user.otpCode !== otpCode) {
      return res.status(401).json({ error: "Incorrect OTP" });
    }

    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: `Server error ${err}` });
  }
};

export const getUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ email: decoded.email, validUser: true });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
