import { NextResponse } from "next/server";
import { connectToDatabase } from "@/models/db"; 
import models from "@/models/schemas"; 
import bcrypt from "bcryptjs"; 
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await connectToDatabase();
    const { action, email, password } = await request.json();

    if (!action || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 1. Register a new admin (Change action to "register" in Postman/Frontend to create your first account)
    if (action === "register") {
      const existing = await models.Admin.findOne({ email });
      if (existing) {
        return NextResponse.json(
          { error: "Admin already exists" },
          { status: 409 },
        );
      }
      const password_hash = await bcrypt.hash(password, 10);
      await models.Admin.create({ email, password_hash });
      return NextResponse.json(
        { success: true, message: "Admin created successfully" },
        { status: 201 },
      );
    }

    // 2. Login flow
    if (action === "login") {
      const admin = await models.Admin.findOne({ email });
      if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      // Update last login timestamp
      admin.last_login = new Date();
      await admin.save();

      // Set a secure HTTP-Only cookie so the client stays logged in
      const cookieStore = await cookies();
      cookieStore.set("admin_session", admin._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });

      return NextResponse.json(
        { success: true, message: "Logged in successfully" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: "Action must be register or login" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
