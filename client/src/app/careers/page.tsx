
import "@/styles/careers.css"  
import Image from "next/image"
import blueTick from "@/assets/icons/blue-tick-icon.svg";
import darkBlueTick from "@/assets/icons/dark-blue-tick-icon.svg";
import {Positions} from "@/types/careers";

export default function CareersPage() {

    const positions: Positions[] = [
        {
            title: "Team Lead (External Collab ML Projects)",
            department: "Engineering",
            division: "Internship"
        },
        {
            title: "Developer (External Collab ML Projects)",
            department: "Engineering",
            division: "Internship"
        },
        {
            title: "Internal ML Projects - Team Lead",
            department: "Engineering",
            division: "Internship"
        },
        {
            title: "Software Developer (Compute Platform)",
            department: "Infrastructure",
            division: "Internship"
        },
        {
            title: "Software Developer (Full Stack)",
            department: "Infrastructure",
            division: "Internship"
        }
    ];

    return <main>
              <div className="hero-section">
          <h2 className="hero-title">Careers</h2>
          <p className="hero-subtitle">
            Help shape the future of AI and ML at UTMIST
          </p>
        </div>  
        <div className="career-section">
            <div className="career-card">
                <h2 className="career-card-title">Hands on ML Experience</h2>
                <div className="career-card-row">
                <Image
                src={blueTick}                          
                alt={"Blue Tick Icon"}
                width={20}
                height={20}
                objectFit="cover"/>
                <p className="career-card-description">
                Build impactful projects using AI and ML 
                </p>
                </div>
                <div className="career-card-line" />
                <div className="career-card-row">
                <Image
                src={blueTick}                          
                alt={"Blue Tick Icon"}
                width={20}
                height={20}
                objectFit="cover"/>
                <p className="career-card-description">
                Join study groups, workshops for cutting-edge research
                </p>
                </div>
                <div className="career-card-line" />
                <div className="career-card-row">
                <Image
                src={blueTick}                          
                alt={"Blue Tick Icon"}
                width={20}
                height={20}
                objectFit="cover"/>
                <p className="career-card-description">
                Learn to write robust software in building ML systems
                </p>
                </div>
            </div>
            <div className="career-card">
                <h2 className="career-card-title">Robust Professional Network</h2>
                <div className="career-card-row">
                <Image
                src={darkBlueTick}                          
                alt={"Blue Tick Icon"}
                width={20}
                height={20}
                objectFit="cover"/>
                <p className="career-card-description">
                Collaborate with peers and mentors on diverse ML teams
                </p>
                </div>
                <div className="career-card-line" />
                <div className="career-card-row">
                <Image
                src={darkBlueTick}                          
                alt={"Blue Tick Icon"}
                width={20}
                height={20}
                objectFit="cover"/>
                <p className="career-card-description">
                Network with professors, students in academic events
                </p>
                </div>
                <div className="career-card-line" />
                <div className="career-card-row">
                <Image
                src={darkBlueTick}                          
                alt={"Blue Tick Icon"}
                width={20}
                height={20}
                objectFit="cover"/>
                <p className="career-card-description">
                Engage with industry professionals in talks and workshops                </p>
                </div>
            </div>
        </div>
        <div className="open-positions-container">
        <h1 className="open-positions-title">Open Positions</h1>
        
            {positions.map((position, index) => (
    <div key={index}>
        <div className="position-card">
        <div className="position-info">
            <h2 className="position-title">{position.title}</h2>
            <div className="position-details">
            <span>{position.department}</span>
            <span className="dot">•</span>
            <span>{position.division}</span>
            </div>
        </div>
        <a href="https://docs.google.com/presentation/d/1ylgg5QJmUHto21qrKtv4MsO7T63JWUrp_gxQTNIstY0/edit?slide=id.g2ee8a5c0378_0_0#slide=id.g2ee8a5c0378_0_0" className="apply-button" >Apply Now</a>
        </div>
    </div>
    ))}

    </div>
    </main>
  }