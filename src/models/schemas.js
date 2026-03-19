import mongoose from "mongoose";

// Admin Schema - for Phase 2 authentication
const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, default: "SuperAdmin" },
    last_login: { type: Date },
    refresh_token: { type: String },
  },
  { timestamps: true },
);

// About Schema - Aligned with the "About Section" HTML form
const AboutSchema = new mongoose.Schema(
  {
    sub_title: { type: String, required: true },
    email: { type: String, required: true },
    about_me: { type: String, required: true },
    motivation: { type: String, required: true },
  },
  { timestamps: true },
);

// Skill Schema - Aligned with the "Skills Section" HTML form
const SkillSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true },
);

// Project Schema - Aligned with the "Works Section" HTML form
const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    tools_used: [{ type: String }], // Array for comma-separated tools
    roles: [{ type: String }], // Array for comma-separated roles
    thumbnail_url: { type: String },
    summary: { type: String, required: true },
  },
  { timestamps: true },
);

// Blog Schema - Aligned with the "Blogs Section" HTML form
const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tags: [{ type: String }], // Array for comma-separated tags
    short_description: { type: String, required: true },
    content: { type: String, required: true },
    is_published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Export all models
const models = {
  Admin: mongoose.models.Admin || mongoose.model("Admin", AdminSchema),
  About: mongoose.models.About || mongoose.model("About", AboutSchema),
  Skill: mongoose.models.Skill || mongoose.model("Skill", SkillSchema),
  Project: mongoose.models.Project || mongoose.model("Project", ProjectSchema),
  Blog: mongoose.models.Blog || mongoose.model("Blog", BlogSchema),
};

export default models;
