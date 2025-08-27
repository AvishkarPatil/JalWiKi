"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, Home, User, Moon, Sun, LogIn, LogOut, Droplet, Info, BrainCircuit, MessageSquare, Library, Search, Users } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { GlobalSearchBar } from "@/components/global-search-bar";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
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
    if (path === "/ngo") {
      return pathname === path || pathname.startsWith("/ngo/");
    }
    return pathname === path;
  };

  const navBg = darkMode ? "bg-gray-900/90 border-gray-800" : "bg-slate-50/90 border-gray-200";
  const desktopLinkBase = "inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150";
  const desktopLinkActive = darkMode ? "text-purple-400 bg-purple-500/20" : "text-purple-600 bg-purple-500/10";
  const desktopLinkInactive = darkMode ? "text-gray-400 hover:text-purple-400 hover:bg-gray-700/60" : "text-gray-500 hover:text-purple-600 hover:bg-gray-100";

  const themeToggleStyle = darkMode ? "bg-gray-800 text-gray-400 hover:text-purple-400 hover:bg-gray-700/60" : "bg-gray-200 text-gray-600 hover:text-purple-600 hover:bg-gray-100";
  const iconButtonStyle = darkMode ? "text-gray-400 hover:text-purple-400 hover:bg-gray-700/60" : "text-gray-500 hover:text-purple-600 hover:bg-gray-100";

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/techniques", label: "Techniques", icon: Droplet },
    { href: "/waterai", label: "WaterAI", icon: BrainCircuit },
  { href: "/gov", label: "Government", icon: Library },
  { href: "/ngo", label: "NGO", icon: Users },
    { href: "/forum", label: "Forums", icon: MessageSquare },
    { href: "/about", label: "About", icon: Info },
  ];

  const logoLight = "https://i.ibb.co/rGBxKCfr/Jal-Wi-Ki-Light.png";
  const logoDark = "https://i.ibb.co/wNswRL0t/Jal-Wi-Ki-Dark.png";

  return (
    <nav className={cn(navBg, "border-b transition-colors duration-200 sticky top-0 z-50 backdrop-blur-lg")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 mr-6">
            <Link href="/" className="flex items-center">
              <Image
                src={darkMode ? logoDark : logoLight}
                alt="JalWiKi Logo"
                width={130}
                height={40}
                priority
                className={cn(
                  "transition-all duration-300",
                  darkMode && "drop-shadow-[0_0_0.3px_rgba(255,255,255,1.0)] hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]"
                )}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6 flex-1"> {/* Updated spacing */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  desktopLinkBase,
                  isActive(item.href) ? desktopLinkActive : desktopLinkInactive
                )}
              >
                <item.icon className="mr-2 h-4 w-4" /> {/* Updated margin */}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex md:items-center md:flex-1 md:max-w-md md:mx-4 lg:mx-6">
            <GlobalSearchBar className="w-full" />
          </div>

          {/* Desktop User Controls */}
          <div className="hidden md:flex md:items-center md:space-x-4 md:ml-auto"> {/* Updated spacing */}
            <button
              onClick={toggleDarkMode}
              className={cn("p-1.5 rounded-full", themeToggleStyle)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150",
                  darkMode
                    ? "text-gray-300 hover:text-purple-400 hover:bg-gray-700/60"
                    : "text-gray-500 hover:text-purple-600 hover:bg-gray-100"
                )}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center md:hidden ml-auto">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className={cn("mr-3 p-1.5 rounded-full", themeToggleStyle)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <button
              onClick={toggleDarkMode}
              className={cn("mr-3 p-1.5 rounded-full", themeToggleStyle)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500",
                darkMode ? "text-gray-400 hover:text-purple-400 hover:bg-gray-700/60" : "text-gray-500 hover:text-purple-600 hover:bg-gray-100"
              )}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden mt-3 mb-2">
            <GlobalSearchBar className="w-full" />
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-20 inset-x-0 z-40 shadow-lg">
          <div className={cn("px-2 pt-2 pb-3 space-y-1", darkMode ? "bg-gray-800/95 backdrop-blur-md" : "bg-slate-50/95 backdrop-blur-md")}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-base font-medium",
                  isActive(item.href)
                    ? (darkMode ? "bg-purple-500/30 text-purple-300" : "bg-purple-100 text-purple-700")
                    : (darkMode ? "text-gray-300 hover:bg-gray-700 hover:text-purple-400" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <div className={cn("pt-4 pb-2 border-t", darkMode ? "border-gray-700" : "border-gray-200")}>
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
                      darkMode ? "text-gray-300 hover:bg-gray-700 hover:text-purple-400" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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