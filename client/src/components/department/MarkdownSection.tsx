"use client";

import type { Components } from "react-markdown";
import Markdown from "react-markdown";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 text-3xl font-bold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 text-2xl font-semibold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 text-xl font-semibold">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-4 leading-7 text-gray-700">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-2 pl-6 text-gray-700">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      className="font-medium text-[#1E19B1] underline underline-offset-2"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-4 border-gray-300 pl-4 italic text-gray-600">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4 font-mono text-sm">
      {children}
    </pre>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
};

interface MarkdownSectionProps {
  heading?: string;
  content: string;
}

export function MarkdownSection({ heading, content }: MarkdownSectionProps) {
  if (!content.trim()) {
    return null;
  }

  return (
    <section className="w-full">
      {heading?.trim() && (
        <h2 className="mb-4 text-3xl font-semibold">{heading}</h2>
      )}
      <Markdown components={markdownComponents}>{content}</Markdown>
    </section>
  );
}
