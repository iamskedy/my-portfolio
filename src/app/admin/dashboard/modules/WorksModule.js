"use client";
import { useState, useEffect } from "react";

export default function WorksModule() {
  const initialFormState = { 
    title: "", 
    subtitle: "", 
    thumbnail: "", 
    tools: "", 
    overview: "", 
    content: "",
    index: "" 
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("Publish Project");
  const [editingId, setEditingId] = useState(null);

  // 1. Load Projects from MongoDB
  const loadProjects = () => {
    fetch("/api/portfolio?section=projects")
      .then(res => res.json())
      .then(json => {
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
      tools: typeof formData.tools === 'string' 
        ? formData.tools.split(",").map(t => t.trim()).filter(t => t !== "") 
        : formData.tools 
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
      thumbnail: project.thumbnail || "",
      tools: project.tools ? project.tools.join(", ") : "",
      overview: project.overview,
      content: project.content || "",
      index: project.index || ""
    });
    setEditingId(project._id);
    setStatus("Update Project");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Handle Deletion
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    const res = await fetch(`/api/portfolio?section=projects&id=${id}`, {
      method: "DELETE"
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
      <div className="section-header">
        <span>{editingId ? "Edit Project" : "Add New Project"}</span>
        {editingId && (
          <button onClick={cancelEdit} className="text-[0.7rem] text-[#ff4d4d] tracking-[1px] uppercase border border-[#ff4d4d] px-3 py-1 ml-4 hover:bg-[#ff4d4d] hover:text-white transition-all">
            Cancel Edit
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div className="form-group">
            <label>Project Title</label>
            <input className="admin-input" placeholder="e.g. Healthcare API" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Subtitle / Role</label>
            <input className="admin-input" placeholder="e.g. Backend Microservices" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
          <div className="form-group">
            <label>Index (e.01, 02)</label>
            <input className="admin-input" placeholder="01" value={formData.index} onChange={e => setFormData({...formData, index: e.target.value})} />
          </div>
          <div className="form-group md:col-span-2">
            <label>Thumbnail Image URL</label>
            <input className="admin-input" placeholder="/img/project1.jpg" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} />
          </div>
        </div>

        <div className="form-group">
          <label>Tools Used (Comma Separated)</label>
          <input className="admin-input" placeholder="Node.js, PostgreSQL, AWS" value={formData.tools} onChange={e => setFormData({...formData, tools: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Short Overview</label>
          <textarea className="admin-textarea" rows="3" placeholder="Brief summary for the project card..." value={formData.overview} onChange={e => setFormData({...formData, overview: e.target.value})} required />
        </div>

        <div className="form-group">
          <label>Full Project Details (HTML Supported)</label>
          <textarea className="admin-textarea" rows="8" placeholder="Detailed architectural breakdown..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
        </div>

        <button type="submit" className="admin-btn" style={{ 
          background: status.includes('Published') || status.includes('Updated') ? '#4CAF50' : '', 
          borderColor: status.includes('Published') || status.includes('Updated') ? '#4CAF50' : '' 
        }}>
          {status}
        </button>
      </form>

      <div className="section-header"><span>Manage Projects</span></div>
      <div className="space-y-4">
        {projects.map(project => (
          <div key={project._id} className="p-5 border border-[var(--border-color)] bg-[var(--input-bg)] flex justify-between items-center group">
            <div className="flex items-center gap-6">
              <span className="text-[1.5rem] font-thin text-[var(--text-muted)] opacity-50">{project.index || "—"}</span>
              <div>
                <h4 className="text-[1.1rem] font-light text-[var(--text-main)] mb-1">{project.title}</h4>
                <p className="text-[0.7rem] text-[var(--text-muted)] tracking-[1px] uppercase">{project.subtitle}</p>
              </div>
            </div>
            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(project)} className="text-[var(--text-muted)] hover:text-white transition-colors">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => handleDelete(project._id)} className="text-[var(--text-muted)] hover:text-[#ff4d4d] transition-colors">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-[var(--text-muted)] text-[0.9rem]">No projects found.</p>}
      </div>
    </div>
  );
}