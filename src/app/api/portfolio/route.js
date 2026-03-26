import { NextResponse } from "next/server";
import { connectToDatabase } from "@/models/db";
import models from "@/models/schemas";
import { cookies } from "next/headers";

// --- SECURITY HELPER: Verify Admin Session ---
async function verifyAdmin() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");
  
  if (!adminSession) return false;

  // Double-check the ID actually exists in the database
  await connectToDatabase();
  const adminExists = await models.Admin.findById(adminSession.value);
  return !!adminExists;
}

// --- READ (GET) - Kept Public for the Frontend ---
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  await connectToDatabase();

  try {
    let data;
    if (section === "about") data = await models.About.findOne();
    else if (section === "skills") data = await models.Skill.find();
    else if (section === "projects") data = await models.Project.find().sort({ index: 1 });
    else if (section === "blogs") data = await models.Blog.find().sort({ createdAt: -1 });
    else return NextResponse.json({ success: false, error: "Invalid section" }, { status: 400 });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// --- CREATE (POST) - SECURED ---
export async function POST(req) {
  const isAuth = await verifyAdmin();
  if (!isAuth) return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });

  const body = await req.json();
  const { section, data } = body;
  await connectToDatabase();

  try {
    if (section === "about") {
      await models.About.findOneAndUpdate({}, data, { upsert: true, new: true });
    } else if (section === "skills") {
      await models.Skill.create(data);
    } else if (section === "projects") {
      await models.Project.create(data);
    } else if (section === "blogs") {
      await models.Blog.create(data);
    }
    return NextResponse.json({ success: true, message: "Created successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// --- UPDATE (PUT) - SECURED ---
export async function PUT(req) {
  const isAuth = await verifyAdmin();
  if (!isAuth) return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });

  const body = await req.json();
  const { section, id, data } = body;
  await connectToDatabase();

  try {
    if (section === "skills") await models.Skill.findByIdAndUpdate(id, data);
    else if (section === "projects") await models.Project.findByIdAndUpdate(id, data);
    else if (section === "blogs") await models.Blog.findByIdAndUpdate(id, data);
    
    return NextResponse.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// --- DELETE (DELETE) - SECURED ---
export async function DELETE(req) {
  const isAuth = await verifyAdmin();
  if (!isAuth) return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  const id = searchParams.get("id");
  await connectToDatabase();

  try {
    if (section === "skills") await models.Skill.findByIdAndDelete(id);
    else if (section === "projects") await models.Project.findByIdAndDelete(id);
    else if (section === "blogs") await models.Blog.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}