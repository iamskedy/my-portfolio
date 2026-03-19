"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const [theme, setTheme] = useState("dark");
  const router = useRouter();

  // Handle Theme Toggle (mapping your HTML logic)
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

  const handleLogout = () => {
    // In Phase 2 we set a cookie; here we could clear it or just redirect
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-main)] transition-colors duration-500">
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

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <nav className="w-full md:w-[250px] md:fixed h-auto md:h-screen p-[40px] border-b md:border-b-0 md:border-r border-[var(--border-color)] flex flex-col z-[100]">
          <ul className="flex flex-row md:flex-col flex-wrap gap-[20px] md:gap-[30px] flex-grow text-[0.8rem] tracking-[2px] uppercase text-[var(--text-muted)]">
            <li
              className="cursor-pointer hover:text-[var(--text-main)]"
              onClick={() => router.push("/admin/dashboard")}
            >
              Overview
            </li>
            <li
              className="cursor-pointer hover:text-[var(--text-main)]"
              onClick={() => router.push("/admin/dashboard/about")}
            >
              About
            </li>
            <li
              className="cursor-pointer hover:text-[var(--text-main)]"
              onClick={() => router.push("/admin/dashboard/skills")}
            >
              Skills
            </li>
            <li
              className="cursor-pointer hover:text-[var(--text-main)]"
              onClick={() => router.push("/admin/dashboard/works")}
            >
              Works
            </li>
            <li
              className="cursor-pointer hover:text-[var(--text-main)]"
              onClick={() => router.push("/admin/dashboard/blogs")}
            >
              Blogs
            </li>
          </ul>
          <div
            onClick={handleLogout}
            className="mt-auto pt-10 text-[0.8rem] tracking-[2px] text-[#ff4d4d] cursor-pointer uppercase"
          >
            Logout
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow md:ml-[250px] p-[40px] md:p-[85px_8vw_100px_6vw]">
          {children}
        </main>
      </div>
    </div>
  );
}
