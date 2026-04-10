import { BarChart2, Bookmark, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Page, User } from '../../types';

interface NavbarProps {
  currentPage: Page;
  user: User | null;
  onNavigate: (page: Page) => void;
  onSignOut: () => void;
}

export default function Navbar({ currentPage, user, onNavigate, onSignOut }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { page: 'dashboard' as Page, label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { page: 'saved' as Page, label: 'Saved Insights', icon: <Bookmark size={15} /> },
  ];

  return (
    <nav className="bg-navy-900/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-accent-red to-accent-orange rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-200">
              <BarChart2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Bracket<span className="text-accent-red">Buddy</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ page, label, icon }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={[
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  currentPage === page
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10',
                ].join(' ')}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-white/50">{user.email}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-red to-accent-orange flex items-center justify-center text-white font-bold text-sm shadow-glow">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={onSignOut}
                  className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
                  title="Sign out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-navy-900 border-t border-white/10 px-4 py-3 space-y-1 animate-fade-in">
          {navLinks.map(({ page, label, icon }) => (
            <button
              key={page}
              onClick={() => { onNavigate(page); setMobileOpen(false); }}
              className={[
                'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200',
                currentPage === page
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10',
              ].join(' ')}
            >
              {icon}
              {label}
            </button>
          ))}
          {user && (
            <button
              onClick={() => { onSignOut(); setMobileOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
