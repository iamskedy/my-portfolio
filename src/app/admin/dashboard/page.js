"use client";
import { useState, useEffect } from "react";
import AboutModule from "./modules/AboutModule";
import SkillsModule from "./modules/SkillsModule";
import WorksModule from "./modules/WorksModule";
import BlogsModule from "./modules/BlogsModule";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [stats, setStats] = useState({ projects: 0, blogs: 0, skills: 0 });

  useEffect(() => {
    // Fetch real stats from the API we built earlier
    async function fetchStats() {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (data.success) setStats(data.stats);
    }
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--bg-color)] text-[var(--text-main)]">
      {/* Sidebar - Exactly matching your HTML sidebar */}
      <nav className="sidebar">
        <ul className="nav-links">
          <li
            className={activeTab === "home" ? "active" : ""}
            onClick={() => setActiveTab("home")}
          >
            Overview
          </li>
          <li
            className={activeTab === "about" ? "active" : ""}
            onClick={() => setActiveTab("about")}
          >
            About
          </li>
          <li
            className={activeTab === "skills" ? "active" : ""}
            onClick={() => setActiveTab("skills")}
          >
            Skills
          </li>
          <li
            className={activeTab === "works" ? "active" : ""}
            onClick={() => setActiveTab("works")}
          >
            Works
          </li>
          <li
            className={activeTab === "blogs" ? "active" : ""}
            onClick={() => setActiveTab("blogs")}
          >
            Blogs
          </li>
        </ul>
        <div
          className="logout-btn"
          onClick={() => (window.location.href = "/admin/login")}
        >
          <i className="fas fa-sign-out-alt"></i> Logout
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === "home" && (
          <div className="animate-in fade-in duration-500">
            <div className="section-header">
              <span>Dashboard Overview</span>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>TOTAL PROJECTS</h3>
                <div className="value">
                  {stats.projects.toString().padStart(2, "0")}
                </div>
              </div>
              <div className="stat-card">
                <h3>PUBLISHED BLOGS</h3>
                <div className="value">
                  {stats.blogs.toString().padStart(2, "0")}
                </div>
              </div>
              <div className="stat-card">
                <h3>SKILLS LISTED</h3>
                <div className="value">
                  {stats.skills.toString().padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modular Views */}
        {activeTab === "about" && <AboutModule />}
        {activeTab === "skills" && <SkillsModule />}
        {activeTab === "works" && <WorksModule />}
        {activeTab === "blogs" && <BlogsModule />}
      </main>
    </div>
  );
}
