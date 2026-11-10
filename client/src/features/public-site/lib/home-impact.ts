import "server-only";
import { readHomePage } from "@/features/public-site/lib/home-page";

/** Both homepage variants use the page's impact section, with one publication workflow. */
export async function readHomeImpact() {
  return (await readHomePage()).impact;
}
