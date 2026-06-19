import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

export default function TopNav() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore${search.trim() ? `?search=${encodeURIComponent(search)}` : ""}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-background">
      <div className="flex items-center gap-4">
        <NavLink to="/" className="flex items-center gap-1 text-headline-lg font-bold text-on-surface">
          <span
            className="material-symbols-outlined text-primary-container text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            play_circle
          </span>
          <span>Streamfolio</span>
        </NavLink>
      </div>

      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-10">
        <div className="flex w-full bg-surface-container-lowest border border-outline-variant rounded-full overflow-hidden">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none px-5 py-2 text-body-md focus:ring-0 placeholder:text-on-surface-variant outline-none"
            placeholder="Search projects..."
          />
          <button
            type="submit"
            className="bg-surface-container-high px-5 border-l border-outline-variant hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">search</span>
          </button>
        </div>
      </form>

      <div className="flex items-center gap-3">
        <NavLink
          to="/admin/signin"
          className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          title="Admin"
        >
          <span className="material-symbols-outlined text-on-surface">settings</span>
        </NavLink>
      </div>
    </header>
  );
}
