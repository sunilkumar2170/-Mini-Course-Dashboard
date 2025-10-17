const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const pool = require("../db");
require("dotenv").config();

const router = express.Router();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});



router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ msg: "All fields are required" });

  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
   

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000); 
    const expiry = new Date(Date.now() + 5 * 60 * 1000); 

    await pool.query(
      "INSERT INTO users(name, email, password, otp, otp_expiry) VALUES($1,$2,$3,$4,$5)",
      [name, email, hashed, otp, expiry]
    );

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP for Account Verification",
      html: `<h3>Your OTP is: ${otp}</h3><p>Valid for 5 minutes only.</p>`
    });

    res.json({ msg: "OTP sent to your email. Please verify to continue." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ msg: "Email and OTP required" });

  try {
    
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0)
      return res.status(400).json({ msg: "User not found" });

    const user = userResult.rows[0];

   
    if (user.is_verified)
      return res.status(400).json({ msg: "User already verified" });

    
    if (new Date() > new Date(user.otp_expiry))
      return res.status(400).json({ msg: "OTP expired, please request a new one" });


    if (otp !== user.otp)
      return res.status(400).json({ msg: "Invalid OTP, please try again" });

   
    await pool.query(
      "UPDATE users SET is_verified = true, otp = NULL, otp_expiry = NULL WHERE email = $1",
      [email]
    );

    res.json({ msg: "✅ Email verified successfully! ." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});





router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "All fields required" });

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0)
      return res.status(400).json({ msg: "User not found" });

    if (!user.rows[0].is_verified)
      return res.status(400).json({ msg: "Please verify your email first" });

    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid)
      return res.status(400).json({ msg: "Invalid password" });

    res.json({ msg: "Login successful", user: user.rows[0].name });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
