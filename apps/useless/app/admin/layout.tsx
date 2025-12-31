"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Skull,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@ggprompts/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@ggprompts/ui";
import { Sheet, SheetContent, SheetTrigger } from "@ggprompts/ui";
import { Badge } from "@ggprompts/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ggprompts/ui";
import { signOut, useSession } from "@/lib/auth-client";

const navigationItems = [
  {
    id: "overview",
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Useless metrics at a glance",
  },
  {
    id: "products",
    label: "Products",
    href: "/admin/products",
    icon: Package,
    description: "Manage imaginary inventory",
  },
  {
    id: "orders",
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    description: "Orders that will never ship",
  },
  {
    id: "users",
    label: "Users",
    href: "/admin/users",
    icon: Users,
    description: "People who trust us with fake money",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 lg:hidden glass border border-border/20"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 glass-dark border-r-border/20 p-0"
          >
            <SidebarContent
              pathname={pathname}
              session={session}
              onSignOut={handleSignOut}
              onNavigate={() => setMobileMenuOpen(false)}
              mobile
            />
          </SheetContent>
        </Sheet>

        <div className="flex h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block relative flex-shrink-0">
            <aside
              className={`h-full glass-dark border-r border-border/20 transition-[width] duration-300 ease-in-out overflow-hidden ${
                sidebarOpen ? "w-[280px]" : "w-[80px]"
              }`}
            >
              <SidebarContent
                pathname={pathname}
                session={session}
                onSignOut={handleSignOut}
                collapsed={!sidebarOpen}
              />
            </aside>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute -right-4 top-20 glass border border-border/20 rounded-full h-8 w-8 z-20"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}

function SidebarContent({
  pathname,
  session,
  onSignOut,
  onNavigate,
  collapsed = false,
  mobile = false,
}: {
  pathname: string;
  session: ReturnType<typeof useSession>["data"];
  onSignOut: () => void;
  onNavigate?: () => void;
  collapsed?: boolean;
  mobile?: boolean;
}) {
  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full whitespace-nowrap">
      {/* Logo/Brand */}
      <div
        className={`p-4 border-b border-border/20 transition-all duration-300 ${
          collapsed && !mobile ? "px-3" : ""
        }`}
      >
        <div
          className={`flex items-center gap-3 transition-all duration-300 ${
            collapsed && !mobile ? "justify-center" : ""
          }`}
        >
          <div className="relative">
            <Skull className="h-8 w-8 text-primary" />
            <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div
            className={`transition-all duration-300 overflow-hidden ${
              collapsed && !mobile ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <p className="font-bold text-foreground terminal-glow">
              Useless Admin
            </p>
            <p className="text-xs text-muted-foreground">
              Managing nothing since 2024
            </p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div
        className={`p-4 border-b border-border/20 transition-all duration-300 ${
          collapsed && !mobile ? "px-3" : ""
        }`}
      >
        <div
          className={`flex items-center gap-3 transition-all duration-300 ${
            collapsed && !mobile ? "justify-center" : ""
          }`}
        >
          <Avatar className="flex-shrink-0">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="bg-secondary/20 text-secondary">
              {session?.user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "AD"}
            </AvatarFallback>
          </Avatar>
          <div
            className={`transition-all duration-300 overflow-hidden ${
              collapsed && !mobile ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <p className="font-semibold text-foreground">
              {session?.user?.name || "Supreme Overlord"}
            </p>
            <Badge
              variant="outline"
              className="text-xs border-primary/30 text-primary"
            >
              <AlertTriangle className="h-2 w-2 mr-1" />
              Admin
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats - Satirical */}
      <div
        className={`border-b border-border/20 transition-all duration-300 overflow-hidden ${
          collapsed && !mobile ? "h-0 p-0 opacity-0" : "h-auto p-4 opacity-100"
        }`}
      >
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="glass border border-border/20 rounded p-2">
            <p className="text-xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Items Shipped</p>
          </div>
          <div className="glass border border-border/20 rounded p-2">
            <p className="text-xl font-bold text-yellow-400">$0</p>
            <p className="text-xs text-muted-foreground">Real Revenue</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-hidden">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200
                        ${collapsed && !mobile ? "justify-center" : ""}
                        ${
                          active
                            ? "glass border border-border/20 text-primary"
                            : "hover:bg-secondary/20 text-muted-foreground hover:text-foreground"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span
                        className={`transition-all duration-300 overflow-hidden ${
                          collapsed && !mobile
                            ? "w-0 opacity-0"
                            : "w-auto opacity-100"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  {collapsed && !mobile && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div
        className={`p-4 border-t border-border/20 space-y-2 transition-all duration-300 ${
          collapsed && !mobile ? "px-3" : ""
        }`}
      >
        <Link
          href="/admin/settings"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/20 text-muted-foreground hover:text-foreground transition-colors ${
            collapsed && !mobile ? "justify-center" : ""
          }`}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span
            className={`transition-all duration-300 overflow-hidden ${
              collapsed && !mobile ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            Settings
          </span>
        </Link>
        <Button
          variant="ghost"
          onClick={onSignOut}
          className={`w-full hover:bg-red-900/20 hover:text-red-400 transition-all duration-200 ${
            collapsed && !mobile ? "justify-center" : "justify-start"
          }`}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span
            className={`ml-3 transition-all duration-300 overflow-hidden ${
              collapsed && !mobile ? "w-0 opacity-0 ml-0" : "w-auto opacity-100"
            }`}
          >
            Logout
          </span>
        </Button>
      </div>
    </div>
  );
}
