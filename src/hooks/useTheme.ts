import {
    createContext,
    createElement,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "moviehub-theme";

function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "dark";

    try {
        // 1. Honour stored preference
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
        if (stored === "dark" || stored === "light") return stored;
    } catch {
        return "dark";
    }

    // 2. Fall back to OS preference
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    // Apply class to <html> whenever theme changes
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "light") {
            root.classList.add("light");
            root.classList.remove("dark");
        } else {
            root.classList.remove("light");
            root.classList.add("dark");
        }
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // Theme still applies for the current session if persistence is unavailable.
        }
    }, [theme]);

    const toggleTheme = useCallback(
        () => setTheme((t) => (t === "dark" ? "light" : "dark")),
        []
    );

    const value = useMemo(
        () => ({ theme, toggleTheme, isDark: theme === "dark" }),
        [theme, toggleTheme]
    );

    return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }

    return context;
}
