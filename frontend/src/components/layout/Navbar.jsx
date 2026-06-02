import { Menu, Bell, Search, User } from "lucide-react";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-900 bg-clip-text text-transparent">
          Inventory Flow
        </h2>
      </div>
    </header>
  );
}