import User from '../models/user.model.js';
import bodyParser from 'body-parser';
import sendMail, { sendForgotMail } from "../middleware/sendMail.js";
import TryCatch from "../middleware/TryCatch.js";
import bcrypt from 'bcryptjs';
import admin from '../middleware/firebaseAdmin.js';
import jwt from 'jsonwebtoken';

const { json } = bodyParser;

export const registerUser = TryCatch(async (req, res) => {
    const { email, name, password } = req.body;
    console.log(req.body);
    let user = await User.findOne({ email });

    if (user) {
        return res.status(400).json({
            message: "User Already Exists"
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = {
        name,
        email,
        password: hashPassword
    };

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    const activationToken = jwt.sign(
        { user: newUser, otp },
        process.env.Activation_Secret,
        {
            expiresIn: "5m"
        }
    );

    const data = { name, otp };

    await sendMail(email, "Skill-Exchange OTP Verification", data);

    return res.status(200).json({
        message: "OTP sent to your mail",
        activationToken
    });
})


export const verifyUser = TryCatch(async (req, res) => {
    const { otp, activationToken } = req.body;
    const verify = jwt.verify(activationToken, process.env.Activation_Secret);

    if (!verify) {
        return res.status(400).json({
            message: "OTP Expired",
        });
    }
    if (verify.otp !== otp) {
        return res.status(400).json({
            message: "Wrong OTP"
        });
    }
    await User.create({
        name: verify.user.name,
        email: verify.user.email,
        password: verify.user.password,
        isVerified: true,
    })

    res.json({
        message: "User Registered",
    })
})

export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;
    console.log("Login request:", email, password);

    const user = await User.findOne({ email }).select("+password");
    console.log("Fetched user:", user);
    if (!user) {
        return res.status(400).json({ message: "No User With this email" });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    console.log("Password match result:", matchPassword);

    if (!matchPassword) {
        return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
    res.json({
        message: `Welcome Back ${user.name}`,
        token,
        user,
    });
});


export const resetPassword = TryCatch(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "No user with this email",
        });
    }

    // Check OTP expiry
    if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
        return res.status(400).json({
            message: "OTP expired",
        });
    }

    // Direct numeric comparison (no bcrypt)
    if (user.resetPasswordOtp !== Number(otp)) {
        return res.status(400).json({
            message: "Invalid OTP",
        });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP and expiry
    user.resetPasswordOtp = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.json({
        message: "Password has been reset successfully.",
    });
});


export const forgotPassword = TryCatch(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });


    if (!user) {
        return res.status(404).json({
            message: "No user with this email",
        });
    }

    // Generate numeric 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetPasswordOtp = otp;
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendForgotMail("E-Learning Password Reset OTP", { email, otp });

    res.json({
        message: "OTP has been sent to your email.",
    });
});


export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('skills');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json({ user });
});

export const googleLogin = TryCatch(async (req, res) => {
  const { token } = req.body;

  // Verify Firebase token
  const decodedToken = await admin.auth().verifyIdToken(token);
  const { email, name, picture, uid: googleId } = decodedToken;
  //  Find or create user
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      picture,
      password: "googleuser",
    });
  }

  //  Generate app JWT
  const authToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.status(200).json({
    message: `Welcome ${user.name}`,
    token: authToken,
    user,
  });
});