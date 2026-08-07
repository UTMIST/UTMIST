"use client";

import { useMemo, useState } from "react";

import { parseGalleryProjects } from "@/app/admin/departments/projectFields";
import { ProjectCarousel } from "@/components/carousel";
import { resolveGalleryProjects } from "@/utils/projects";

interface ProjectGallerySectionProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  projectsJson?: string;
}

export function ProjectGallerySection({
  title = "Project Gallery",
  subtitle = "Check out our awesome stuff!",
  searchPlaceholder = "Search projects",
  projectsJson = "[]",
}: ProjectGallerySectionProps) {
  const [query, setQuery] = useState("");

  const projects = useMemo(
    () => resolveGalleryProjects(parseGalleryProjects(projectsJson)),
    [projectsJson]
  );

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
  }, [projects, query]);

  return (
    <section className="w-full text-center">
      <h2 className="text-3xl pb-1">{title}</h2>
      <p className="pb-1">{subtitle}</p>
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
