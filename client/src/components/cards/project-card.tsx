import Image from "next/image";
import githubIcon from "../../assets/logos/github.svg";
import { Project } from "@/types/projects";


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
          alt={imageAltText}
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
      {
      github && (
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
        </a>
      )}
      <a href={readMoreLink} target="_blank" rel="noopener noreferrer">
        Read More
      </a>
</div>
    );
  };

  export default ProjectCard;