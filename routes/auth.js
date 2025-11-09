const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const passport = require("passport");
const User = require("../models/User");

require("dotenv").config();

const router = express.Router();

// ✅ Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));


router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/login-failed",
    successRedirect: "/api/auth/login-success",
  })
);


router.get("/login-success", (req, res) => {
  res.send("✅ Google Login Successful!");
});

router.get("/login-failed", (req, res) => {
  res.send("❌ Google Login Failed!");
});



router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ msg: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await User.create({ name, email, password: hashed, otp, otp_expiry: expiry });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP for Account Verification",
      html: `<h3>Your OTP is: ${otp}</h3><p>Valid for 5 minutes.</p>`,
    });

    res.json({ msg: "OTP sent to your email. Please verify to continue." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ msg: "Email and OTP required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.is_verified)
      return res.status(400).json({ msg: "Already verified" });

    if (new Date() > new Date(user.otp_expiry))
      return res.status(400).json({ msg: "OTP expired" });

    if (user.otp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    user.is_verified = true;
    user.otp = null;
    user.otp_expiry = null;
    await user.save();

    res.json({ msg: "✅ Email verified successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "All fields required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (!user.is_verified)
      return res.status(400).json({ msg: "Please verify your email first" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: "Invalid password" });

    res.json({ msg: "✅ Login successful", user: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.get("/all", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Fetch failed" });
  }
});

module.exports = router;
