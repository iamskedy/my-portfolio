"use client";
import { useState } from "react";

export default function BlogsModule() {
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    short_description: "",
    content: "",
  });
  const [status, setStatus] = useState("Publish Blog");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Publishing...");
    const payload = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()),
    };
    await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "blogs", data: payload }),
    });
    setStatus("Blog Published!");
    setFormData({ title: "", tags: "", short_description: "", content: "" });
    setTimeout(() => setStatus("Publish Blog"), 2000);
  };

  return (
    <div className="admin-view active">
      <div className="section-header">
        <span>Write New Blog</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          className="admin-input"
          placeholder="Blog Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          className="admin-input"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
        <textarea
          className="admin-textarea"
          placeholder="Short Description"
          rows="2"
          value={formData.short_description}
          onChange={(e) =>
            setFormData({ ...formData, short_description: e.target.value })
          }
        />
        <textarea
          className="admin-textarea"
          placeholder="Full Blog Content (Markdown supported)"
          rows="10"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />
        <button type="submit" className="admin-btn">
          {status}
        </button>
      </form>
    </div>
  );
}
