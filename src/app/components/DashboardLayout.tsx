import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Package,
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  // Desktop: controls collapsed (icon-only) vs expanded sidebar.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Mobile: controls whether the off-canvas sidebar is open.
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'Inquiries', path: '/dashboard/inquiries' },
    { icon: Users, label: 'Subscribers', path: '/dashboard/subscribers' },
    { icon: Package, label: 'Packages', path: '/dashboard/packages' },
    { icon: FileText, label: 'Content', path: '/dashboard/content' },
    { icon: Settings, label: 'Account', path: '/dashboard/account' },
  ];

  const sidebarExpanded = !sidebarCollapsed;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay, shown behind the sidebar when it's open on small screens */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 w-64
          md:static md:z-auto md:translate-x-0 md:transition-all
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${sidebarExpanded ? 'md:w-64' : 'md:w-20'}`}
      >
        <div className="p-4 sm:p-6 border-b border-sidebar-border flex items-center justify-between">
          {(sidebarExpanded || mobileSidebarOpen) && (
            <h2 className="text-sidebar-foreground">Tour Admin</h2>
          )}
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:inline-flex p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            {sidebarExpanded ? (
              <X className="w-5 h-5 text-sidebar-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-sidebar-foreground" />
            )}
          </button>
          {/* Mobile close button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {(sidebarExpanded || mobileSidebarOpen) && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(sidebarExpanded || mobileSidebarOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar with menu button */}
        <div className="md:hidden flex items-center gap-3 p-4 border-b border-sidebar-border bg-sidebar sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-sidebar-foreground" />
          </button>
          <h2 className="text-sidebar-foreground">Tour Admin</h2>
        </div>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
