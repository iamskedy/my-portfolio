"use client";
import { useEffect, useState } from 'react';

export default function ThemeSwitcher() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Check local storage on initial load
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
      setIsLight(true);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = (e) => {
    const theme = e.target.checked ? 'light' : 'dark';
    setIsLight(e.target.checked);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <div className="theme-switch-wrapper">
      <label className="theme-switch" htmlFor="checkbox">
        <input type="checkbox" id="checkbox" checked={isLight} onChange={toggleTheme} />
        <div className="slider"></div>
      </label>
    </div>
  );
}