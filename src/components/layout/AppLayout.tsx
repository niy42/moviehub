import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 md:ml-56">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          theme={theme}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />

        <main className="flex-1 p-4 md:p-6 overflow-auto h-screen hide-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
