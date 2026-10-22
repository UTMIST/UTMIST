import OrganizationIntro from "@/features/public-site/components/organization-intro";
import Statistics from "@/features/public-site/components/stats";
import type { HomeImpactContent } from "@/features/public-site/data/home-impact";

export default function OrganizationImpact({ content }: { content: HomeImpactContent }) {
  return (
    <section className="flex flex-col gap-8 justify-center items-center my-16">
      <OrganizationIntro heading={content.heading} description={content.description} />
      <Statistics items={content.statistics} />
    </section>
  );
}
