import React, { useState } from "react";
import "./Register.css";
import OtpVerify from "./OtpVerify";
import Loader from "./Loader";

const Register = () => {
  const [step, setStep] = useState("register");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Google Auth Redirect URL (backend route)
  const GOOGLE_AUTH_URL = "http://localhost:5000/api/auth/google";

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      alert(data.msg);

      if (data.msg.includes("OTP sent")) {
        setStep("otp");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Google Login Click
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  if (step === "otp") {
    return (
      <OtpVerify
        email={email}
        onVerified={() => {
          alert("✅ Email verified! Redirecting to dashboard...");
          window.location.href = "/dashboard";
        }}
      />
    );
  }

  return (
    <div className="register-wrapper">
      {loading && <Loader />}

      <div className="register-card">
        <h2 className="title">🧑‍💻 Create Your Account</h2>
        <p className="subtitle">Join us and start your journey today</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Register"}
          </button>
        </form>

        {/* 🔹 Divider */}
        <div className="divider">
          <span>or</span>
        </div>

        {/* 🔹 Google Login Button */}
        <button className="google-btn" onClick={handleGoogleLogin}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
          />
          Continue with Google
        </button>

        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
