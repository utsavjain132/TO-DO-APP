import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });

      alert("Account created! You can now log in.");
      navigate("/");
    } catch (err: any) {
  console.log("SIGNUP ERROR:", err.response?.data || err.message);
  alert("Signup failed: " + (err.response?.data?.message || "Unknown error"));
}

  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>

      <form onSubmit={handleSignup} className="signup-form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>
      </form>

      <p className="login-link">
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
