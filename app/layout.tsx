import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export const metadata: Metadata = {
  title: 'Cultivator - Mushroom Farm Management',
  description: 'Internal tool for mushroom cultivation management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-bg text-gray-100 flex flex-col min-h-screen">
        <Sidebar />
        <Topbar />
        <main className="md:ml-64 mt-13 md:mt-14 p-3 md:p-6 flex-1">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
