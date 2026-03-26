"use client";
import { useState, useEffect } from "react";

export default function WorksModule() {
  const initialFormState = {
    title: "",
    subtitle: "",
    category: "Full Stack", // <-- ADDED: Default category
    thumbnail: "",
    tools: "",
    overview: "",
    content: "",
    index: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("Publish Project");
  const [editingId, setEditingId] = useState(null);

  // 1. Load Projects from MongoDB
  const loadProjects = () => {
    fetch("/api/portfolio?section=projects")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setProjects(json.data);
      });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // 2. Handle Create OR Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    const payload = {
      ...formData,
      // Ensure tools is stored as an array in DB
      tools:
        typeof formData.tools === "string"
          ? formData.tools
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t !== "")
          : formData.tools,
    };

    const method = editingId ? "PUT" : "POST";
    const bodyData = editingId
      ? { section: "projects", id: editingId, data: payload }
      : { section: "projects", data: payload };

    const res = await fetch("/api/portfolio", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (res.ok) {
      setStatus(editingId ? "Project Updated!" : "Project Published!");
      setFormData(initialFormState);
      setEditingId(null);
      loadProjects();
      setTimeout(() => setStatus("Publish Project"), 2000);
    }
  };

  // 3. Set Form for Editing
  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      subtitle: project.subtitle,
      category: project.category || "Full Stack", // <-- ADDED: Populate category
      thumbnail: project.thumbnail || "",
      tools: project.tools ? project.tools.join(", ") : "",
      overview: project.overview,
      content: project.content || "",
      index: project.index || "",
    });
    setEditingId(project._id);
    setStatus("Update Project");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 4. Handle Deletion
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const res = await fetch(`/api/portfolio?section=projects&id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) loadProjects();
  };

  const cancelEdit = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setStatus("Publish Project");
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="section-header flex justify-between items-center mb-8 pb-4 border-b border-[var(--border-color)]">
        <span className="uppercase tracking-[1px] font-light text-[1.05rem]">
          {editingId ? "Edit Project" : "Add New Project"}
        </span>
        {editingId && (
          <button
            onClick={cancelEdit}
            className="text-[0.7rem] text-[#ff4d4d] tracking-[1px] uppercase border border-[#ff4d4d] px-3 py-1 ml-4 hover:bg-[#ff4d4d] hover:text-white transition-all rounded-full cursor-pointer"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-16">
        {/* Row 1: Added Category Select */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
          <div className="form-group mb-6">
            <label className="block text-[0.8rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-2">
              Project Title
            </label>
            <input
              className="admin-input w-full bg-transparent border border-[var(--border-color)] text-[var(--text-main)] p-3 outline-none"
              placeholder="e.g. Healthcare API"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group mb-6">
            <label className="block text-[0.8rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-2">
              Subtitle / Role
            </label>
            <input
              className="admin-input w-full bg-transparent border border-[var(--border-color)] text-[var(--text-main)] p-3 outline-none"
              placeholder="e.g. Backend Microservices"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group mb-6">
            <label className="block text-[0.8rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-2">
              Category
            </label>
            <select
              className="admin-input w-full bg-transparent border border-[var(--border-color)] text-[var(--text-main)] p-3 outline-none appearance-none"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option className="bg-[#1a1a1a] text-white" value="Full Stack">
                Full Stack
              </option>
              <option className="bg-[#1a1a1a] text-white" value="AI">
                AI
              </option>
              <option className="bg-[#1a1a1a] text-white" value="Cloud">
                Cloud
              </option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
          <div className="form-group mb-6">
            <label className="block text-[0.8rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-2">
              Index (e.g. 01, 02)
            </label>
            <input
              className="admin-input w-full bg-transparent border border-[var(--border-color)] text-[var(--text-main)] p-3 outline-none"
              placeholder="01"
              value={formData.index}
              onChange={(e) =>
                setFormData({ ...formData, index: e.target.value })
              }
            />
          </div>
          <div className="form-group md:col-span-2 mb-6">
            <label className="block text-[0.8rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-2">
              Thumbnail Image URL
            </label>
            <input
              className="admin-input w-full bg-transparent border border-[var(--border-color)] text-[var(--text-main)] p-3 outline-none"
              placeholder="/img/project1.jpg"
              value={formData.thumbnail}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-group mb-6">
          <label className="block text-[0.8rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-2">
            Tools Used (Comma Separated)
          </label>
          <input
            className="admin-input w-full bg-transparent border border-[var(--border-color)] text-[var(--text-main)] p-3 outline-none"
            placeholder="Node.js, PostgreSQL, AWS"
            value={formData.tools}
            onChange={(e) =>
              setFormData({ ...formData, tools: e.target.value })
            }
          />
        </div>

        <div className="form-group mb-6">
          <label className="block text-[0.8rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-2">
            Short Overview
          </label>
          <textarea
            className="admin-textarea w-full bg-transparent border border-[var(--border-color)] text-[var(--text-main)] p-3 outline-none"
            rows="3"
            placeholder="Brief summary for the project card..."
            value={formData.overview}
            onChange={(e) =>
              setFormData({ ...formData, overview: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group mb-8">
          <label className="block text-[0.8rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-2">
            Full Project Details (HTML Supported)
          </label>
          <textarea
            className="admin-textarea w-full bg-transparent border border-[var(--border-color)] text-[var(--text-main)] p-3 outline-none"
            rows="8"
            placeholder="Detailed architectural breakdown..."
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="admin-btn w-full border border-[var(--border-color)] py-3 text-[0.9rem] tracking-[2px] uppercase hover:bg-[var(--text-main)] hover:text-black transition-all cursor-pointer"
          style={{
            background:
              status.includes("Published") || status.includes("Updated")
                ? "#4CAF50"
                : "",
            borderColor:
              status.includes("Published") || status.includes("Updated")
                ? "#4CAF50"
                : "",
            color:
              status.includes("Published") || status.includes("Updated")
                ? "#fff"
                : "",
          }}
        >
          {status}
        </button>
      </form>

      <div className="section-header mb-8 pb-4 border-b border-[var(--border-color)]">
        <span className="uppercase tracking-[1px] font-light text-[1.05rem]">
          Manage Projects
        </span>
      </div>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="p-5 border border-[var(--border-color)] bg-[var(--input-bg)] flex justify-between items-center group"
          >
            <div className="flex items-center gap-6">
              <span className="text-[1.5rem] font-thin text-[var(--text-muted)] opacity-50">
                {project.index || "—"}
              </span>
              <div>
                <h4 className="text-[1.1rem] font-light text-[var(--text-main)] mb-1">
                  {project.title}
                </h4>
                {/* ADDED: Display category next to subtitle in the manage list */}
                <p className="text-[0.7rem] text-[var(--text-muted)] tracking-[1px] uppercase">
                  <span className="text-[var(--text-main)]">
                    {project.category || "Full Stack"}
                  </span>{" "}
                  • {project.subtitle}
                </p>
              </div>
            </div>
            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(project)}
                className="text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={() => handleDelete(project._id)}
                className="text-[var(--text-muted)] hover:text-[#ff4d4d] transition-colors cursor-pointer"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-[var(--text-muted)] text-[0.9rem]">
            No projects found.
          </p>
        )}
      </div>
    </div>
  );
}
