"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname(); // Allows us to highlight the active tab

  return (
    <nav className="sidebar">
      <div className="mobile-top-row">
        <ul className="nav-links">
          <li className={pathname === '/' ? 'active' : ''}>
            <Link href="/">HOME</Link>
          </li>
          <li className={pathname === '/#works-section' ? 'active' : ''}>
            <Link href="/#works-section">WORKS</Link>
          </li>
          <li className={pathname.startsWith('/blogs') ? 'active' : ''}>
            <Link href="/blogs">BLOGS</Link>
          </li>
        </ul>
        <div className="social-icons">
          <i className="fab fa-linkedin"></i>
          <i className="fab fa-github"></i>
          <i className="far fa-envelope"></i>
        </div>
      </div>
      <div className="copyright">© Shubham Dubey</div>
    </nav>
  );
}