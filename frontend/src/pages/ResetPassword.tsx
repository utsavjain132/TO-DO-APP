import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";

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
      <div style={{ width: "300px", margin: "100px auto" }}>
        <h2>Invalid Link</h2>
        <p>The reset link is missing or broken.</p>
        <Link to="/">Go to Login</Link>
      </div>
    );
  }

  return (
    <div style={{ width: "300px", margin: "100px auto" }}>
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Reset Password
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        <Link to="/">Back to Login</Link>
      </p>
    </div>
  );
}

export default ResetPassword;
