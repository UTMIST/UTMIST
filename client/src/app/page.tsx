import HeroCard from "@/components/cards/hero-card";
import Image from "next/image";
import utmistLogo from "@/assets/logos/utmist-logo-large.svg";
import execPhoto from "@/assets/photos/eigenai-exec-photo.webp";
import copresPhoto from "@/assets/photos/eigenai-copres-speech.webp";
import Sponsors from "@/components/sponsors";
import Statistics from "@/components/stats";
import Events from "@/components/events";
import ValueProps from "@/components/valueprops";
import FAQ from "@/components/faq";
import Link from "next/link"; // Import Link from next/link

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
            <Link href="/careers" className="primary-button">
              Join Us
            </Link>
            <Link
              href="mailto:utorontomist@gmail.com"
              className="secondary-button"
            >
              Contact Us
            </Link>
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
        <div className="cta-big-title">UTMIST</div>
      </div>

      {/*Sponsors Section */}
      <Sponsors />

      {/*Statistics Section */}
      <div className="flex flex-col gap-8 justify-center items-center my-16">
        <p className="text-4xl font-bold text-center max-w-3xl text-black px-8 md:px-0">
          UTMIST is Canada&apos;s largest student-lead organization for
          Artificial Intelligence and Machine Learning
        </p>
        <Statistics />
      </div>

      {/*Who We Are / Mission Section */}
      <section id="about-us">
        <div className="hero-container">
          <HeroCard
            image={execPhoto}
            title="Who We Are"
            description="At UTMIST, we produce in-house academic content, spearhead design teams to collaborate on machine learning and infrastructure projects, and host annual milestone events, empowering our members to become the next generation of engineers, researchers, and leaders in AI/ML."
          />
          <div className="hero-line" />
          <HeroCard
            image={copresPhoto}
            title="Our Mission"
            description="Our mission is to empower students of all skill levels and experiences to foster their passion and accelerate their career in Artificial Intelligence and Machine Learning. Through workshops, conference, hackthons and many other initiatives, we hope to provide the best oppurtunities to UofT students in this field."
          />
        </div>
      </section>

      {/*Events Section */}
      <Events />

      <div className="flex flex-col gap-8 justify-center items-center my-16">
        <p className="text-4xl font-bold text-center max-w-3xl text-black">
          We bring together students, experts, and innovators to explore AI from
          every angle
        </p>
      </div>

      <ValueProps />

      <FAQ />
    </main>
  );
}
