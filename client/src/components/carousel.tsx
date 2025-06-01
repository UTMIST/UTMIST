'use client';
// import "@/styles/projects.css";
import { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProjectCard from "@/components/cards/project-card";
import { Project } from "@/types/projects";

export const ProjectCarousel = ({ projects }: { projects: Project[] }) => {
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
      <div className="relative w-[80%] max-w-[1000px] mx-auto px-8 py-8 overflow-visible">
        {/* Left fade gradient */}
        {showLeftArrow && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white/90 to-transparent"></div>
        )}
  
        {/* Left Navigation Button */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
            aria-label="Previous projects"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}
  
        {/* Carousel Content */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto py-4 items-center justify-start scroll-smooth no-scrollbar gap-6"
          onScroll={checkArrows}
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {projects.map((project, index) => (
            <div key={index} className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
  
        {/* Right fade gradient */}
        {showRightArrow && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white/90 to-transparent"></div>
        )}
  
        {/* Right Navigation Button */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
            aria-label="Next projects"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>
    );
  };
