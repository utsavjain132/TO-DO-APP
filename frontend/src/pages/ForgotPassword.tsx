import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
    <div style={{ width: "300px", margin: "100px auto" }}>
      <h2>Forgot Password</h2>

      {!sent ? (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Send Reset Link
          </button>
        </form>
      ) : (
        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          A reset link has been sent to <b>{email}</b>.
          <br />
          Check your inbox.
        </p>
      )}

      <p style={{ marginTop: "10px" }}>
        <Link to="/">Back to Login</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
