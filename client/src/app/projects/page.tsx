import "@/styles/projects.css"  
import Image, { StaticImageData } from "next/image";
import { Search } from "lucide-react";
import github from "@/assets/logos/github.svg";
import dummy from "@/assets/photos/fibseq.png"
enum ProjectType {
    genai = "Generative AI",
    cvpr = "Computer Vision and Pattern Recognition",
    nlp = "Natural Language Processing",
    medai = "Medical AI",
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
    image,
    readMoreLink,
    imageAltText = "Project Image",
  }) => {
    return (

      <div className="card-border-wrapper">
        <div className="max-w-xs w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-5 bg-white relative">
            <div className="bg-gray-200 h-48 w-full rounded-lg mb-4 flex items-center justify-center border border-gray-300">
              {image ? (
                <Image
                  src={image}
                  alt={imageAltText}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-500 text-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm">Image Placeholder</p>
                </div>
              )}
            </div>
  
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 leading-tight">
              {title}
            </h2>
            <a
              href={readMoreLink}
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors duration-150 ease-in-out"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    );
  };

export default function ProjectsPage() {

    const projects: Project[] = [
        {
            title: "Computer Vision",
            description: "Canada's largest student-lead organization for Artificial Intelligence and Machine Learning",
            github: "https://github.com/utmist",
            image: dummy,
            type: ProjectType.cvpr,
            readMoreLink: "https://github.com/utmist",
        },
        {
            title: "Natural Language Processing",
            description: "Canada's largest student-lead organization for Artificial Intelligence and Machine Learning",
            github: "https://github.com/utmist",
            image: dummy,
            type: ProjectType.genai,
            readMoreLink: "https://github.com/utmist",
        },
        {
            title: "Reinforcement Learning",
            description: "Canada's largest student-lead organization for Artificial Intelligence and Machine Learning",
            github: "https://github.com/utmist",
            image: dummy,
            type: ProjectType.genai,
            readMoreLink: "https://github.com/utmist",
        }
    ];


    const gradientClassMap: Record<ProjectType, string> = {
        [ProjectType.cvpr]: "gradient-cvpr",
        [ProjectType.nlp]: "gradient-nlp",
        [ProjectType.genai]: "gradient-genai",
        [ProjectType.medai]: "gradient-medai",
      };
    
    return (
        <main>
        <div className="hero-section">
          <h2 className="hero-title">Projects</h2>
          <p className="hero-subtitle">
            See the work of the engineers, researchers and pioneers of ML advancements
          </p>
        </div>
  
        {Object.entries(ProjectType).map(([key, type]) => {
        const filteredProjects = projects.filter((project) => project.type === type);
        if (filteredProjects.length === 0) return null;
          return (
            <div key={type}>
              <div className={`project-section-container ${gradientClassMap[type]}`}>
                <h2 className="project-section-title">{type}</h2>
                <p className="projects-section-subtitle">
                  Explore the projects that our members have worked on.
                </p>
              </div>
              <div className="projects-grid">
                {filteredProjects.map((project, index) => (
                  <div key={index} className="project-card">
                    <div className="project-card-image">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={400}
                        height={200}
                        objectFit="cover"
                        className="project-image"
                      />
                    </div>
                    <div>
                      <h2 className="project-card-title">{project.title}</h2>
                      <p className="project-card-description">{project.description}</p>
                    </div>
                    {project.github && (
                      <a
                        href={project.github}
                        className="github-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={github}
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
        />
        <Search className="search-icon" />
      </div>
      <div className="px-10 sm:px-16 lg:px-24 xl:px-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-8">
      {projects.map((card, index) => (
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
                        src={github}
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

