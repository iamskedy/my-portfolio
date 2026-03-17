import Link from 'next/link';
import data from '@/lib/data.json';

// This is required for SEO/Metadata in Next.js
export const metadata = {
  title: 'Blogs - Shubham Dubey',
};

// CRITICAL: Ensure "export default" is present here
export default function BlogsPage() {
  const { blogs } = data;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease forwards' }}>
      <div className="section-header">
        <span>BLOGS</span>
        <span style={{ textTransform: 'lowercase', fontSize: '0.9rem' }}>/tech-writing</span>
      </div>
      
      <div className="blogs-container">
        {blogs.map((b) => (
          <Link href={`/blogs/${b.id}`} key={b.id} style={{ textDecoration: 'none', display: 'block' }}>
            <div className="blog-card">
              <h3 className="blog-title">{b.title}</h3>
              <p className="blog-desc">{b.desc}</p>
              <div className="pill-container">
                {b.tags.map((t, index) => (
                  <div className="pill" key={index}>{t}</div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}