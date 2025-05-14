'use client';
import "@/styles/projects.css";
import { useRef, useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import projectsData from "@/assets/projects.json";
import githubIcon from "@/assets/logos/github.svg";
import dummy from "@/assets/photos/fibseq.png";
import ProjectCard from "@/components/cards/project-card";

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
          className=" flex overflow-x-auto py-4 no-scrollbar scroll-smooth"
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
