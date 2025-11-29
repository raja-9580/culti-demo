'use client';

export default function Topbar() {
  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 h-16 bg-dark-surface border-b border-gray-700/50 shadow-lg z-30 flex items-center px-8 bg-gradient-to-r from-dark-surface via-dark-surface to-dark-surface-light">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-accent-leaf to-accent-sky bg-clip-text text-transparent">
          ⚡ Smart Farm Management
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-leaf to-accent-sky text-dark-bg flex items-center justify-center font-semibold text-sm">
            🌾
          </div>
        </div>
      </div>
    </header>
  );
}
