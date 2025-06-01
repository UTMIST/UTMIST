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
              Help build AI startups with Canada’s largest student-led
            </span>
            <span className="block ">
              organization for Artificial Intelligence and Machine
            </span>
            <span className="block ">Learning</span>
          </p>
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
