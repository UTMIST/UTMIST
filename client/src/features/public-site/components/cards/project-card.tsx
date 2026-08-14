"use client";

import { useState } from "react";
import Image from "next/image";
import githubIcon from "@/assets/logos/github.svg";
import { Project } from "@/features/public-site/types/projects";
import ProjectModal from "@/features/public-site/components/project-modal";

const ProjectCard: React.FC<Project> = (project) => {
  const {
    title,
    description,
    github,
    imageAltText = "Project Image",
  } = project;
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="relative w-full max-w-[360px] rounded-[13px] p-3 sm:p-6 md:p-8 bg-[var(--card)] border border-[var(--border)] overflow-hidden flex flex-col text-left transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      >
        <div className="mb-2 sm:mb-4 rounded-lg overflow-hidden w-full">
          <Image
            src={`/project_images/${encodeURIComponent(title)}.png`}
            alt={imageAltText}
            width={400}
            height={200}
            style={{ objectFit: "cover" }}
            className="w-full aspect-[16/9] object-cover rounded-lg"
          />
        </div>
        <div>
          <h2 className="font-bold font-sans mt-1 mb-1 leading-5 text-[var(--card-foreground)] text-sm sm:text-base md:text-xl">
            {title}
          </h2>
          <p className="text-[var(--muted-foreground)] font-sans font-normal text-xs sm:text-sm md:text-base leading-5 overflow-hidden line-clamp-3 sm:line-clamp-3 md:line-clamp-4">
            {description}
          </p>
        </div>
        <div className="hidden sm:inline-flex items-center gap-2 text-[var(--foreground)] font-sans font-medium text-xs sm:text-sm mt-2">
          {github && (
            <Image
              src={githubIcon}
              alt=""
              width={20}
              height={20}
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          )}
          <span>Read More</span>
        </div>
      </button>

      {open && (
        <ProjectModal project={project} onClose={() => setOpen(false)} />
      )}
    </>
  );
};

export default ProjectCard;
