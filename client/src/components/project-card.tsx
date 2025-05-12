interface Project {
    title: string;
    description: string;
    link: string;
}

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <div className="project-card">
            <div className="project-card-header">
                <h2 className="project-card-title">{project.title}</h2>
            </div>
            <p className="project-card-description">{project.description}</p>
            <a href={project.link} className="project-card-link">View Project</a>
        </div>
    );
}