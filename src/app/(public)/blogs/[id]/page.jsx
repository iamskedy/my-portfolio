import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectToDatabase } from "@/models/db";
import models from "@/models/schemas";

export const revalidate = 60;

export default async function BlogPost({ params }) {
  await connectToDatabase();
  
  const blog = await models.Blog.findOne({ slug: params.id }).lean();

  if (!blog) {
    notFound(); 
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="detail-top-bar">
        <Link href="/blogs" className="back-btn">
          <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> ALL WRITINGS
        </Link>
        {/* Date formatting matching the top right of your HTML design */}
        <div style={{ fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {blog.date || new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', marginTop: '60px' }}>
        
        {/* Switched to your original HTML "pill" classes */}
        <div className="pill-container" style={{ marginBottom: '30px' }}>
          {blog.tags.map((tag, idx) => (
            <div key={idx} className="pill">
              {tag}
            </div>
          ))}
        </div>

        <h1 className="blog-header-title">{blog.title}</h1>
        
        <div 
          className="blog-body"
          dangerouslySetInnerHTML={{ __html: blog.content }} 
        />
      </div>
    </div>
  );
}