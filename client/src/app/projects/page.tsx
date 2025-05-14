'use client';
import "@/styles/projects.css";
import { useRef, useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import projectsData from "@/assets/projects.json";
import githubIcon from "@/assets/logos/github.svg";
import dummy from "@/assets/photos/fibseq.png";

enum ProjectType {
    genai = "genai",
    cvpr = "cvpr",
    finml = "finml",
    medai = "medai",
    supvlr = "supvlr",
    mlops = "mlops",
    aiapps = "aiapps",
  }

interface Project {
  title: string;
  description: string;
  github?: string;
  image: StaticImageData;
  imageAltText?: string;
  type: ProjectType;
  readMoreLink: string;
}


const ProjectCard: React.FC<Project> = ({
    title,
    description,
    github,
    image,
    readMoreLink,
    imageAltText = "Project Image",
  }) => {
    return (
        <div key={title} className="project-card max-w-[320px] w-full mx-auto">
        <div className="project-card-image">
        <Image
          src={image}
          alt={title}
          width={400}
          height={200}
          objectFit="cover"
          className="project-image"
        />
      </div>
      <div>
        <h2 className="project-card-title">{title}</h2>
        <p className="project-card-description">{description}</p>
      </div>
      {github && (
        <a
          href={github}
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
    );
  };


  const ProjectCarousel = ({ projects }: { projects: Project[] }) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
  
    const scroll = (direction: "left" | "right") => {
      if (carouselRef.current) {
        const scrollAmount = direction === "left" ? -300 : 300;
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    };
  
    const checkArrows = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };
  
    useEffect(() => {
      const carousel = carouselRef.current;
      if (carousel) {
        carousel.addEventListener("scroll", checkArrows);
        checkArrows();
        return () => carousel.removeEventListener("scroll", checkArrows);
      }
    }, []);
  
    return (
      <div className="carousel-container relative px-2 lg:px-6 my-8">
        {/* Left fade gradient */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        )}
  
        {/* Left Navigation Button */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
            aria-label="Previous projects"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}
  
        {/* Carousel Content */}
        <div
          ref={carouselRef}
          className="carousel-content flex overflow-x-auto py-4 no-scrollbar scroll-smooth"
          onScroll={checkArrows}
        >
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
  
        {/* Right fade gradient */}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        )}
  
        {/* Right Navigation Button */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
            aria-label="Next projects"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>
    );
  };

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
        type: projectTypeMap[project.type] ?? ProjectType.genai, // fallback
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
      const filteredProjects = projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return (
        <main>
        <div className="hero-section">
          <h2 className="hero-title">Projects</h2>
          <p className="hero-subtitle">
            See the work of the engineers, researchers and pioneers of ML advancements
          </p>
        </div>

      {/* Project Sections with Carousels */}
      {Object.entries(ProjectType).map(([key, type]) => {
        const typeProjects = projects.filter((project) => project.type === type);
        if (typeProjects.length === 0) return null;     
        return (
          <div key={type} className="mb-16">
            <div className={`project-section-container ${gradientClassMap[type]}`}>
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
            <div key={index} className="project-card max-w-[320px] w-full mx-auto">
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
    )
}

