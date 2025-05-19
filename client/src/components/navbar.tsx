import "../styles/navbar.css";
import "../styles/gradients.css";
import Image from "next/image";
import Link from "next/link"; // Import Link from next/link
import logo from "../assets/logos/utmist-logo-small.svg";
import lightMode from "../assets/icons/light-mode.svg";

export default function Navbar() {
  return (
    <nav className="navbar-container">
      <Link href="/" passHref>
        <div className="flex items-center space-x-2 cursor-pointer">
          <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
          <span className="navbar-logo-text">UTMIST</span>
        </div>
      </Link>

      <ul className="flex space-x-10">
        <li><Link href="/#about-us" className="nav-item">About Us</Link></li>
        <li><Link href="/projects" className="nav-item">Projects</Link></li>
        <li><Link href="/blog" className="nav-item">Blog</Link></li>
        <li><Link href="/sponsors" className="nav-item">Sponsors</Link></li>
        <li><Link href="/events" className="nav-item">Events</Link></li>
        <li><Link href="/careers" className="nav-item">Careers</Link></li>
      </ul>

      <div className="flex items-center space-x-4">
        <button className="nav-button">
          Log In
        </button>
      <Image src={lightMode} alt="UTMIST Logo" className="hover:brightness-75 transition" width={32} height={32} />
      </div>

    </nav>
  );
}
