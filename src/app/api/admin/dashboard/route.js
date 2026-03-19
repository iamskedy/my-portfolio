import { NextResponse } from "next/server";
import { connectToDatabase } from "@/models/db";
import models from "@/models/schemas";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Security Check: Verify admin session cookie
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch counts for the Dashboard Overview
    const [projectCount, skillCount, blogCount] = await Promise.all([
      models.Project.countDocuments(),
      models.Skill.countDocuments(),
      models.Blog.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        projects: projectCount,
        skills: skillCount,
        blogs: blogCount,
      },
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}