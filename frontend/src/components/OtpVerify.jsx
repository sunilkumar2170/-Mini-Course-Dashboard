import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import "./OtpVerify.css";

const OtpVerify = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      alert(data.msg);

    
      if (data.msg.toLowerCase().includes("success")) {
        navigate("/main");  
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      {loading && <Loader />}
      <div className="otp-card">
        <h2>🔐 Verify Your Email</h2>
        <p className="otp-subtext">
          We’ve sent a 6-digit code to <b>{email}</b>
        </p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            maxLength={6}
            className="otp-input"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button className="otp-btn" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;
