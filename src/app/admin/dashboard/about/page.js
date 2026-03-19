"use client";
import { useState, useEffect } from "react";

export default function AdminAbout() {
  const [formData, setFormData] = useState({
    sub_title: "",
    email: "",
    about_me: "",
    motivation: "",
  });
  const [status, setStatus] = useState("Save Changes");

  // Load existing data from MongoDB on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/portfolio?section=about");
        const json = await res.json();
        if (json.success && json.data) {
          setFormData(json.data);
        }
      } catch (err) {
        console.error("Failed to load about data");
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "about", data: formData }),
      });

      if (res.ok) {
        setStatus("Success!");
        setTimeout(() => setStatus("Save Changes"), 2000);
      } else {
        setStatus("Error Saving");
      }
    } catch (err) {
      setStatus("Error");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-[1.05rem] font-light tracking-[1px] uppercase border-b border-[var(--border-color)] pb-[15px] mb-[40px]">
        Edit About Section
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <label className="text-[0.7rem] uppercase tracking-widest text-[var(--text-muted)] mb-2">
              Role / Sub-title
            </label>
            <input
              className="bg-[var(--input-bg)] border border-[var(--border-color)] p-4 text-[var(--text-main)] outline-none focus:border-[var(--text-main)] transition-all"
              value={formData.sub_title}
              onChange={(e) =>
                setFormData({ ...formData, sub_title: e.target.value })
              }
              placeholder="Backend Software Developer"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[0.7rem] uppercase tracking-widest text-[var(--text-muted)] mb-2">
              Public Email
            </label>
            <input
              className="bg-[var(--input-bg)] border border-[var(--border-color)] p-4 text-[var(--text-main)] outline-none focus:border-[var(--text-main)] transition-all"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="shubham@example.com"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-[0.7rem] uppercase tracking-widest text-[var(--text-muted)] mb-2">
            About Me Description
          </label>
          <textarea
            rows="5"
            className="bg-[var(--input-bg)] border border-[var(--border-color)] p-4 text-[var(--text-main)] outline-none focus:border-[var(--text-main)] transition-all resize-none"
            value={formData.about_me}
            onChange={(e) =>
              setFormData({ ...formData, about_me: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[0.7rem] uppercase tracking-widest text-[var(--text-muted)] mb-2">
            Work Philosophy
          </label>
          <textarea
            rows="3"
            className="bg-[var(--input-bg)] border border-[var(--border-color)] p-4 text-[var(--text-main)] outline-none focus:border-[var(--text-main)] transition-all resize-none"
            value={formData.motivation}
            onChange={(e) =>
              setFormData({ ...formData, motivation: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className={`px-10 py-4 text-[0.8rem] uppercase tracking-widest transition-all ${
            status === "Success!"
              ? "bg-green-600 border-green-600 text-white"
              : "bg-transparent border border-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-color)]"
          }`}
        >
          {status}
        </button>
      </form>
    </div>
  );
}
