import { MoonIcon, SearchIcon, SunIcon, XIcon } from "@/assets"; // Make sure you have MenuIcon (hamburger)
import { useSearch } from "@/contexts/SearchContext";
import { useRef } from "react";
import { MenuIconSolid } from "../ui/MenuIcon";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  theme: "dark" | "light";
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({
  isDark,
  onToggleTheme,
  toggleMobileMenu,
}: HeaderProps) {
  const { inputValue, setInputValue, clearSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 glass white-glassmorphism border-b border-surface-border sticky top-0 z-30">
      {/* Hamburger Menu - Mobile Only */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Toggle menu"
      >
        <MenuIconSolid className="w-6 h-6" />
      </button>

      {/* Search Bar - Takes most space */}
      <div className="flex-1 max-w-lg md:max-w-2xl">
        <div className="relative group">
          <SearchIcon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4
          text-text-muted group-focus-within:text-brand-primary
          transition-colors pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search movies, genres, directors..."
            className="w-full bg-surface-elevated border border-surface-border text-text-primary placeholder:text-text-muted text-sm rounded-xl pl-10 pr-4 py-2.5 transition-all duration-200 focus:outline-none focus:border-brand-primary focus:shadow-glow"
            onFocus={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(99,102,241,0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {inputValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Clear search"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Button */}
      <button
        onClick={() => {
          /* open filters modal or navigate to /search */
        }}
        className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 whitespace-nowrap"
        style={{
          background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
          boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
        }}
      >
        Filters
      </button>
      {/* ── Theme toggle ── */}
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-surface-border bg-surface-elevated hover:bg-surface-card text-text-secondary hover:text-text-primary transition-all duration-200 active:scale-95 shrink-0"
      >
        {/* Sun icon — shown in dark mode */}
        <SunIcon
          className={`absolute w-7 h-7 transition-all duration-300 ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}
        />

        {/* Moon icon — shown in light mode */}
        <MoonIcon
          className={`absolute w-4.5 h-4.5 transition-all duration-300 ${!isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}
        />
      </button>
    </header>
  );
}
