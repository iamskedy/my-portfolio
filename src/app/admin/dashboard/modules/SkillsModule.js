"use client";
import { useState, useEffect } from "react";

export default function SkillsModule() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", category: "Backend" });
  const [status, setStatus] = useState("Add Skill");

  const loadSkills = () => {
    fetch("/api/portfolio?section=skills")
      .then((res) => res.json())
      .then((json) => setSkills(json.data || []));
  };

  useEffect(loadSkills, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setStatus("Adding...");
    await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "skills", data: newSkill }),
    });
    setStatus("Skill Added!");
    setNewSkill({ ...newSkill, name: "" });
    loadSkills();
    setTimeout(() => setStatus("Add Skill"), 2000);
  };

  return (
    <div className="admin-view active">
      <div className="section-header">
        <span>Manage Skills</span>
      </div>
      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
      >
        <input
          type="text"
          className="admin-input"
          placeholder="Skill Name (e.g. Node.js)"
          value={newSkill.name}
          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
        />
        <select
          className="admin-input"
          value={newSkill.category}
          onChange={(e) =>
            setNewSkill({ ...newSkill, category: e.target.value })
          }
        >
          <option>Backend</option>
          <option>Frontend</option>
          <option>Cloud/DevOps</option>
          <option>Database</option>
        </select>
        <button type="submit" className="admin-btn">
          {status}
        </button>
      </form>
      <div className="flex flex-wrap gap-3">
        {skills.map((s) => (
          <div key={s._id} className="skill-pill">
            {s.name} <span className="ml-2 text-red-500 cursor-pointer">×</span>
          </div>
        ))}
      </div>
    </div>
  );
}
