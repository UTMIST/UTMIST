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
      className="
        relative
        w-[320px] h-[500px]
        sm:w-[320px] sm:h-[500px]
        xs:w-[200px] xs:h-[340px]
        rounded-[13px] p-8 bg-white border border-gray-200 overflow-hidden
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        hover:-translate-y-1 hover:shadow-lg cursor-pointer
      "
    >
      <div className="mb-4 rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={imageAltText}
          width={400}
          height={200}
          style={{ objectFit: "cover" }}
          className="w-full h-[200px] object-cover rounded-lg"
        />
      </div>
      <div>
        <h2 className="text-gray-900 text-xl font-bold font-space-grotesk mt-2 mb-2 leading-6">
          {title}
        </h2>
        <p className="text-gray-500 text-sm leading-4 font-system font-normal">
          {description}
        </p>
      </div>
      {github && (
        <a
          href={github}
          className="inline-flex items-center gap-2 text-gray-900 no-underline font-system font-medium text-sm mt-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={githubIcon}
            alt="GitHub Icon"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        </a>
      )}
      <a
        href={readMoreLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 text-indigo-700 hover:underline font-medium text-sm"
      >
        Read More
      </a>
    </div>
  );
};

export default ProjectCard;