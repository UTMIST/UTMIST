import "@/styles/careers.css"  
import positionsData from "@/assets/careers.json"
import Image from "next/image"
import blueTick from "@/assets/icons/blue-tick-icon.svg";
import darkBlueTick from "@/assets/icons/dark-blue-tick-icon.svg";
import HeroSection from "@/components/heroSection";
import {Positions} from "@/types/careers";

export default function CareersPage() {

    return <main>
      <HeroSection title="Careers" subtitle="Help shape the future of AI and ML at UTMIST" />
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
        <h2
          className="open-positions-subtitle"
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#555',
            fontSize: '1.1rem',
            letterSpacing: '0.01em',
            lineHeight: 1.5
          }}
        >
          There are no open positions at the moment. Please check back later!
        </h2>
        
    </div>
    </main>
  }