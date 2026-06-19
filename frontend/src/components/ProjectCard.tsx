import { useNavigate } from "react-router-dom";
import type { Project } from "../types";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const navigate = useNavigate();
  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate(`/projects/${project.id}`)}
      data-testid="project-card"
    >
      <div className="relative video-aspect rounded-xl overflow-hidden bg-surface-container-low mb-3">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">
              movie
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span
            className="material-symbols-outlined text-white text-5xl opacity-80"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            play_arrow
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-on-surface font-semibold text-body-md line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-on-surface-variant text-body-sm mb-0.5">{project.category}</p>
        <div className="flex items-center text-on-surface-variant text-body-sm">
          <span>{project.view_count.toLocaleString()} views</span>
        </div>
      </div>
    </div>
  );
}
