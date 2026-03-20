"use client";
import { useState, useEffect } from "react";

export default function SkillsModule() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", category: "LANGUAGES" });
  const [status, setStatus] = useState("Add Skill");

  // 1. Fetch skills from MongoDB
  const loadSkills = () => {
    fetch("/api/portfolio?section=skills")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setSkills(json.data);
      });
  };

  useEffect(loadSkills, []);

  // 2. Add a new skill
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    setStatus("Adding...");

    await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "skills", data: newSkill }),
    });

    setNewSkill({ ...newSkill, name: "" });
    loadSkills();
    setStatus("Skill Added!");
    setTimeout(() => setStatus("Add Skill"), 2000);
  };

  // 3. Delete a skill from MongoDB
  const handleDelete = async (id) => {
    if (!confirm("Remove this skill?")) return;

    const res = await fetch(`/api/portfolio?section=skills&id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) loadSkills();
  };

  // 4. Group flat DB records by category for the UI
  const groupedSkills = skills.reduce((acc, skill) => {
    let group = acc.find((g) => g.category === skill.category);
    if (!group) {
      group = { category: skill.category, items: [] };
      acc.push(group);
    }
    group.items.push(skill);
    return acc;
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="section-header">
        <span>Manage Skills</span>
      </div>

      {/* --- ADD NEW SKILL FORM --- */}
      <form onSubmit={handleAdd} className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Skill Name</label>
            <input
              type="text"
              className="admin-input"
              style={{ marginBottom: 0 }}
              placeholder="e.g. Node.js"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Category</label>
            <select
              className="admin-input"
              style={{ marginBottom: 0 }}
              value={newSkill.category}
              onChange={(e) =>
                setNewSkill({ ...newSkill, category: e.target.value })
              }
            >
              <option>LANGUAGES</option>
              <option>FRONTEND</option>
              <option>BACKEND</option>
              <option>DEVOPS & TOOLS</option>
            </select>
          </div>
          <button
            type="submit"
            className="admin-btn"
            style={{
              margin: 0,
              background: status.includes("Added") ? "#4CAF50" : "",
              borderColor: status.includes("Added") ? "#4CAF50" : "",
            }}
          >
            {status}
          </button>
        </div>
      </form>

      {/* --- SKILLS DISPLAY & MANAGEMENT --- */}
      <div className="space-y-10">
        {groupedSkills.map((skillGroup, idx) => (
          <div key={idx}>
            <h3 className="text-[0.8rem] tracking-[2px] text-[var(--text-muted)] mb-4 uppercase">
              {skillGroup.category}
            </h3>
            <div className="flex flex-wrap">
              {skillGroup.items.map((item) => (
                <div key={item._id} className="skill-pill group">
                  {item.name}
                  <span
                    onClick={() => handleDelete(item._id)}
                    className="ml-3 cursor-pointer text-[#ff4d4d] opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete"
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-[var(--text-muted)]">
            No skills found in database.
          </p>
        )}
      </div>
    </div>
  );
}
