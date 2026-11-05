import { isWebRedesignEnabled } from "@/shared/lib/server";
import LegacyHome from "@/features/public-site/pages/home-legacy";
import RedesignedHome from "@/features/public-site/pages/home-redesign";

export default async function Home() {
  return (await isWebRedesignEnabled()) ? RedesignedHome() : LegacyHome();
}
