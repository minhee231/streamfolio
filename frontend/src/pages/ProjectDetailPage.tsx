import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../lib/api";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsApi.get(Number(id)).then((r) => r.data),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-spin">
          autorenew
        </span>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-6xl text-error mb-4 block">error</span>
        <p className="text-error text-body-md">프로젝트를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const techs = project.tech_stack.split(",").filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface mb-6 transition-colors"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Back
      </button>

      <div className="rounded-xl overflow-hidden mb-6 video-aspect bg-surface-container-low">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-8xl text-on-surface-variant">movie</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-body-sm">
          {project.category}
        </span>
        {project.is_featured && (
          <span className="bg-primary-container text-on-primary px-3 py-1 rounded-full text-body-sm font-bold">
            Featured
          </span>
        )}
      </div>

      <h1
        className="text-headline-xl text-on-surface mb-4"
        data-testid="project-title"
      >
        {project.title}
      </h1>

      <p className="text-on-surface-variant text-body-md mb-6 leading-relaxed">
        {project.description}
      </p>

      {techs.length > 0 && (
        <div className="mb-6">
          <h2 className="text-headline-lg text-on-surface mb-3">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techs.map((tech) => (
              <span
                key={tech}
                className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-body-sm"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 text-on-surface-variant text-body-sm">
          <span className="material-symbols-outlined text-sm">visibility</span>
          {project.view_count.toLocaleString()} views
        </div>
      </div>

      <div className="flex gap-4">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined">code</span>
            GitHub
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary-container text-on-primary px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined">open_in_new</span>
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
