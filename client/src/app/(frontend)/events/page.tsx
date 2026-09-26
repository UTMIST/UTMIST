import EventsPage from "@/features/events/pages/events";
import { evaluateFlag } from "@/shared/lib/server";

export const dynamic = "force-dynamic";

export default async function EventsRoute() {
  const showEigenAI = await evaluateFlag("Eigen-AI-Redesign");

  return <EventsPage showEigenAI={showEigenAI} />;
}
