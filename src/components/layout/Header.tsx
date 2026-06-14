import { XIcon } from "@/assets"; // Make sure you have MenuIcon (hamburger)
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
    <header className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 glass border-b border-surface-border sticky top-0 z-30">
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
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-brand-primary transition-colors pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0z"
            />
          </svg>

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
        <svg
          className={`absolute w-4.5 h-4.5 transition-all duration-300 ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z"
          />
        </svg>

        {/* Moon icon — shown in light mode */}
        <svg
          className={`absolute w-4 h-4 transition-all duration-300 ${!isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998z"
          />
        </svg>
      </button>
    </header>
  );
}
