"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, Home, User, Moon, Sun, LogIn, LogOut, Droplet, Info, BrainCircuit, MessageSquare, Library } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/techniques") {
      return pathname === path || pathname.startsWith("/techniques/");
    }
    if (path === "/forum") {
      return pathname === path || pathname.startsWith("/forum/");
    }
    if (path === "/gov") {
      return pathname === path || pathname.startsWith("/gov/");
    }
    return pathname === path;
  };

  const navBg = darkMode ? "bg-card/90 border-border" : "bg-card/90 border-border";
  const desktopLinkBase = "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150";
  const desktopLinkActive = darkMode ? "text-primary bg-accent/20" : "text-primary bg-accent/10";
  const desktopLinkInactive = darkMode ? "text-muted-foreground hover:text-primary hover:bg-accent/20" : "text-muted-foreground hover:text-primary hover:bg-accent/10";

  const themeToggleStyle = darkMode ? "bg-accent/10 text-primary-foreground hover:bg-accent/20" : "bg-accent/10 text-foreground hover:bg-accent/20";
  const iconButtonStyle = darkMode ? "text-muted-foreground hover:text-primary hover:bg-accent/20" : "text-muted-foreground hover:text-primary hover:bg-accent/10";

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/techniques", label: "Techniques", icon: Droplet },
    { href: "/waterai", label: "WaterAI", icon: BrainCircuit },
    { href: "/gov", label: "Gov & NGO", icon: Library },
    { href: "/forum", label: "Forums", icon: MessageSquare },
    { href: "/about", label: "About", icon: Info },
  ];

  const logoLight = "https://i.ibb.co/rGBxKCfr/Jal-Wi-Ki-Light.png";
  const logoDark = "https://i.ibb.co/wNswRL0t/Jal-Wi-Ki-Dark.png";

  return (
    <nav className={cn(navBg, "border-b transition-colors duration-200 sticky top-0 z-50 backdrop-blur-lg shadow-sm")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src={darkMode ? logoDark : logoLight}
                  alt="JalWiKi Logo"
                  width={130}
                  height={40}
                  priority
                  className="transition-all duration-300 hover:opacity-90"
                />
              </Link>
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:justify-center sm:space-x-2 lg:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  desktopLinkBase,
                  isActive(item.href) ? desktopLinkActive : desktopLinkInactive
                )}
              >
                <item.icon className="mr-1.5 h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-3">
            <button
              onClick={toggleDarkMode}
              className={cn("p-1.5 rounded-full", themeToggleStyle)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn("p-1.5 rounded-full", iconButtonStyle)}
                  aria-label="Go to dashboard"
                >
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={logout}
                  className={cn("p-1.5 rounded-full", iconButtonStyle)}
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className={"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 text-foreground hover:text-primary hover:bg-accent/10"}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleDarkMode}
              className={cn("mr-2 p-1.5 rounded-full", themeToggleStyle)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={"inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring text-muted-foreground hover:text-primary hover:bg-accent/10"}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-20 inset-x-0 z-40 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-card/95 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-base font-medium",
                  isActive(item.href)
                    ? "bg-accent/20 text-primary"
                    : "text-foreground hover:bg-accent/10 hover:text-primary"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <div className={cn("pt-4 border-border")}>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-base font-medium",
                      isActive("/dashboard")
                        ? (darkMode ? "bg-purple-500/30 text-purple-300" : "bg-purple-100 text-purple-700")
                        : (darkMode ? "text-gray-300 hover:bg-gray-700 hover:text-purple-400" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
                    )}
                  >
                    <User className="mr-3 h-5 w-5" />
                    Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className={cn(
                      "w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium",
                      "text-foreground hover:bg-accent/10 hover:text-primary"
                    )}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-base font-medium",
                    isActive("/auth")
                      ? (darkMode ? "bg-purple-500/30 text-purple-300" : "bg-purple-100 text-purple-700")
                      : (darkMode ? "text-gray-300 hover:bg-gray-700 hover:text-purple-400" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
                  )}
                >
                  <LogIn className="mr-3 h-5 w-5" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}