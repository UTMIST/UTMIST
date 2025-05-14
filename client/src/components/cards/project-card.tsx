import Image, { StaticImageData } from "next/image";
import githubIcon from "../../assets/logos/github.svg";

enum ProjectType {
    genai = "genai",
    cvpr = "cvpr",
    nlp = "nlp",
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

  export default ProjectCard;