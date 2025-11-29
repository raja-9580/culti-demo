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
      <body className="bg-dark-bg text-gray-100">
        <Sidebar />
        <Topbar />
        <main className="md:ml-64 mt-16 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
