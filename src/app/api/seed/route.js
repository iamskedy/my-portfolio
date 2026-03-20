import { NextResponse } from "next/server";
import { connectToDatabase } from "@/models/db";
import models from "@/models/schemas";
import data from "@/lib/data.json"; 

export async function GET() {
  try {
    await connectToDatabase();

    // 0. FORCE DROP COLLECTIONS (Destroys bad indexes like the slug: null error)
    try { await models.About.collection.drop(); } catch(e) { /* Ignores if it doesn't exist yet */ }
    try { await models.Skill.collection.drop(); } catch(e) {}
    try { await models.Project.collection.drop(); } catch(e) {}
    try { await models.Blog.collection.drop(); } catch(e) {}

    // 1. Seed About (Hero) Section
    await models.About.create({
      subtitle: data.hero.subtitle,
      email: data.hero.email,
      about_me: data.hero.about,
      motivation: data.hero.motivation,
    });

    // 2. Seed Skills (Flatten the grouped JSON into individual database records)
    const flatSkills = [];
    data.skills.forEach((group) => {
      group.items.forEach((item) => {
        flatSkills.push({ name: item, category: group.category });
      });
    });
    await models.Skill.insertMany(flatSkills);

    // 3. Seed Projects
    const mappedProjects = data.projects.map(p => ({
        ...p,
        tools: p.tools // Mapping tools
    }));
    await models.Project.insertMany(mappedProjects);

    // 4. Seed Blogs
    const mappedBlogs = data.blogs.map(blog => ({
        ...blog,
        slug: blog.id // Mapping the "id" from data.json to the required "slug" field
    }));
    await models.Blog.insertMany(mappedBlogs);

    return NextResponse.json({ 
      success: true, 
      message: "Database completely dropped, rebuilt, and seeded successfully from data.json!" 
    });
  } catch (error) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}