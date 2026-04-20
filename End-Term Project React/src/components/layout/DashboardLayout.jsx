import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Map, 
  LogOut,
  User
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Trips', href: '/trips', icon: Map },
  ];

  return (
    <div className="flex h-screen bg-[var(--color-background)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--color-border)] flex flex-col bg-[var(--color-surface)]">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Map className="text-[var(--color-accent)]" />
            Travel Planner
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[var(--color-accent)] text-white' 
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-[var(--color-background)]">
            <User className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--color-danger)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
