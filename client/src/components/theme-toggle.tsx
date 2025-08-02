"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
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
      className="inline-flex items-center justify-center w-9 h-9 rounded-md border bg-transparent transition-colors duration-200 hover:opacity-80 group"
      style={{
        borderColor: 'var(--border)',
        color: 'var(--foreground)',
        backgroundColor: 'var(--background)'
      }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 transition-colors duration-200 group-hover:text-yellow-400" />
      ) : (
        <Sun className="h-4 w-4 transition-colors duration-200 group-hover:text-yellow-400" />
      )}
    </button>
  );
}