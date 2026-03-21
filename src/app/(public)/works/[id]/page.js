import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectToDatabase } from "@/models/db";
import models from "@/models/schemas";

// Force Next.js to fetch the latest data on every request
export const revalidate = 0;

export default async function ProjectPost({ params }) {
  // Await params in Next.js 14+ just to be safe with dynamic routing
  const resolvedParams = await params;
  const { id } = resolvedParams;

  await connectToDatabase();

  // 1. Guard check: Ensure the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound(); // Triggers the 404 page gracefully
  }

  // 2. Fetch the specific project from the database
  const project = await models.Project.findById(id).lean();

  // 3. If no project is found with that valid ID, show 404
  if (!project) {
    notFound();
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="detail-top-bar">
        <Link href="/#works-section" className="back-btn">
          <i className="fas fa-arrow-left" style={{ marginRight: "8px" }}></i>{" "}
          BACK TO WORKS
        </Link>
      </div>

      <h1 className="project-title-large">{project.title}</h1>

      {project.thumbnail && (
        <img
          src={project.thumbnail}
          className="detail-hero-img"
          alt={project.title}
        />
      )}

      <div className="detail-grid">
        <div className="detail-block">
          <h3>Overview</h3>
          <p dangerouslySetInnerHTML={{ __html: project.overview }}></p>
        </div>

        <div className="detail-block">
          <h3>Tools & Technologies</h3>
          <div className="pill-container">
            {project.tools?.map((tool, idx) => (
              <div key={idx} className="pill">
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>

      {project.content && (
        <div className="project-content-column">
          <div dangerouslySetInnerHTML={{ __html: project.content }}></div>
        </div>
      )}
    </div>
  );
}
