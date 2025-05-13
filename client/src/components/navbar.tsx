import "../styles/navbar.css";
import "../styles/gradients.css";
import Image from "next/image";
import logo from "../assets/logos/utmist-logo-small.svg"; // Import the SVG file

export default function Navbar() {
    return (
      <nav className="navbar-container">
        <a href="/">
        <div className="flex items-center space-x-2">
        <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
          <span className="navbar-logo-text">UTMIST</span>
        </div>
        </a>
        <ul className="flex space-x-10">
          <li><a href="/about" className="nav-item">About Us</a></li>
          <li><a href="/projects" className="nav-item">Projects</a></li>
          <li><a href="/blog" className="nav-item">Blog</a></li>
          <li><a href="/events" className="nav-item">Events</a></li>
          <li><a href="/careers" className="nav-item">Careers</a></li>
        </ul>
  
        <div className="flex items-center space-x-4">
          <button className="nav-button">
            Log In
          </button>
        </div>
      </nav>
    );
  }