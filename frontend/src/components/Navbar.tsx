import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Internship Project for IntelliSQR</Link>
      </div>
    </nav>
  );
}

export default Navbar;
