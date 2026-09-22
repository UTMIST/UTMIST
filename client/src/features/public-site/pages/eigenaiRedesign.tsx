"use client";

// src/features/public-site/pages/eigenaiRedesign.tsx
//
// Placeholder for the approved EigenAI redesign (#445). It exists so the
// flag selector (`eigenaiFlagged.tsx`) can be built and tested against a real
// "on" branch while the design is in progress; the finished UI + content is
// composed here in the integration task (#444/#446). Styling is scoped to the
// `.eigenai-redesign` wrapper so nothing leaks into the existing page, and it
// deliberately has no Google Maps dependency.

export default function EigenAIRedesign() {
  return (
    <main
      data-testid="eigenai-redesign"
      className="eigenai-redesign flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <h1 className="text-4xl font-bold">EigenAI</h1>
      <p className="max-w-prose text-lg opacity-80">
        The redesigned EigenAI experience is coming soon.
      </p>
    </main>
  );
}
