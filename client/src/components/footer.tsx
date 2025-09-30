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
        <footer className="flex flex-col items-center justify-center p-4 text-white">
        <div className="flex items-center space-x-2">
        <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
          <span className="navbar-logo-text">UTMIST</span>
        </div>            <ul className="flex items-center space-x-4">
                <li>
                    <div className="flex items-center justify-center mt-4 mb-[0.9rem] w-[35px] h-[35px] p-2 bg-[var(--gray3)] rounded-full transition-colors duration-300 hover:bg-[var(--gray2)]">
                        <a href="https://discord.com/invite/88mSPw8" target="_blank" rel="noopener noreferrer">
                            <Image src={discord} alt="UTMIST Logo" />
                        </a>
                    </div>
                </li>
                <li>
                    <div className="flex items-center justify-center mt-4 mb-[0.9rem] w-[35px] h-[35px] p-2 bg-[var(--gray3)] rounded-full transition-colors duration-300 hover:bg-[var(--gray2)]">
                        <a href="https://www.linkedin.com/company/utmist/" target="_blank" rel="noopener noreferrer">
                            <Image src={linkedin} alt="UTMIST Logo" />
                        </a>
                    </div>
                </li>
                <li>
                    <div className="flex items-center justify-center mt-4 mb-[0.9rem] w-[35px] h-[35px] p-2 bg-[var(--gray3)] rounded-full transition-colors duration-300 hover:bg-[var(--gray2)]">
                        <a href="https://www.instagram.com/uoft_utmist/" target="_blank" rel="noopener noreferrer">
                            <Image src={instagram} alt="UTMIST Logo" />
                        </a>
                    </div>
                </li>
                <li>
                    <div className="flex items-center justify-center mt-4 mb-[0.9rem] w-[35px] h-[35px] p-2 bg-[var(--gray3)] rounded-full transition-colors duration-300 hover:bg-[var(--gray2)]">
                        <a href="https://www.facebook.com/UofT.MIST" target="_blank" rel="noopener noreferrer">
                            <Image src={facebook} alt="UTMIST Logo"/>
                        </a>
                    </div>
                </li>
                <li>
                    <div className="flex items-center justify-center mt-4 mb-[0.9rem] w-[35px] h-[35px] p-2 bg-[var(--gray3)] rounded-full transition-colors duration-300 hover:bg-[var(--gray2)]">
                        <a href="https://x.com/utmist1" target="_blank" rel="noopener noreferrer">
                            <Image src={twitter} alt="UTMIST Logo" />
                        </a>
                    </div>
                </li>
                <li>
                    <div className="flex items-center justify-center mt-4 mb-[0.9rem] w-[35px] h-[35px] p-2 bg-[var(--gray3)] rounded-full transition-colors duration-300 hover:bg-[var(--gray2)]">
                        <a href="https://github.com/UTMIST" target="_blank" rel="noopener noreferrer">
                            <Image src={github} alt="UTMIST Logo"  />
                        </a>
                    </div>
                </li>
                <li>
                    <div className="flex items-center justify-center mt-4 mb-[0.9rem] w-[35px] h-[35px] p-2 bg-[var(--gray3)] rounded-full transition-colors duration-300 hover:bg-[var(--gray2)]">
                        <a href="https://utorontomist.medium.com/" target="_blank" rel="noopener noreferrer">
                            <Image src={medium} alt="UTMIST Logo"/>
                        </a>
                    </div>
                </li>

            </ul>

            <div className="mt-2 mb-2">
                <a
                    href="https://github.com/UTMIST/UTMIST/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#5C5C5C] no-underline transition-colors duration-300 hover:text-[#8a8a8a]"
                    title="Report a Bug"
                >
                    🐛 Report Bug
                </a>
            </div>

            <div className="w-[90%] h-[5px] [background:var(--gradient-line-1),var(--gradient-line-2)] my-2"></div>
        </footer>
    );
}