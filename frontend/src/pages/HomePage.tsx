import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../lib/api";
import ProjectCard from "../components/ProjectCard";
import Chip from "../components/Chip";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "All",
  "LLM / RAG",
  "Backend / LLM",
  "MLOps / Infra",
  "MLOps",
  "ML / Recommendation",
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
      {/* Profile Hero */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 p-6 rounded-2xl bg-surface-container border border-white/5">
        <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 border-2 border-primary">
          <span className="material-symbols-outlined text-4xl text-primary">smart_toy</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-3 mb-1">
            <h1 className="text-headline-lg text-on-surface font-bold">김이삭 (Isaac Kim)</h1>
            <span className="text-body-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full">AI Engineer · 5년차</span>
          </div>
          <p className="text-body-sm text-on-surface-variant mb-3">
            LLM / RAG 파이프라인 · vLLM 서빙 최적화 · MLOps 자동화 · FastAPI 백엔드
          </p>
          <div className="flex flex-wrap gap-3 text-body-sm">
            <a href="mailto:isaac.kim.ai@gmail.com" className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-base">mail</span>
              isaac.kim.ai@gmail.com
            </a>
            <a href="https://github.com/isaac-kim-ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-base">code</span>
              github.com/isaac-kim-ai
            </a>
            <a href="https://isaac-ai.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-base">language</span>
              isaac-ai.dev
            </a>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col gap-3 sm:gap-2 text-right flex-shrink-0">
          {[
            { icon: "work", stat: "5년", label: "경력" },
            { icon: "psychology", stat: "RAG · vLLM", label: "전문분야" },
            { icon: "military_tech", stat: "AI 해커톤", label: "대상" },
          ].map(({ icon, stat, label }) => (
            <div key={label} className="flex items-center gap-2 sm:justify-end">
              <span className="material-symbols-outlined text-primary text-base">{icon}</span>
              <span className="text-body-sm text-on-surface font-medium">{stat}</span>
              <span className="text-body-sm text-on-surface-variant hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
      </section>
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
