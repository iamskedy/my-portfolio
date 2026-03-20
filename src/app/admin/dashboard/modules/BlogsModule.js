"use client";
import { useState, useEffect } from "react";

export default function BlogsModule() {
  const initialFormState = { title: "", desc: "", tags: "", content: "" };
  const [formData, setFormData] = useState(initialFormState);
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState("Publish Blog");
  const [editingId, setEditingId] = useState(null);

  // 1. Fetch all blogs on load
  const loadBlogs = () => {
    fetch("/api/portfolio?section=blogs")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setBlogs(json.data);
      });
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // 2. Handle Create OR Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    const generatedSlug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const payload = {
      ...formData,
      slug: generatedSlug,
      tags:
        typeof formData.tags === "string"
          ? formData.tags.split(",").map((t) => t.trim())
          : formData.tags,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    const method = editingId ? "PUT" : "POST";
    const bodyData = editingId
      ? { section: "blogs", id: editingId, data: payload }
      : { section: "blogs", data: payload };

    const res = await fetch("/api/portfolio", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (res.ok) {
      setStatus(editingId ? "Blog Updated!" : "Blog Published!");
      setFormData(initialFormState);
      setEditingId(null);
      loadBlogs(); // Refresh the list
      setTimeout(() => setStatus("Publish Blog"), 2000);
    }
  };

  // 3. Handle Edit Button Click
  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      desc: blog.desc,
      tags: blog.tags.join(", "),
      content: blog.content,
    });
    setEditingId(blog._id);
    setStatus("Update Blog");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll back to form
  };

  // 4. Handle Delete Button Click
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    const res = await fetch(`/api/portfolio?section=blogs&id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) loadBlogs(); // Refresh the list
  };

  const cancelEdit = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setStatus("Publish Blog");
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="section-header">
        <span>{editingId ? "Edit Blog" : "Write New Blog"}</span>
        {editingId && (
          <button
            onClick={cancelEdit}
            className="text-[0.7rem] text-[#ff4d4d] tracking-[1px] uppercase border border-[#ff4d4d] px-3 py-1 ml-4 hover:bg-[#ff4d4d] hover:text-white transition-all"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* --- THE FORM --- */}
      <form onSubmit={handleSubmit} className="mb-16">
        <div className="form-group">
          <label>Blog Title</label>
          <input
            className="admin-input"
            placeholder="e.g. Mastering PostgreSQL Indexing"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Tags (Comma Separated)</label>
          <input
            className="admin-input"
            placeholder="Database, Optimization, Backend"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Short Description (Hero section of blog)</label>
          <textarea
            className="admin-textarea"
            rows="2"
            placeholder="A brief summary of what this article covers..."
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Full Blog Content (HTML Supported)</label>
          <textarea
            className="admin-textarea"
            rows="12"
            placeholder="<h3>Introduction</h3><p>Let's dive in...</p>"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="admin-btn"
          style={{
            background:
              status.includes("Published") || status.includes("Updated")
                ? "#4CAF50"
                : "",
            borderColor:
              status.includes("Published") || status.includes("Updated")
                ? "#4CAF50"
                : "",
          }}
        >
          {status}
        </button>
      </form>

      {/* --- EXISTING BLOGS LIST --- */}
      <div className="section-header">
        <span>Manage Published Blogs</span>
      </div>
      <div className="space-y-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="p-5 border border-[var(--border-color)] bg-[var(--input-bg)] flex justify-between items-center group"
          >
            <div>
              <h4 className="text-[1.1rem] font-light text-[var(--text-main)] mb-1">
                {blog.title}
              </h4>
              <p className="text-[0.7rem] text-[var(--text-muted)] tracking-[1px] uppercase">
                {blog.date} | /{blog.slug}
              </p>
            </div>
            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(blog)}
                className="text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="text-[var(--text-muted)] hover:text-[#ff4d4d] transition-colors"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <p className="text-[var(--text-muted)] text-[0.9rem]">
            No blogs found.
          </p>
        )}
      </div>
    </div>
  );
}
