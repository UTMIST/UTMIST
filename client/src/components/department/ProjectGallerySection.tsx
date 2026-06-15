"use client";

import { useMemo, useState } from "react";

import { ProjectCarousel } from "@/components/carousel";
import dummy from "@/assets/photos/fibseq.webp";
import projectsData from "@/assets/projects.json";
import type { Project } from "@/types/projects";
import { ProjectType } from "@/types/projects";

const projectTypeMap: Record<string, ProjectType> = {
  genai: ProjectType.genai,
  cvpr: ProjectType.cvpr,
  finml: ProjectType.finml,
  medai: ProjectType.medai,
  supvlr: ProjectType.supvlr,
  mlops: ProjectType.mlops,
  aiapps: ProjectType.aiapps,
};

const projects: Project[] = projectsData.map((project) => ({
  title: project.name || "Untitled Project",
  description: project.description || "No description available.",
  github: project.github || undefined,
  image: dummy,
  imageAltText: project.name || "Project Image",
  type: projectTypeMap[project.type] ?? ProjectType.genai,
  readMoreLink: project.readMoreLink || "#",
}));

interface ProjectGallerySectionProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
}

export function ProjectGallerySection({
  title = "Project Gallery",
  subtitle = "Check out our awesome stuff!",
  searchPlaceholder = "Search projects",
}: ProjectGallerySectionProps) {
  const [query, setQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return projects;
    }

    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(normalizedQuery) ||
        project.description.toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  return (
    <section className="w-full text-center">
      <h2 className="text-4xl">{title}</h2>
      <p>{subtitle}</p>
      <input
        className="mt-2 w-90 rounded-4xl border-2 p-3"
        type="search"
        value={query}
        placeholder={searchPlaceholder}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ProjectCarousel projects={filteredProjects} />
    </section>
  );
}
