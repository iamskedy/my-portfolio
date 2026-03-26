"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProjectTabs({ projects }) {
  const [activeTab, setActiveTab] = useState("All");
  
  const tabs = ["All", "AI", "Cloud", "Full Stack"];

  const filteredProjects = activeTab === "All" 
    ? projects 
    : projects.filter((proj) => proj.category === activeTab);

  return (
    <>
      {/* Filter Tabs */}
      <div className="project-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filtered Projects */}
      <div>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((proj) => (
            <div 
              className="work-item" 
              key={proj._id}
              style={{ animation: 'fadeInScale 0.5s ease forwards' }}
            >
              <div className="work-grid">
                <Link href={`/works/${proj._id}`} className="project-img-wrapper">
                  <div className="view-btn">VIEW</div>
                  <img src={proj.thumbnail} alt={proj.title} />
                </Link>
                <div className="work-info">
                  <div className="index">{proj.index}</div>
                  <h3>{proj.title}</h3>
                  <h4>{proj.subtitle}</h4>
                  <p dangerouslySetInnerHTML={{ __html: proj.overview }}></p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "var(--text-muted)" }}>No projects found in this category.</p>
        )}
      </div>
    </>
  );
}