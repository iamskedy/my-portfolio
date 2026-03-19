"use client";
import { useState } from "react";

export default function WorksModule() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    tools: "",
    summary: "",
  });
  const [status, setStatus] = useState("Add Project");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    // Split comma strings into arrays for the backend
    const payload = {
      ...formData,
      tools_used: formData.tools.split(",").map((t) => t.trim()),
    };
    await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "projects", data: payload }),
    });
    setStatus("Project Published!");
    setFormData({ title: "", subtitle: "", tools: "", summary: "" });
    setTimeout(() => setStatus("Add Project"), 2000);
  };

  return (
    <div className="admin-view active">
      <div className="section-header">
        <span>Add New Project</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            className="admin-input"
            placeholder="Project Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <input
            className="admin-input"
            placeholder="Subtitle (e.g. Fintech App)"
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
          />
        </div>
        <input
          className="admin-input"
          placeholder="Tools Used (comma separated)"
          value={formData.tools}
          onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
        />
        <textarea
          className="admin-textarea"
          placeholder="Project Summary"
          rows="4"
          value={formData.summary}
          onChange={(e) =>
            setFormData({ ...formData, summary: e.target.value })
          }
        />
        <button type="submit" className="admin-btn">
          {status}
        </button>
      </form>
    </div>
  );
}
