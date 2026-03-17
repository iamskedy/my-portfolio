import './globals.css';
import Sidebar from '@/components/Sidebar';
import CustomCursor from '@/components/CustomCursor';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export const metadata = {
  title: 'Shubham Dubey - Portfolio',
  description: 'Backend Software Developer Portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Pulling in your fonts and icons */}
        
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <CustomCursor />
        <ThemeSwitcher />
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}