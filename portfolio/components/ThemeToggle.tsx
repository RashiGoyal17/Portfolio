"use client";

import { useEffect, useRef, useState } from "react";

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("theme") === "light";
}

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(getInitialTheme);
  const didApplyInitial = useRef(false);

  useEffect(() => {
    if (didApplyInitial.current) return;
    didApplyInitial.current = true;
    document.documentElement.classList.toggle("light", isLight);
    document.documentElement.classList.toggle("dark", !isLight);
  }, [isLight]);

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    document.documentElement.classList.toggle("dark", !next);
    window.localStorage.setItem("theme", next ? "light" : "dark");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground hover:border-accent transition-colors"
    >
      {isLight ? "Dark" : "Light"}
    </button>
  );
}
