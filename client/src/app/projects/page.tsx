"use client";
// import "@/styles/projects.css";
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
    [ProjectType.cvpr]: "bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400",
    [ProjectType.finml]: "bg-gradient-to-br from-green-400 via-blue-300 to-blue-500",
    [ProjectType.genai]: "bg-gradient-to-br from-yellow-300 via-pink-300 to-pink-500",
    [ProjectType.medai]: "bg-gradient-to-br from-teal-400 via-blue-200 to-blue-500",
    [ProjectType.supvlr]: "bg-gradient-to-br from-indigo-400 via-blue-300 to-blue-500",
    [ProjectType.mlops]: "bg-gradient-to-br from-gray-400 via-blue-300 to-blue-500",
    [ProjectType.aiapps]: "bg-gradient-to-br from-pink-400 via-yellow-300 to-yellow-500",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <div className="flex flex-col justify-center items-center py-16 px-8 max-w-[1000px] mx-auto text-center">
        <h2 className="text-5xl font-bold text-gray-900 font-sans">Projects</h2>
        <p className="text-base font-extralight text-gray-900 font-sans px-[15rem]">
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
              className={`w-4/5 h-[350px] rounded-[15px] max-w-[1000px] px-8 py-8 flex flex-col items-start justify-end text-left mx-auto mb-4 ${gradientClassMap[type]}`}
            >
              <h2 className="text-3xl font-bold text-white font-sans text-left tracking-tight mb-2">{displayNames[type]}</h2>
              <p className="text-lg font-normal text-white font-sans mt-2">Explore the projects that our members have worked on.</p>
            </div>

            <ProjectCarousel projects={typeProjects} />
          </div>
        );
      })}

      <section className="flex flex-col items-center py-16 px-4">
        <h2 className="text-3xl font-bold relative text-center text-gray-900">See All Projects</h2>
        <p className="mt-2 text-base text-[#333] text-center">
          Browse all of our AI and ML projects developed by our students
        </p>

        <div className="mt-8 flex items-center rounded-full px-4 py-2 w-80 max-w-full bg-white border border-gray-200 relative">
          <input
            type="text"
            className="flex-1 border-none outline-none text-base bg-transparent text-black"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-700 w-5 h-5" />
        </div>

        <div className="mt-10 w-full max-w-5xl mx-auto grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 sm:gap-x-10 md:gap-x-14 xl:gap-x-58 2xl:gap-x-64 justify-items-center px-2 sm:px-8 xl:px-32 2xl:px-64">
          {filteredProjects.map((card, index) => (
            <div
              key={index}
              className="
                relative
                w-[130px] h-[170px] sm:w-[220px] sm:h-[320px] md:w-[320px] md:h-[500px]
                rounded-[13px] p-2 sm:p-6 md:p-8 bg-white border border-gray-200 overflow-hidden
                flex flex-col justify-between
                transition-transform duration-300 ease-in-out
                hover:-translate-y-1 hover:shadow-lg cursor-pointer mx-0
              "
            >
              <div className="mb-2 sm:mb-4 rounded-lg overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={400}
                  height={200}
                  style={{ objectFit: "cover" }}
                  className="w-full h-[56px] sm:h-[140px] md:h-[200px] object-cover rounded-lg"
                />
              </div>
              <div>
                <h2 className="font-bold font-sans mt-1 mb-1 leading-5 text-gray-900 text-xs sm:text-base md:text-xl">
                  {card.title}
                </h2>
                <p className="hidden sm:block text-gray-500 font-sans font-normal text-xs sm:text-sm md:text-base leading-4">
                  {card.description}
                </p>
              </div>
              {card.github && (
                <a
                  href={card.github}
                  className="hidden sm:inline-flex items-center gap-2 text-gray-900 no-underline font-sans font-medium text-xs sm:text-sm mt-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={githubIcon}
                    alt="GitHub Icon"
                    width={20}
                    height={20}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span className="hidden sm:inline">Read More</span>
                </a>
              )}
              <a
                href={card.readMoreLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-block mt-2 text-indigo-700 hover:underline font-medium text-sm"
              >
                Read More
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
