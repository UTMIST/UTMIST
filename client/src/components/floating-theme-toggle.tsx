"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import "../styles/floating-theme-toggle.css";

export function FloatingThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="floating-theme-toggle"
      style={{
        borderColor: 'var(--border)',
        color: 'var(--foreground)',
        backgroundColor: 'var(--background)'
      }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="floating-theme-toggle-icon" />
      ) : (
        <Sun className="floating-theme-toggle-icon" />
      )}
    </button>
  );
}