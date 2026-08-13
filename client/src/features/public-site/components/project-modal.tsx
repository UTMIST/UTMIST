"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import githubIcon from "@/assets/logos/github.svg";
import { Project } from "@/features/public-site/types/projects";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  if (!project || typeof document === "undefined") return null;

  const {
    title,
    description,
    longDescription,
    github,
    readMoreLink,
    imageAltText = title,
    teamMembers,
    tools,
    year,
  } = project;

  const externalLink = readMoreLink && readMoreLink !== "#" ? readMoreLink : undefined;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} details`}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[var(--card)] text-[var(--card-foreground)] rounded-[15px] border border-[var(--border)] shadow-2xl overflow-hidden my-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-3 right-3 z-10 rounded-full p-2 bg-[var(--background)]/80 text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--accent)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative w-full aspect-[16/9] bg-[var(--muted)]">
          <Image
            src={`/project_images/${encodeURIComponent(title)}.png`}
            alt={imageAltText}
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl leading-tight">
              {title}
            </h2>
            {year && (
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{year}</p>
            )}
          </div>

          <p className="font-sans text-sm sm:text-base text-[var(--muted-foreground)] whitespace-pre-line">
            {longDescription || description}
          </p>

          {teamMembers && teamMembers.length > 0 && (
            <div>
              <h3 className="font-sans font-semibold text-sm uppercase tracking-wide text-[var(--foreground)] mb-2">
                Team
              </h3>
              <p className="font-sans text-sm text-[var(--muted-foreground)]">
                {teamMembers.join(", ")}
              </p>
            </div>
          )}

          {tools && tools.length > 0 && (
            <div>
              <h3 className="font-sans font-semibold text-sm uppercase tracking-wide text-[var(--foreground)] mb-2">
                Tools & Frameworks
              </h3>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-block rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--foreground)]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(github || externalLink) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--foreground)] text-[var(--background)] px-4 py-2 text-sm font-medium no-underline hover:opacity-90 transition-opacity"
                >
                  <Image
                    src={githubIcon}
                    alt=""
                    width={18}
                    height={18}
                    className="invert"
                  />
                  View on GitHub
                </a>
              )}
              {externalLink && (
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] no-underline hover:bg-[var(--accent)] transition-colors"
                >
                  Learn more
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;
