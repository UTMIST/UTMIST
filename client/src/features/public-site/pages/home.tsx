import HeroCard from "@/features/public-site/components/cards/hero-card";
import Image from "next/image";
import utmistLogo from "@/assets/logos/utmist-logo-large.svg";
import execPhoto from "@/assets/photos/eigenai-exec-photo.webp";
import copresPhoto from "@/assets/photos/eigenai-copres-speech.webp";
import Sponsors from "@/features/public-site/components/sponsors";
import OrganizationImpact from "@/features/public-site/components/organization-impact";
import { readHomeImpact } from "@/features/public-site/lib/home-impact";
import Events from "@/features/public-site/components/events";
import ValueProps from "@/features/public-site/components/valueprops";
import StartupsSection from "@/features/public-site/components/startupsSection";
import FAQ from "@/features/public-site/components/faq";
import { Button } from "@/shared/ui";
import Link from "next/link";

export default async function Home() {
  const impact = await readHomeImpact();
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
            <Button asChild variant="default" size="lg">
              <Link href="/careers">Join Us</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="mailto:utorontomist@gmail.com">Contact Us</Link>
            </Button>
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
      <OrganizationImpact content={impact} />

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
            description="Our mission is to empower students of all skill levels and experiences to foster their passion and accelerate their careers in Artificial Intelligence and Machine Learning. Through workshops, conferences, hackathons, and numerous other initiatives, we aim to provide the best opportunities for UofT students in this field."
          />
        </div>
      </section>

      <Events />
      <ValueProps />
      <StartupsSection />
      <FAQ />
    </main>
  );
}
