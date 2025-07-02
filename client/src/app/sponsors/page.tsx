import "@/styles/sponsors.css";
import sponsorData from "@/assets/sponsors.json";
import SponsorCard from "@/components/cards/sponsor-card";
import ContactUsCard from "@/components/cards/contact-us-card";
import HeroSection from "@/components/heroSection";

export default function SponsorsPage() {
  return (
    <main>
      <HeroSection title="Let&rsquo;s Work Together" subtitle="Support UTMIST and gain exclusive access to Canada&rsquo;s top student
          talent, networking opportunities, and nationwide visibility through
          events, hackathons, and workshops." 
      />
      <div className="sponsor-us-section">
        <h2 className="sponsor-us-title">Sponsor Us</h2>
        <div className="sponsor-us-container">
          {sponsorData.map((tier) => (
            <SponsorCard
              key={tier.category}
              category={tier.category}
              price={tier.price}
              perks={tier.perks}
            />
          ))}
        </div>
      </div>
      <section id="contact-us">
        <ContactUsCard />
      </section>
    </main>
  );
}
