import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/forgot", { email });
      setSent(true);
    } catch (err) {
      alert("Error sending reset link");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>

      {!sent ? (
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Send Reset Link</button>
        </form>
      ) : (
        <p className="sent-message">
          A reset link has been sent to <b>{email}</b>.
          <br />
          Check your inbox.
        </p>
      )}

      <p className="login-link">
        <Link to="/">Back to Login</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
