import HeroCard from "@/components/cards/hero-card";
import Image from "next/image";
import utmistLogo from "@/assets/logos/utmist-logo-large.svg"; 
import execPhoto from "@/assets/photos/eigenai-exec-photo.png";
import Sponsors from "@/components/sponsors";
import Statistics from "@/components/stats";

export default function Home() {
    return (
      <main>
        {/*Hero Section */}
        <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">Clear The MIST</h2>
          <p className="cta-subtitle">
            University of Toronto Machine Intelligence Student Team
          </p>
          <div className="cta-buttons">
            <button className="primary-button">Join Us</button>
            <button className="secondary-button">Contact Us</button>
          </div>
        </div>
        <div className="cta-logo">
          <Image
            src={utmistLogo}
            alt="UTMIST Logo"
            width={500}
            height={500}
            priority
          />
        </div>
        <div className="cta-big-title">
          UTMIST
        </div>
      </div>

      {/*Sponsors Section */}
      <Sponsors />

      {/*Statistics Section */}
      <div className="flex flex-col gap-8 justify-center items-center my-16">
      <p className="text-4xl font-bold text-center max-w-3xl">
        UTMIST is Canada's largest student-lead organization for Artificial Intelligence and Machine Learning
      </p>
      <Statistics/>
      </div>

      {/*Who We Are / Mission Section */}
      <div className="hero-container">
        <HeroCard 
        image={execPhoto}
        title="Who We Are"
        description="At UTMIST, we produce in-house academic content, spearhead design teams to collaborate on machine learning and infrastructure projects, and host annual milestone events, empowering our members to become the next generation of engineers, researchers, and leaders in AI/ML."
      />
      <div className= "hero-line" />
      <HeroCard 
        image={execPhoto}
        title="Our Mission"
        description="At UTMIST, we produce in-house academic content, spearhead design teams to collaborate on machine learning and infrastructure projects, and host annual milestone events, empowering our members to become the next generation of engineers, researchers, and leaders in AI/ML."
      />
    </div> 
    </main>

  );
}
