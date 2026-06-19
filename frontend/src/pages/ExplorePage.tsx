import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../lib/api";
import ProjectCard from "../components/ProjectCard";
import Chip from "../components/Chip";

const CATEGORIES = [
  "All",
  "Full Stack",
  "WebGL/Graphics",
  "Open Source",
  "Mobile Apps",
  "E-commerce",
  "AI/ML",
];

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["explore-projects", category, debouncedSearch],
    queryFn: () =>
      projectsApi
        .list({
          category: category !== "All" ? category : undefined,
          search: debouncedSearch || undefined,
        })
        .then((r) => r.data),
  });

  return (
    <div>
      <h1 className="text-headline-xl text-on-surface mb-6">Explore Projects</h1>

      <div className="flex w-full bg-surface-container-lowest border border-outline-variant rounded-full overflow-hidden mb-6 max-w-2xl">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none px-5 py-2 text-body-md focus:ring-0 placeholder:text-on-surface-variant outline-none"
          placeholder="Search projects..."
          data-testid="search-input"
        />
        <button className="bg-surface-container-high px-5 border-l border-outline-variant hover:bg-surface-variant transition-colors">
          <span className="material-symbols-outlined text-on-surface">search</span>
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar mb-8">
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            active={category === cat}
            onClick={() => setCategory(cat)}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-spin">
            autorenew
          </span>
        </div>
      )}

      {!isLoading && projects.length === 0 && (
        <p className="text-on-surface-variant text-body-md py-12 text-center" data-testid="no-results">
          검색 결과가 없습니다.
        </p>
      )}

      {!isLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
