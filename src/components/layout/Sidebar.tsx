import { MovieIcon } from "@/assets";
import { NavLink, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/constants";

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const location = useLocation();

  const getIsActive = (to: string) => {
    const currentPath = location.pathname;
    const currentSearch = location.search;

    if (to === "/" && currentPath === "/") return true;

    if (to.startsWith("/search")) {
      if (currentPath !== "/search") return false;

      const urlParams = new URLSearchParams(currentSearch);
      const currentSort = urlParams.get("sort");

      if (to.includes("popularity.desc"))
        return currentSort === "popularity.desc";
      if (to.includes("vote_average.desc"))
        return currentSort === "vote_average.desc";
      if (to.includes("primary_release_date.desc"))
        return currentSort === "primary_release_date.desc";
    }

    return false;
  };

  return (
    <aside
      className={`
    w-56 shrink-0 flex flex-col h-screen fixed left-0 top-0 glass border-r border-surface-border overflow-hidden z-50
    transition-transform duration-300 ease-in-out
    md:translate-x-0
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
  `}
    >
      {/* Ambient glow top */}
      <div className="absolute -top-20 -left-10 w-40 h-40 bg-brand-primary opacity-10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
              boxShadow: "0 4px 14px rgba(99,102,241,0.5)",
            }}
          >
            <MovieIcon className="w-7 h-7" />
          </div>
          <span className="font-display text-text-primary text-xl tracking-tight">
            MovieHub
          </span>
        </div>

        {/* Close button - visible only on mobile */}
        <button
          onClick={onCloseMobile}
          className="md:hidden text-text-secondary hover:text-text-primary p-2 -mr-2"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        <p className="text-text-muted text-[10px] uppercase tracking-widest px-3 mb-2 mt-1 font-medium">
          MENU
        </p>

        {NAV_ITEMS.map(({ to, label, icon }) => {
          const isActive = getIsActive(to);

          return (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onCloseMobile} // Close mobile menu on navigation
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 overflow-hidden ${
                isActive
                  ? "nav-active text-white shadow-lg shadow-indigo-500/20 bg-indigo-500/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/70"
              }`}
            >
              {/* Active Indicator Bar */}
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-400 to-violet-500 rounded-r-full transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-0 scale-y-0"
                }`}
              />

              <div
                className={`transition-transform duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`}
              >
                {icon}
              </div>

              <span className="relative z-10">{label}</span>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom promo card */}
      <div className="m-3 p-4 rounded-2xl border border-surface-border bg-surface-elevated relative overflow-hidden">
        <div className="absolute inset-0 bg-card-shine pointer-events-none" />
        <p className="text-text-primary text-xs font-semibold mb-1">
          Pro Membership
        </p>
        <p className="text-text-muted text-[11px] leading-relaxed mb-3">
          Unlock watchlists, ratings & more.
        </p>
        <button
          className="w-full py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
          }}
        >
          Upgrade
        </button>
      </div>
    </aside>
  );
}
