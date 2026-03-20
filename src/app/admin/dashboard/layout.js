"use client";
import { useState, useEffect } from "react";
import CustomCursor from "@/components/CustomCursor";

export default function DashboardLayout({ children }) {
  const [theme, setTheme] = useState("dark");

  // Handle Theme Toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-main)] transition-colors duration-500">
      
      {/* Custom Cursor tracks across the whole dashboard */}
      <CustomCursor />

      {/* Theme Switcher */}
      <div className="fixed top-[30px] right-[40px] z-[1000]">
        <label className="inline-block h-[24px] relative w-[50px] cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={theme === "light"}
            onChange={toggleTheme}
          />
          <div
            className={`absolute inset-0 border border-[var(--text-main)] rounded-[34px] transition-all duration-400 ${theme === "light" ? "bg-transparent" : ""}`}
          >
            <div
              className={`absolute bottom-[3px] left-[4px] h-[16px] w-[16px] rounded-full bg-[var(--text-main)] transition-all duration-400 ${theme === "light" ? "translate-x-[24px]" : ""}`}
            ></div>
          </div>
        </label>
      </div>

      {/* The Dashboard Page (which contains the real SPA sidebar) renders right here */}
      {children}
      
    </div>
  );
}