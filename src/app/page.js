import Link from 'next/link';
import data from '@/lib/data.json'; // Importing your DB directly!

export default function Home() {
  const { hero, skills, projects } = data;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease forwards' }}>
      
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-left-col">
          <div>
            <h1 className="huge-title">{hero.name}</h1>
            <h2 className="subtitle">{hero.subtitle}</h2>
          </div>
          <div className="contact-email">
            For business inquiries, email me at<br />
            {hero.email}
          </div>
        </div>
        <div className="hero-right-col">
          <div>
            <div className="section-header"><span>ABOUT ME</span></div>
            <div className="text-block"><p>{hero.about}</p></div>
          </div>
        </div>
      </section>

      {/* MOTIVATION SECTION */}
      <section className="standard-split">
        <div className="standard-left-col">
          <div className="section-header"><span>MOTIVATION</span></div>
          <div className="text-block">
            {hero.motivation.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div>
          <img src={hero.motivationImg} className="img-placeholder" alt="Motivation" />
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section>
        <div className="section-header"><span>SKILLS</span></div>
        <div className="skills-grid">
          {skills.map((skillGroup, index) => (
            <div className="skill-category" key={index}>
              <h3>{skillGroup.category}</h3>
              <div className="pill-container">
                {skillGroup.items.map((item, i) => (
                  <div className="pill" key={i}>{item}</div>
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
          <span style={{ textTransform: 'lowercase', fontSize: '0.9rem' }}>/projects</span>
        </div>
        <div>
          {projects.map((proj) => (
            <div className="work-item" key={proj.id}>
              <div className="work-grid">
                <Link href={`/works/${proj.id}`} className="project-img-wrapper">
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