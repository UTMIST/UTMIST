import FrontendLayout from "./(frontend)/layout";
import NotFound from "./(frontend)/not-found";

// Unmatched URLs have no route group, so render the frontend 404 with its
// root layout explicitly. Segment-level notFound() calls still use the
// frontend group's not-found.tsx.
export default function GlobalNotFound() {
  return (
    <FrontendLayout>
      <NotFound />
    </FrontendLayout>
  );
}
