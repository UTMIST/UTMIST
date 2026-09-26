import { EigenGlassSurface } from "@/features/public-site/components/eigenai-surfaces";

const venue = {
  name: "Ontario Institute for Studies in Education (OISE)",
  address: "252 Bloor St W, Toronto, ON",
  query: "OISE, 252 Bloor St W, Toronto, ON",
};

export function EigenAIVenue() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.query)}`;

  return (
    <EigenGlassSurface className="overflow-hidden rounded-4xl sm:rounded-[3.1648rem]">
      <div className="relative z-1 grid md:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.28fr)]">
        <div className="flex flex-col justify-center p-5 sm:p-10">
          <p className="text-xs font-medium tracking-[0.08em] text-[#5edbe7] uppercase sm:text-sm">
            In person
          </p>
          <h3 className="font-eigen-sans mt-1.5 text-xl/tight font-medium! text-white sm:mt-2 sm:text-3xl">
            {venue.name}
          </h3>
          <p className="mt-3 text-xs/relaxed text-white/75 sm:mt-4 sm:text-base">
            {venue.address}
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 w-fit rounded-full border border-white/25 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10 sm:mt-6 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Get directions
          </a>
        </div>

        <div className="min-h-72 border-t border-white/15 bg-[#0c0249]/45 md:min-h-96 md:border-t-0 md:border-l">
          {apiKey ? (
            <iframe
              title="Google Maps preview of the EigenAI venue"
              className="h-full min-h-72 w-full md:min-h-96"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(venue.query)}`}
            />
          ) : (
            <div className="flex h-full min-h-72 items-center justify-center p-8 text-center md:min-h-96">
              <p className="max-w-sm text-sm/relaxed text-white/65">
                Map preview unavailable. Use the directions link to view the
                venue in Google Maps.
              </p>
            </div>
          )}
        </div>
      </div>
    </EigenGlassSurface>
  );
}
