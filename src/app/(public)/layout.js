"use client";
import Sidebar from "@/components/Sidebar";
import CustomCursor from "@/components/CustomCursor";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function PublicLayout({ children }) {
  return (
    <>
      <CustomCursor />
      <ThemeSwitcher />
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </>
  );
}