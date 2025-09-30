import HeroSection from "@/components/heroSection";
import Image from 'next/image';
import { Positions } from "@/types/careers";
import positionsData from "@/assets/careers.json";
import blueTick from "@/assets/icons/blue-tick-icon.svg";
import darkBlueTick from "@/assets/icons/dark-blue-tick-icon.svg";

export default function CareersPage() {

    const positions: Positions[] = positionsData;

    return <main>
      <HeroSection title="Careers" subtitle="Help shape the future of AI and ML at UTMIST" />
        <div className="w-4/5 max-w-[1100px] p-8 flex flex-col md:flex-row items-center justify-center text-left mx-auto md:p-4 sm:w-full sm:p-2">
            <div className="border border-[var(--gray1)] mx-4 md:mx-0 md:mb-4 sm:w-full sm:mx-0 sm:mb-4 p-4 md:px-4 text-center rounded-[15px] w-[700px]">
                <h2 className="text-2xl md:text-[1.1rem] sm:text-base font-bold [background:var(--gradient-bl1)] bg-clip-text [-webkit-text-fill-color:transparent] font-[var(--system-font)] mb-2">Hands on ML Experience</h2>
                <div className="flex flex-row justify-start items-center">
                    <Image
                        src={blueTick}
                        alt={"Blue Tick Icon"}
                        width={20}
                        height={20}
                        objectFit="cover"/>
                    <p className="pl-4 text-[0.85rem] md:text-[0.95rem] font-extralight text-gray-900 font-[var(--system-font)]">
                        Build impactful projects using AI and ML
                    </p>
                </div>
                <div className="w-full h-px bg-[var(--gray1)] my-4 rounded-full" />
                <div className="flex flex-row justify-start items-center">
                    <Image
                        src={blueTick}
                        alt={"Blue Tick Icon"}
                        width={20}
                        height={20}
                        objectFit="cover"/>
                    <p className="pl-4 text-[0.85rem] md:text-[0.95rem] font-extralight text-gray-900 font-[var(--system-font)]">
                        Join study groups, workshops for cutting-edge research
                    </p>
                </div>
                <div className="w-full h-px bg-[var(--gray1)] my-4 rounded-full" />
                <div className="flex flex-row justify-start items-center">
                    <Image
                        src={blueTick}
                        alt={"Blue Tick Icon"}
                        width={20}
                        height={20}
                        objectFit="cover"/>
                    <p className="pl-4 text-[0.85rem] md:text-[0.95rem] font-extralight text-gray-900 font-[var(--system-font)]">
                        Learn to write robust software in building ML systems
                    </p>
                </div>
            </div>
            <div className="border border-[var(--gray1)] mx-4 md:mx-0 md:mb-4 sm:w-full sm:mx-0 sm:mb-4 p-4 md:px-4 text-center rounded-[15px] w-[700px]">
                <h2 className="text-2xl md:text-[1.1rem] sm:text-base font-bold [background:var(--gradient-bl1)] bg-clip-text [-webkit-text-fill-color:transparent] font-[var(--system-font)] mb-2">Robust Professional Network</h2>
                <div className="flex flex-row justify-start items-center">
                    <Image
                        src={darkBlueTick}
                        alt={"Dark Blue Tick Icon"}
                        width={20}
                        height={20}
                        objectFit="cover"/>
                    <p className="pl-4 text-[0.85rem] md:text-[0.95rem] font-extralight text-gray-900 font-[var(--system-font)]">
                        Collaborate with peers and mentors on diverse ML teams
                    </p>
                </div>
                <div className="w-full h-px bg-[var(--gray1)] my-4 rounded-full" />
                <div className="flex flex-row justify-start items-center">
                    <Image
                        src={darkBlueTick}
                        alt={"Dark Blue Tick Icon"}
                        width={20}
                        height={20}
                        objectFit="cover"/>
                    <p className="pl-4 text-[0.85rem] md:text-[0.95rem] font-extralight text-gray-900 font-[var(--system-font)]">
                        Network with professors, students in academic events
                    </p>
                </div>
                <div className="w-full h-px bg-[var(--gray1)] my-4 rounded-full" />
                <div className="flex flex-row justify-start items-center">
                    <Image
                        src={darkBlueTick}
                        alt={"Dark Blue Tick Icon"}
                        width={20}
                        height={20}
                        objectFit="cover"/>
                    <p className="pl-4 text-[0.85rem] md:text-[0.95rem] font-extralight text-gray-900 font-[var(--system-font)]">
                        Engage with industry professionals in talks and workshops
                    </p>
                </div>
            </div>
        </div>
        <div className="mx-auto max-w-[1000px] py-5 md:max-w-full md:px-2 bg-white">
            <h1 className="text-2xl sm:text-[1.1rem] font-bold mb-5 text-black">Open Positions</h1>

            {/* <h2 className="text-lg font-normal mb-5 text-[#6e6e6e]">
                No Positions are open at this time, come back later!
            </h2> */}

            {positions.map((position, index) => (
                <div key={index}>
                    <div className="flex flex-col md:items-start justify-between items-center p-2.5 md:p-3 border border-[#e1e4e8] rounded-[10px] mb-[15px] bg-white">
                        <div className="flex flex-col md:flex-col md:items-start md:pr-0 md:w-full flex-row justify-between pr-12 flex-grow w-full">
                            <h2 className="text-lg md:text-base font-bold text-black">{position.title}</h2>
                            <div className="flex items-center text-[#6e6e6e] text-sm md:text-[0.95rem] md:mt-1 md:flex-wrap">
                                <span>{position.department}</span>
                                {position.division && (
                                    <>
                                        <span className="mx-2 font-bold">•</span>
                                        <span>{position.division}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <a href={position.applicationLink}
                           className="[background:var(--gradient-b2)] bg-[length:200%_200%] bg-[0%_50%] text-white no-underline inline-flex items-center justify-center border border-white/15 rounded-xl min-h-10 px-5 text-sm md:text-base font-medium cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_10px_rgba(79,70,229,0.14)] transition-[transform_0.15s_ease,box-shadow_0.25s_ease,filter_0.25s_ease,background-position_0.35s_ease] hover:-translate-y-px hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_18px_rgba(79,70,229,0.18)] hover:brightness-[1.02] hover:bg-[100%_50%] md:flex md:w-full md:mt-3 md:min-h-11 md:px-4 md:rounded-xl" target="_blank" rel="noopener noreferrer">Apply Now</a>
                    </div>
                </div>
            ))}
        </div>
    </main>
}