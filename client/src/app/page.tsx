import HeroCard from "@/components/cards/hero-card";
import Image from "next/image";
import plusIcon from "@/assets/icons/plus-icon.svg";
import utmistLogo from "@/assets/logos/utmist-logo-large.svg"; 
import execPhoto from "@/assets/photos/eigenai-exec-photo.png";
import copresPhoto from "@/assets/photos/eigenai-copres-speech.png";
import Sponsors from "@/components/sponsors";
import Statistics from "@/components/stats";
import Events from "@/components/events";
import ValueProps from "@/components/valueprops";

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
      <p className="text-4xl font-bold text-center max-w-3xl text-black">
        UTMIST is Canada&apos;s largest student-lead organization for Artificial Intelligence and Machine Learning
      </p>
      <Statistics/>
      </div>

      {/*Who We Are / Mission Section */}
      <section id="about-us">
      <div  className="hero-container">
        <HeroCard 
        image={execPhoto}
        title="Who We Are"
        description="At UTMIST, we produce in-house academic content, spearhead design teams to collaborate on machine learning and infrastructure projects, and host annual milestone events, empowering our members to become the next generation of engineers, researchers, and leaders in AI/ML."
      />
      <div className= "hero-line" />
      <HeroCard 
        image={copresPhoto}
        title="Our Mission"
        description="At UTMIST, we produce in-house academic content, spearhead design teams to collaborate on machine learning and infrastructure projects, and host annual milestone events, empowering our members to become the next generation of engineers, researchers, and leaders in AI/ML."
      />
    </div> 
      </section>

    {/*Events Section */}
    <Events />

    <div className="flex flex-col gap-8 justify-center items-center my-16">

    <p className="text-4xl font-bold text-center max-w-3xl text-black">
    We bring together students, experts, and innovators to explore AI from every angle</p>
      </div>

      <ValueProps/>

      <div className="faq-section">
          <h2 className="faq-title">Have Questions?</h2>
          <h2 className="faq-title">UTMIST Has Answers</h2>
      </div>
      <div className="faq-container">
      <div className="faq-row">
          <h2 className="faq-row-title">How do I join UTMIST?</h2>
          <Image
            src={plusIcon}
            alt="Plus Icon"
            width={20}
            height={20}
            priority
          />
          </div>
          <div className="faq-row">
          <h2 className="faq-row-title">I don&apos;t know ML, can I still join UTMIST?</h2>
          <Image
            src={plusIcon}
            alt="Plus Icon"
            width={20}
            height={20}
            priority
          />
          </div>
          <div className="faq-row">
          <h2 className="faq-row-title">How do I start a project?</h2>
          <Image
            src={plusIcon}
            alt="Plus Icon"
            width={20}
            height={20}
            priority
          />
          </div>
          <div className="faq-row">
          <h2 className="faq-row-title">What resources do UTMIST members have access to?</h2>
          <Image
            src={plusIcon}
            alt="Plus Icon"
            width={20}
            height={20}
            priority
          />
          </div>
          <div className="faq-row">
          <h2 className="faq-row-title">
        What are the events that UTMIST hosts?
          </h2>
          <Image
            src={plusIcon}
            alt="Plus Icon"
            width={20}
            height={20}
            priority
          />
          </div>
      </div>
      <div className="faq-tail-section">
      <h2 className="faq-subtitle">More Questions? Reach Out To Us</h2>
      </div>
    </main>

  );
}
