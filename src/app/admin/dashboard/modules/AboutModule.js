"use client";
import { useState, useEffect } from "react";

export default function AboutModule() {
  const [formData, setFormData] = useState({ sub_title: "", email: "", about_me: "", motivation: "" });
  const [status, setStatus] = useState("Save Changes");

  useEffect(() => {
    fetch("/api/portfolio?section=about").then(res => res.json()).then(json => {
      if (json.data) setFormData(json.data);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "about", data: formData }),
    });
    if (res.ok) {
      setStatus("About Section Updated!");
      setTimeout(() => setStatus("Save Changes"), 2000);
    }
  };

  return (
    <div className="admin-view active">
      <div className="section-header"><span>Update About Section</span></div>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="form-group">
          <label>Sub-title (Hero)</label>
          <input type="text" className="admin-input" value={formData.sub_title} 
                 onChange={e => setFormData({...formData, sub_title: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Contact Email</label>
          <input type="email" className="admin-input" value={formData.email}
                 onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div className="form-group">
          <label>About Me Content</label>
          <textarea className="admin-textarea" rows="5" value={formData.about_me}
                    onChange={e => setFormData({...formData, about_me: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Motivation Content</label>
          <textarea className="admin-textarea" rows="3" value={formData.motivation}
                    onChange={e => setFormData({...formData, motivation: e.target.value})} />
        </div>
        <button type="submit" className="admin-btn" style={{ width: 'auto', background: status.includes('Updated') ? '#4CAF50' : '' }}>
          {status}
        </button>
      </form>
    </div>
  );
}