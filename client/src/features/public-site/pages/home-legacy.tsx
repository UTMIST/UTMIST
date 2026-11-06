import { homeContent } from "@/features/public-site/data/home-content";
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

export default async function LegacyHome() {
  const impact = await readHomeImpact();
  return (
    <main>
      {/*Hero Section */}
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">{homeContent.title}</h2>
          <p className="cta-subtitle">
            {homeContent.subtitle}
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
            description={homeContent.about}
          />
          <div className="hero-line" />
          <HeroCard
            image={copresPhoto}
            title="Our Mission"
            description={homeContent.mission}
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
