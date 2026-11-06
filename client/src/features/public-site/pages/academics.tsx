import { isWebRedesignEnabled } from "@/shared/lib/server";
import LegacyAcademics from "@/features/public-site/pages/ml-fundamentals";
import AcademicsRedesign from "@/features/public-site/pages/academics-redesign";

export default async function Academics() {
  return (await isWebRedesignEnabled()) ? <AcademicsRedesign /> : <LegacyAcademics />;
}
