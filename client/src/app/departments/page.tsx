"use client";
import {MemberList} from "@/components/memberList"
import {InitiativeCard, InitiativeList} from "@/components/initiatives"
import {Initiative, MemberGroup} from "@/types/departments";
import projectsData from "@/assets/projects.json";
import { ProjectCarousel } from "@/components/carousel";
import { ProjectType, Project } from "@/types/projects";
import dummy from "@/assets/photos/fibseq.webp";
import {SearchBar} from "@/app/events/components/search-bar";

const members: MemberGroup[] = [
    {
    role: "Director",
    members: [
            {
                name : "Ambrose Ling",
                bio : "Awesome flavour text lorme ipismdifa ajdn askjdnaklsjdnb lhjkab jhkl bndka bdak jn",
                email : "test@mail.com"
            },
    {
        name : "Ambrose Ling",
        bio : "Awesome flavour text lorme ipismdifa ajdn askjdnaklsjdnb lhjkab jhkl bndka bdak jn",
        email : "test@ail.com"
    }
    ] },
    {
        role: "Developers",
        members: [
            {
                name : "Ambrose Ling",
                bio : "Awesome flavour text lorme ipismdifa ajdn askjdnaklsjdnb lhjkab jhkl bndka bdak jn",
                email : "te3t@mail.com"
            },
            {
                name : "Ambrose Ling",
                bio : "Awesome flavour text lorme ipismdifa ajdn askjdnaklsjdnb lhjkab jhkl bndka bdak jn",
                email : "te1t@ail.com"
            }
        ] }
]

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

const initiatives: Initiative[] = [
    {
        title: "UTMIST Website",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        projectLink: "#",
        image: "file.svg"
    },
    {
        title: "UTMIST Website",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        projectLink: "##",
        image: "file.svg"
    },
    {
        title: "UTMIST Website",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        projectLink: "###",
        image: "file.svg"
    }

]

export default function DepartmentsPage() {
    return (
        <>
            <div className={'w-dvw h-14 bg-[#D9D9D9]  mb-5'}/>
            <div className={'flex flex-col justify-center text-center max-w-4xl gap-1 mt-20 mb-32 mx-auto'}>
                <h1 className={'text-5xl'}>Department of Infrastructure</h1>
                <p>We make the tools that lets UTMIST members be awesome!</p>
            </div>
            <main className={'flex flex-col justify-center text-center max-w-5xl gap-y-15 mt-20 mb-32 mx-auto'}>
                <div className={'flex justify-between text-left '}>
                    <div className={'w-80 pt-20'}>
                        <h1 className={'text-3xl'}>What do we do?</h1>
                        <p className={'w-full'}
                        >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit viverra augue nec ultrices. Vivamus mauris magna, blandit at elementum porta, lacinia vitae lorem. Vestibulum porta ornare venenatis. Quisque malesuada nulla id imperdiet faucibus. Sed rhoncus eleifend mi sed posuere. Integer molestie sed magna sit amet pharetra. Interdum et malesuada fames ac ante ipsum primis in faucibus. </p>
                    </div>
                    <MemberList members={members} />
                </div>
                <InitiativeList
                    initiatives={initiatives} />
                <div >
                    <h1 className={'text-4xl'}>
                        Project Gallery
                    </h1>
                    <p>Check out our awesome stuff!</p>
                    <input className={'border-2 rounded-4xl w-90 mt-2 p-3'}
                           type = {'search'}
                           placeholder = {'Search members'}
                    />
                    <ProjectCarousel projects={projects} />
                </div>
            </main>

            <MemberList members={members} />
           <hr className={"pt-20 pb-20"}/>
            <InitiativeCard
                title={"UTMIST Website"}
                description={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."}
                projectLink={"#"}
                image={"file.svg"}
            />
        </>
    )
}