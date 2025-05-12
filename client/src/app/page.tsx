import HeroCard from "@/components/hero-card";
import Image from "next/image";

export default function Home() {
  return (
    <div className="hero-container">
        <HeroCard 
        image="/path/to/your/image.jpg"
        title="Who We Are"
        description="At UTMIST, we produce in-house academic content, spearhead design teams to collaborate on machine learning and infrastructure projects, and host annual milestone events, empowering our members to become the next generation of engineers, researchers, and leaders in AI/ML."
      />
      <div className= "hero-line" />
      <HeroCard 
        image="/path/to/your/image.jpg"
        title="Our Mission"
        description="At UTMIST, we produce in-house academic content, spearhead design teams to collaborate on machine learning and infrastructure projects, and host annual milestone events, empowering our members to become the next generation of engineers, researchers, and leaders in AI/ML."
      />
    </div>
  );
}
