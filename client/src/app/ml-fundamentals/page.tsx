import "@/styles/careers.css"  
// import positionsData from "@/assets/careers.json"
import Image from "next/image"
import blueTick from "@/assets/icons/blue-tick-icon.svg";
import darkBlueTick from "@/assets/icons/dark-blue-tick-icon.svg";
import HeroSection from "@/components/heroSection";
// import {Positions} from "@/types/careers";

export default function MachineLearningFundamentals() {

    return <main>
      <HeroSection title="Machine Learning Fundamentals" subtitle="This is your go-to page for everything related to the Machine Learning Fundamentals (MLF) Program by UTMIST. Find all the essential links in one place—from the IBM platform for notebooks and tools, to lecture recordings and key resources to help you stay on track and succeed throughout the program." />
        <div className="career-section">
            <div className="career-card">
                <h2 className="career-card-title">Gain Technical Skills</h2>
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
                <h2 className="career-card-title">Time and Location</h2>
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
    </main>
  }