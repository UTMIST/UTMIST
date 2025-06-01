import Link from "next/link";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const StartupsPage = () => {
  return (
    <main>
      <section>
        {/* Hero Component */}
        <div className="flex flex-col gap-4 text-center">
          <h1 className={`${roboto.className} font-bold text-4xl`}>
            Innovation @ UTMIST
          </h1>
          <p className="text-lg m-0 leading-snug text-center">
            <span className="block ">
              Help build AI startups with Canada's largest student-led
            </span>
            <span className="block ">
              organization for Artificial Intelligence and Machine
            </span>
            <span className="block ">Learning</span>
          </p>
          <div>
            <Link
              href="/apply"
              className="bg-gradient-to-r from-indigo-400 to-blue-800 text-white px-12 py-1 rounded-full text-lg font-medium shadow mx-auto"
            >
              Apply
            </Link>
            <p className="text-xs text-gray-500 text-center mt-2">
              <span className="block">Applications close</span>
              <span className="block">Sept 31st</span>
            </p>
          </div>
        </div>
      </section>
      <section>{/* Startups Information */}</section>
      <div>
        <div>
          <section>{/* Investors slider with article cards */}</section>
        </div>
        <div>
          <section>{/* Guess Speakers slider with article cards */}</section>
        </div>
      </div>
    </main>
  );
};

export default StartupsPage;
