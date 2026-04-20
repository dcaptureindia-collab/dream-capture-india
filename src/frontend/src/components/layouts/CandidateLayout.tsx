import type { NotificationRecord } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Briefcase,
  Crown,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

interface CandidateLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/candidate/profile", icon: User },
  { label: "Portfolio", href: "/candidate/portfolio", icon: Images },
  { label: "Projects", href: "/candidate/projects", icon: Briefcase },
  { label: "Notifications", href: "/candidate/notifications", icon: Bell },
];

export default function CandidateLayout({ children }: CandidateLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, principal, isAuthenticated } = useAuth();
  const { actor, isLoading: actorLoading } = useBackend();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const { data: notifications = [] } = useQuery<NotificationRecord[]>({
    queryKey: ["myNotifications"],
    queryFn: () => actor!.getMyNotifications(),
    enabled: isAuthenticated && !!actor && !actorLoading,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const currentYear = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={() => setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border/50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <span className="font-display text-base font-semibold text-primary tracking-wide">
              Dream Capture
            </span>
          </Link>
          {principal && (
            <p
              className="mt-2 text-xs text-muted-foreground truncate"
              title={principal}
            >
              {principal.slice(0, 20)}...
            </p>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-smooth ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                data-ocid={`candidate_sidebar.${item.label.toLowerCase()}_link`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {item.label === "Notifications" && unreadCount > 0 && (
                  <Badge className="ml-auto bg-primary text-primary-foreground text-xs h-5 min-w-5 flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={logout}
            data-ocid="candidate_sidebar.logout_button"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top gold accent bar + mobile header */}
        <div className="h-1 bg-primary w-full" />
        <header className="bg-card border-b border-border/50 px-4 py-3 flex items-center justify-between lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary" />
            <span className="font-display text-sm font-semibold text-primary">
              Dream Capture
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>

        <footer className="bg-muted/20 border-t border-border/30 px-6 py-3 text-xs text-muted-foreground text-center">
          © {currentYear}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
