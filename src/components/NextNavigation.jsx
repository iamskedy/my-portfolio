import Link from 'next/link';
import data from '@/lib/data.json';

export default function NextNavigation({ type, currentId }) {
  // 'type' will be either 'projects' or 'blogs'
  const items = data[type]; 
  
  // Find where we currently are in the array
  const currentIndex = items.findIndex(item => item.id === currentId);
  if (currentIndex === -1) return null;

  // Calculate the next item (looping back to 0 if at the end)
  const nextIndex = (currentIndex + 1) % items.length;
  const nextItem = items[nextIndex];
  
  // Determine the correct base URL
  const basePath = type === 'projects' ? '/works' : '/blogs';

  return (
    <div className="next-nav-container">
      <Link href={`${basePath}/${nextItem.id}`} className="next-page-link">
        <span>{nextItem.title}</span>
        <svg className="arrow-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </Link>
    </div>
  );
}