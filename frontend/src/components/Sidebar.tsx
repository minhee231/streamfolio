import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", icon: "home", label: "Home", fill: true },
  { to: "/explore", icon: "video_library", label: "Projects" },
  { to: "/about", icon: "person", label: "About" },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-sidebar-width flex-col p-2 overflow-y-auto bg-background hidden md:flex">
      <nav className="space-y-1">
        {navItems.map(({ to, icon, label, fill }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-lg px-3 py-3 transition-all ${
                isActive
                  ? "bg-surface-container-highest text-on-surface font-bold"
                  : "text-on-surface hover:bg-surface-container"
              }`
            }
          >
            <span
              className="material-symbols-outlined"
              style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="text-label-md">{label}</span>
          </NavLink>
        ))}
        <hr className="my-3 border-outline-variant opacity-20" />
        <div className="px-3 py-2 text-label-sm uppercase tracking-wider text-on-surface-variant">
          Stack
        </div>
        {[
          { label: "TypeScript", abbr: "TS", colorClass: "text-primary" },
          { label: "React", abbr: "R", colorClass: "text-secondary" },
          { label: "FastAPI", abbr: "F", colorClass: "text-tertiary" },
        ].map(({ label, abbr, colorClass }) => (
          <div
            key={label}
            className="flex items-center gap-4 text-on-surface hover:bg-surface-container rounded-lg px-3 py-2 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className={`text-[10px] font-bold ${colorClass}`}>{abbr}</span>
            </div>
            <span className="text-label-md">{label}</span>
          </div>
        ))}
      </nav>
      <footer className="mt-auto pt-6 pb-4 px-3">
        <p className="text-[10px] text-on-surface-variant/60">
          © 2024 Streamfolio. All rights reserved.
        </p>
      </footer>
    </aside>
  );
}
