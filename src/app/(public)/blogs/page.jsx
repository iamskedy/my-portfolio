import Link from 'next/link';
import { connectToDatabase } from "@/models/db";
import models from "@/models/schemas";

export const revalidate = 60; 

export default async function BlogsPage() {
  await connectToDatabase();
  
  // Fetch only published blogs, sorted by newest first
  const blogs = await models.Blog.find({ is_published: true }).sort({ createdAt: -1 }).lean();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="detail-top-bar">
        <Link href="/" className="back-btn">
          <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> BACK TO HOME
        </Link>
      </div>

      <h1 className="project-title-large">WRITINGS <br/>& THOUGHTS</h1>

      <div className="blogs-container">
        {blogs.map((blog) => (
          <Link href={`/blogs/${blog.slug}`} key={blog._id} className="blog-card block" style={{ textDecoration: 'none' }}>
            <h2 className="blog-title">{blog.title}</h2>
            
            {/* Switched to your original HTML "pill" classes */}
            <div className="pill-container" style={{ marginBottom: '25px' }}>
              {blog.tags.map((tag, idx) => (
                <div key={idx} className="pill">
                  {tag}
                </div>
              ))}
            </div>

            <p className="blog-desc">{blog.desc}</p>
            
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '16px' }}>
              READ MORE →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}