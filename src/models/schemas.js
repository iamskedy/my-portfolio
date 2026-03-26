import mongoose from "mongoose";

// Admin Schema
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

// About Schema - Updated to match data.json
const AboutSchema = new mongoose.Schema(
  {
    subtitle: { type: String, required: true }, // Removed underscore
    email: { type: String, required: true },
    about_me: { type: String, required: true },
    motivation: [{ type: String }], // Changed to Array of Strings
  },
  { timestamps: true },
);

// Skill Schema
const SkillSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true },
);


const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    category: { type: String, required: true, default: "Full Stack" }, // <-- ADD THIS LINE
    tools: [{ type: String }], 
    thumbnail: { type: String }, 
    overview: { type: String, required: true }, 
    content: { type: String }, 
    index: { type: String }, 
  },
  { timestamps: true },
);
// Blog Schema - Updated to match Admin UI and DB Indexes
const BlogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true }, // <--- ADD THIS LINE
    title: { type: String, required: true },
    tags: [{ type: String }],
    desc: { type: String, required: true }, 
    content: { type: String, required: true },
    date: { type: String }, 
    is_published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Export all models safely (prevents Next.js hot-reload overwrite errors)
const models = {
  Admin: mongoose.models.Admin || mongoose.model("Admin", AdminSchema),
  About: mongoose.models.About || mongoose.model("About", AboutSchema),
  Skill: mongoose.models.Skill || mongoose.model("Skill", SkillSchema),
  Project: mongoose.models.Project || mongoose.model("Project", ProjectSchema),
  Blog: mongoose.models.Blog || mongoose.model("Blog", BlogSchema),
};

export default models;
