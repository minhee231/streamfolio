import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../lib/api";
import ProjectCard from "../components/ProjectCard";
import Chip from "../components/Chip";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "All",
  "Full Stack",
  "WebGL/Graphics",
  "Open Source",
  "Mobile Apps",
  "E-commerce",
  "AI/ML",
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", activeCategory],
    queryFn: () =>
      projectsApi
        .list(activeCategory !== "All" ? { category: activeCategory } : undefined)
        .then((r) => r.data),
  });

  const featured = projects.find((p) => p.is_featured) ?? projects[0];
  const grid = projects.filter((p) => p !== featured);

  return (
    <div>
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-spin">
            autorenew
          </span>
        </div>
      )}

      {!isLoading && featured && (
        <section
          className="relative group mb-12 rounded-xl overflow-hidden shadow-2xl bg-surface-container-low cursor-pointer"
          onClick={() => navigate(`/projects/${featured.id}`)}
        >
          <div className="video-aspect relative w-full overflow-hidden">
            {featured.thumbnail_url ? (
              <img
                src={featured.thumbnail_url}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-container">
                <span className="material-symbols-outlined text-8xl text-on-surface-variant">
                  movie
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-black/20" />
            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full lg:w-2/3">
              <div className="inline-flex items-center gap-2 bg-primary-container text-on-primary px-3 py-1 rounded-md text-label-sm uppercase tracking-widest mb-4">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                Featured Project
              </div>
              <h1 className="text-headline-xl text-on-surface mb-3 drop-shadow-lg">
                {featured.title}
              </h1>
              <p className="text-body-md text-on-surface-variant mb-6 line-clamp-3 max-w-xl">
                {featured.description}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="bg-primary-container text-on-primary px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/projects/${featured.id}`);
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                  View Project
                </button>
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-surface-container-high relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-2/3 bg-primary-container shadow-[0_0_8px_rgba(255,85,64,0.8)]" />
          </div>
        </section>
      )}

      <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar mb-8">
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      <div>
        <h2 className="text-headline-lg text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">recommend</span>
          Recommended Projects
        </h2>

        {!isLoading && projects.length === 0 && (
          <p className="text-on-surface-variant text-body-md py-12 text-center" data-testid="empty-state">
            아직 등록된 프로젝트가 없습니다.
          </p>
        )}

        {grid.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
            {grid.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
