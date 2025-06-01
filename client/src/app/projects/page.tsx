"use client";
import "@/styles/projects.css";
import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import projectsData from "@/assets/projects.json";
import githubIcon from "@/assets/logos/github.svg";
import dummy from "@/assets/photos/fibseq.webp";
import { ProjectCarousel } from "@/components/carousel";
import { ProjectType, Project } from "@/types/projects";

export default function ProjectsPage() {
  const displayNames: Record<ProjectType, string> = {
    genai: "Generative AI",
    cvpr: "Computer Vision and Pattern Recognition",
    finml: "Financial Machine Learning",
    medai: "Medical AI",
    supvlr: "Supervised Learning",
    mlops: "MLOps",
    aiapps: "AI Applications",
  };

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

  const gradientClassMap: Record<ProjectType, string> = {
    [ProjectType.cvpr]: "gradient-cvpr",
    [ProjectType.finml]: "gradient-finml",
    [ProjectType.genai]: "gradient-genai",
    [ProjectType.medai]: "gradient-medai",
    [ProjectType.supvlr]: "gradient-supvlr",
    [ProjectType.mlops]: "gradient-mlops",
    [ProjectType.aiapps]: "gradient-aiapps",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <div className="hero-section">
        <h2 className="hero-title">Projects</h2>
        <p className="hero-subtitle">
          See the work of the engineers, researchers and pioneers of ML
          advancements
        </p>
      </div>

      {/* Project Sections with Carousels */}
      {Object.entries(ProjectType).map(([key, type]) => {
        const typeProjects = projects.filter(
          (project) => project.type === type
        );
        if (typeProjects.length === 0) return null;
        return (
          <div key={key} className="mb-16">
            <div
              className={`project-section-container ${gradientClassMap[type]}`}
            >
              <h2 className="project-section-title">{displayNames[type]}</h2>
              <p className="projects-section-subtitle">
                Explore the projects that our members have worked on.
              </p>
            </div>

            <ProjectCarousel projects={typeProjects} />
          </div>
        );
      })}

      <section className="project-gallery-container">
        <h2 className="project-gallery-title">See All Projects</h2>
        <p className="project-gallery-subtitle">
          Browse all of our AI and ML projects developed by our students
        </p>

        <div className="search-bar-container mb-10">
          <input
            type="text"
            className="search-bar-input"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="search-icon" />
        </div>

        <div className="px-10 sm:px-16 lg:px-24 xl:px-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-8">
          {filteredProjects.map((card, index) => (
            <div
              key={index}
              className="project-card max-w-[320px] w-full mx-auto"
            >
              <div className="project-card-image">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={400}
                  height={200}
                  objectFit="cover"
                  className="project-image"
                />
              </div>
              <div>
                <h2 className="project-card-title">{card.title}</h2>
                <p className="project-card-description">{card.description}</p>
              </div>
              {card.github && (
                <a
                  href={card.github}
                  className="github-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={githubIcon}
                    alt="GitHub Icon"
                    width={20}
                    height={20}
                    className="github-icon"
                  />
                  Read More
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
