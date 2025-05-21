import "../styles/footer.css";
import Image from "next/image";
import logo from "../assets/logos/utmist-logo-small.svg"; 
import github from "../assets/logos/github.svg"; 
import linkedin from "../assets/logos/linkedin.svg"; 
import twitter from "../assets/logos/x.svg"; 
import discord from "../assets/logos/discord.svg"; 
import facebook from "../assets/logos/facebook.svg"; 
import instagram from "../assets/logos/instagram.svg"; 
import medium from "../assets/logos/medium.svg"; 



export default function Footer() { 
    return (
        <footer className="footer-container">
        <div className="flex items-center space-x-2">
        <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
          <span className="navbar-logo-text">UTMIST</span>
        </div>            <ul className="flex items-center space-x-4">
                <li>
                    <div className="footer-logo-container">
                        <a href="https://discord.com/invite/88mSPw8" target="_blank" rel="noopener noreferrer">
                            <Image src={discord} alt="UTMIST Logo" />
                        </a>
                    </div>
                </li>
                <li>
                    <div className="footer-logo-container">
                        <a href="https://www.linkedin.com/company/utmist/" target="_blank" rel="noopener noreferrer">
                            <Image src={linkedin} alt="UTMIST Logo" />
                        </a>
                    </div>
                </li>
                <li>
                    <div className="footer-logo-container">
                        <a href="https://www.instagram.com/uoft_utmist/" target="_blank" rel="noopener noreferrer">
                            <Image src={instagram} alt="UTMIST Logo" />
                        </a>
                    </div>
                </li>
                <li>
                    <div className="footer-logo-container">
                        <a href="https://www.facebook.com/UofT.MIST" target="_blank" rel="noopener noreferrer">
                            <Image src={facebook} alt="UTMIST Logo"/>
                        </a>
                    </div>
                </li>
                <li>
                    <div className="footer-logo-container">
                        <a href="https://x.com/utmist1" target="_blank" rel="noopener noreferrer">
                            <Image src={twitter} alt="UTMIST Logo" />
                        </a>
                    </div>
                </li>
                <li>
                    <div className="footer-logo-container">
                        <a href="https://github.com/UTMIST" target="_blank" rel="noopener noreferrer">
                            <Image src={github} alt="UTMIST Logo"  />
                        </a>
                    </div>
                </li>
                <li>
                    <div className="footer-logo-container">
                        <a href="https://utorontomist.medium.com/" target="_blank" rel="noopener noreferrer">
                            <Image src={medium} alt="UTMIST Logo"/>
                        </a>
                    </div>
                </li>
                
            </ul>
            <div className="footer-line"></div>
        </footer>
    );  
}