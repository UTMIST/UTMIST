"use client";

import "@/styles/eigenai.css";
import {
  eigenAIContent,
  eigenAITicketUrl,
} from "@/features/public-site/data/eigenai-redesign";

export default function EigenAIPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 md:px-8">
      <header className="hero-section">
        <h1 className="hero-title">Eigen AI 2026</h1>
        <p className="hero-subtitle">
          Saturday October 3, 2026 and Sunday October 4, 2026 · EST
        </p>
        <a
          className="mt-6 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white"
          href={eigenAITicketUrl}
          target="_blank"
          rel="noreferrer"
        >
          Get tickets
        </a>
      </header>

      <section className="rounded-2xl border p-6">
        <h2 className="intro-section-title">OISE</h2>
        <address className="not-italic">
          252 Bloor St W, Toronto, ON M5S 1V6, Canada
        </address>
        <a
          className="mt-4 inline-block underline"
          href="https://www.google.com/maps/search/?api=1&query=OISE%2C252%20Bloor%20St%20W%2CToronto%2C%20ON%20M5S%201V6%2C%20Canada"
          target="_blank"
          rel="noreferrer"
        >
          Get directions
        </a>
      </section>

      <section aria-labelledby="schedule-heading">
        <h2 id="schedule-heading" className="schedule-section-title">
          Schedule
        </h2>
        <div className="grid gap-8 lg:grid-cols-2">
          {eigenAIContent.schedule.map((day) => (
            <section key={day.day} className="rounded-2xl border p-5">
              <h3 className="mb-4 text-xl font-semibold">
                {day.day} · {day.date}
              </h3>
              <ol className="space-y-4">
                {day.items.map((item) => (
                  <li key={`${day.day}-${item.time}-${item.title}`} className="border-l-2 pl-4">
                    <p className="font-semibold">{item.time}</p>
                    <p>{item.title}</p>
                    {item.location ? <p className="text-sm opacity-75">{item.location}</p> : null}
                    {item.description ? (
                      <p className="text-sm italic opacity-75">{item.description}</p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
