'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Batches', href: '/batches' },
    { label: 'Baglets', href: '/baglets' },
    { label: 'Metrics', href: '/metrics' },
    { label: 'Harvest', href: '/harvest' },
    { label: 'Status Logger', href: '/status-logger' },
    { label: 'Reports', href: '/reports' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-accent-green text-white p-2 rounded-lg"
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-dark-surface border-r border-gray-700/50 shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-accent-leaf/10 to-accent-sky/10">
          <h1 className="text-2xl font-bold text-accent-leaf">🌱 Cultivator</h1>
          <p className="text-xs text-gray-400 mt-1">Smart Farming System</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-all ${
                    isActive(item.href)
                      ? 'bg-accent-leaf/20 text-accent-leaf font-medium border border-accent-leaf/40'
                      : 'text-gray-400 hover:bg-dark-surface-light/50 hover:text-gray-200'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-700/50 text-xs text-gray-500 bg-dark-surface-light/30">
          <p className="font-medium text-gray-400">🌿 Growing Sustainably</p>
          <p className="mt-2 text-gray-600">IoT-enabled pods</p>
          <p className="text-gray-600">Real-time monitoring</p>
        </div>
      </aside>
    </>
  );
}
