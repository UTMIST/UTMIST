import { isWebRedesignEnabled } from "@/shared/lib/server";
import LegacyAcademics from "@/features/public-site/pages/ml-fundamentals";
import AcademicsRedesign from "@/features/public-site/pages/academics-redesign";
import { readAcademics } from "@/features/public-site/lib/academics";

export default async function Academics() {
  if (!(await isWebRedesignEnabled())) return <LegacyAcademics />;
  return <AcademicsRedesign content={await readAcademics()} />;
}
