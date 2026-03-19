import { NextResponse } from "next/server";
import { connectToDatabase } from "@/models/db";
import models from "@/models/schemas";

export async function GET(request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  let data;
  if (section === "about") data = await models.About.findOne();
  if (section === "skills") data = await models.Skill.find();
  if (section === "projects") data = await models.Project.find();

  return NextResponse.json({ success: true, data });
}

export async function POST(request) {
  await connectToDatabase();
  const { section, data } = await request.json();

  try {
    if (section === "about") {
      // Upsert: Update if exists, else create new
      await models.About.findOneAndUpdate({}, data, { upsert: true });
    } else if (section === "skills") {
      await models.Skill.create(data);
    } else if (section === "projects") {
      await models.Project.create(data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
