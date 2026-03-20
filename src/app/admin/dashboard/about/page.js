"use client";
import { useState, useEffect } from "react";

export default function AboutModule() {
  // State matches your data.json "hero" object structure
  const [formData, setFormData] = useState({ 
    subtitle: "", 
    email: "", 
    about: "", 
    motivation: "" 
  });
  const [status, setStatus] = useState("Save Changes");

  useEffect(() => {
    fetch("/api/portfolio?section=about")
      .then(res => res.json())
      .then(json => {
        if (json.data) setFormData(json.data);
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    
    // We split motivation by newlines to match the array structure in data.json
    const payload = {
        ...formData,
        motivation: formData.motivation.split('\n').filter(m => m.trim() !== '')
    };

    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "about", data: payload }),
    });

    if (res.ok) {
      setStatus("About Section Updated!");
      setTimeout(() => setStatus("Save Changes"), 2000);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="section-header"><span>Update About Section</span></div>
      
      <form onSubmit={handleSave}>
        {/* Notice how we use the exact HTML classes here now! */}
        <div className="form-group">
          <label>Sub-title (Hero)</label>
          <input type="text" className="admin-input" value={formData.subtitle} 
                 onChange={e => setFormData({...formData, subtitle: e.target.value})} />
        </div>
        
        <div className="form-group">
          <label>Contact Email</label>
          <input type="email" className="admin-input" value={formData.email}
                 onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        
        <div className="form-group">
          <label>About Me Content</label>
          <textarea className="admin-textarea" rows="5" value={formData.about}
                    onChange={e => setFormData({...formData, about: e.target.value})} />
        </div>
        
        <div className="form-group">
          <label>Motivation Content (Separate paragraphs with a new line)</label>
          <textarea className="admin-textarea" rows="4" value={typeof formData.motivation === 'string' ? formData.motivation : formData.motivation.join('\n')}
                    onChange={e => setFormData({...formData, motivation: e.target.value})} />
        </div>
        
        <button type="submit" className="admin-btn" style={{ background: status.includes('Updated') ? '#4CAF50' : '', borderColor: status.includes('Updated') ? '#4CAF50' : '' }}>
          {status}
        </button>
      </form>
    </div>
  );
}