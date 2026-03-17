import Link from 'next/link';
import { notFound } from 'next/navigation';
import data from '@/lib/data.json';
import NextNavigation from '@/components/NextNavigation';

export default function BlogDetail({ params }) {
  // Accessing the dynamic ID from the URL
  const { id } = params; 
  
  // Searching the blogs array for a matching ID
  const blog = data.blogs.find(b => b.id === id);

  // If no blog is found, Next.js will render the default 404 page
  if (!blog) {
    notFound(); 
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease forwards' }}>
      <div className="detail-top-bar">
        <Link href="/blogs" className="back-btn">
          &lt; BACK
        </Link>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {blog.date}
        </div>
      </div>
      
      <h1 className="blog-header-title">{blog.title}</h1>
      
      <div className="pill-container">
        {blog.tags.map((t, i) => (
          <div className="pill" key={i}>{t}</div>
        ))}
      </div>
      
      {/* dangerouslySetInnerHTML is required to render the <p> and <h3> tags in your JSON */}
      <div 
        className="blog-body" 
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />

      <NextNavigation type="blogs" currentId={id} />
    </div>
  );
}