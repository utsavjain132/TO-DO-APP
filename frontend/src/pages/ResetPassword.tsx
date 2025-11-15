import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // extract ?token=xxxx from URL
  const token = new URLSearchParams(location.search).get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/reset", {
        token,
        password,
      });

      alert("Password reset successful!");
      navigate("/");
    } catch (err) {
      alert("Reset failed. Token may be expired.");
    }
  };

  if (!token) {
    return (
      <div className="invalid-link-container">
        <h2>Invalid Link</h2>
        <p>The reset link is missing or broken.</p>
        <p className="login-link">
        <Link to="/">Go to Login</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit} className="reset-password-form">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>
      </form>

      <p className="login-link">
        <Link to="/">Back to Login</Link>
      </p>
    </div>
  );
}

export default ResetPassword;
