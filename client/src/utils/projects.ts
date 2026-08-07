import projectsData from "@/assets/projects.json";
import type { GalleryProject } from "@/app/admin/departments/projectFields";
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

type RawProject = {
  name?: string;
  description?: string;
  github?: string;
  type?: string;
  readMoreLink?: string;
};

export function getProjectImageSrc(project: Pick<Project, "title" | "image">): string {
  if (typeof project.image === "string") {
    const image = project.image.trim();
    if (image && (image.startsWith("/") || image.startsWith("http"))) {
      return image;
    }
  }

  return `/project_images/${encodeURIComponent(project.title)}.png`;
}

export function isExternalProjectImageSrc(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

export function buildProjectsFromJson(): Project[] {
  return (projectsData as RawProject[]).map((project) => ({
    title: project.name || "Untitled Project",
    description: project.description || "No description available.",
    github: project.github || undefined,
    image: getProjectImageSrc({
      title: project.name || "Untitled Project",
      image: "",
    }),
    imageAltText: project.name || "Project Image",
    type: projectTypeMap[project.type ?? ""] ?? ProjectType.genai,
    readMoreLink: project.readMoreLink || "#",
  }));
}

export function mapGalleryProjectToProject(project: GalleryProject): Project {
  const title = project.title.trim() || "Untitled Project";

  return {
    title,
    description: project.description.trim() || "No description available.",
    github: project.github.trim() || undefined,
    image: getProjectImageSrc({
      title,
      image: project.image.trim(),
    }),
    imageAltText: title,
    type: ProjectType.genai,
    readMoreLink: project.readMoreLink.trim() || "#",
  };
}

export function resolveGalleryProjects(customProjects: GalleryProject[]): Project[] {
  const projects = customProjects
    .filter((project) => project.title.trim() || project.description.trim())
    .map(mapGalleryProjectToProject);

  return projects.length > 0 ? projects : buildProjectsFromJson();
}
