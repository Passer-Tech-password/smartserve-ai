

// File: lib/useThemePersistence.ts
"use client";
import React from "react";
export function useThemePersistence() {
const [theme, setTheme] = React.useState("light");


React.useEffect(() => {
const saved = localStorage.getItem("theme");
if (saved) {
setTheme(saved);
document.documentElement.classList.toggle("dark", saved === "dark");
}
}, []);


const toggle = () => {
const newTheme = theme === "light" ? "dark" : "light";
setTheme(newTheme);
localStorage.setItem("theme", newTheme);
document.documentElement.classList.toggle("dark", newTheme === "dark");
};


return { theme, toggle };
}

