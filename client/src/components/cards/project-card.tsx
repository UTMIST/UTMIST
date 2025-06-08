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
    <div
      key={title}
      className="relative w-[130px] h-[170px] sm:w-[220px] sm:h-[320px] md:w-[320px] md:h-[500px] rounded-[13px] p-2 sm:p-6 md:p-8 bg-white border border-gray-200 overflow-hidden flex flex-col justify-between transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg cursor-pointer mx-5"
    >
      <div className="mb-2 sm:mb-4 rounded-lg overflow-hidden">
        <Image
          src={`/project_images/${encodeURIComponent(title)}.png`}
          alt={imageAltText}
          width={400}
          height={200}
          style={{ objectFit: "cover" }}
          className="w-full h-[56px] sm:h-[140px] md:h-[200px] object-cover rounded-lg"
        />
      </div>
      <div>
        <h2 className="font-bold font-sans mt-1 mb-1 leading-5 text-gray-900 text-xs sm:text-base md:text-xl">
          {title}
        </h2>
        <p className="hidden sm:block text-gray-500 font-sans font-normal text-xs sm:text-sm md:text-base leading-4">
          {description}
        </p>
      </div>
      {github && (
        <a
          href={github}
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
        href={readMoreLink}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-block mt-2 text-indigo-700 hover:underline font-medium text-sm"
      >
        Read More
      </a>
    </div>
  );
};

export default ProjectCard;