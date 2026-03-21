import Link from "next/link";
import { connectToDatabase } from "@/models/db";
import models from "@/models/schemas";

// Force Next.js to fetch the latest data on every request (No Caching)
export const revalidate = 0;

export default async function Home() {
  await connectToDatabase();

  // Fetch all required data concurrently from MongoDB
  const [hero, skillsData, projects] = await Promise.all([
    models.About.findOne().lean(),
    models.Skill.find().lean(),
    models.Project.find().sort({ index: 1 }).lean(),
  ]);

  // Group skills by category to match the layout
  const skills = skillsData.reduce((acc, skill) => {
    let group = acc.find((g) => g.category === skill.category);
    if (!group) {
      group = { category: skill.category, items: [] };
      acc.push(group);
    }
    group.items.push(skill.name);
    return acc;
  }, []);

  if (!hero) {
    return <div className="p-10">Loading or please seed database...</div>;
  }

  return (
    <div style={{ animation: "fadeIn 0.5s ease forwards" }}>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-left-col">
          <div>
            {/* Hardcoded name as it's not in the About schema */}
            <h1 className="huge-title">SHUBHAM DUBEY</h1>
            <h2 className="subtitle">{hero.subtitle}</h2>
          </div>
          <div className="contact-email">
            For business inquiries, email me at
            <br />
            {hero.email}
          </div>
        </div>
        <div className="hero-right-col">
          <div>
            <div className="section-header">
              <span>ABOUT ME</span>
            </div>
            <div className="text-block">
              <p>{hero.about_me}</p>
            </div>
          </div>
        </div>
      </section>

      {/* MOTIVATION SECTION */}
      <section className="standard-split">
        <div className="standard-left-col">
          <div className="section-header">
            <span>MOTIVATION</span>
          </div>
          <div className="text-block">
            {hero.motivation?.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800"
            className="img-placeholder"
            alt="Motivation"
          />
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section>
        <div className="section-header">
          <span>SKILLS</span>
        </div>
        <div className="skills-grid">
          {skills.map((skillGroup, index) => (
            <div className="skill-category" key={index}>
              <h3>{skillGroup.category}</h3>
              <div className="pill-container">
                {skillGroup.items.map((item, i) => (
                  <div className="pill" key={i}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WORKS SECTION */}
      <section id="works-section">
        <div className="section-header">
          <span>WORKS</span>
          <span style={{ textTransform: "lowercase", fontSize: "0.9rem" }}>
            /projects
          </span>
        </div>
        <div>
          {projects.map((proj) => (
            <div className="work-item" key={proj._id}>
              <div className="work-grid">
                <Link
                  href={`/works/${proj._id}`}
                  className="project-img-wrapper">
                  <div className="view-btn">VIEW</div>
                  <img src={proj.thumbnail} alt={proj.title} />
                </Link>
                <div className="work-info">
                  <div className="index">{proj.index}</div>
                  <h3>{proj.title}</h3>
                  <h4>{proj.subtitle}</h4>
                  <p dangerouslySetInnerHTML={{ __html: proj.overview }}></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
