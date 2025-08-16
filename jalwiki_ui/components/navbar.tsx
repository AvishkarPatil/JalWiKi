"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Home,
  User,
  Moon,
  Sun,
  LogIn,
  LogOut,
  Droplet,
  Info,
  BrainCircuit,
  MessageSquare,
  Library,
} from "lucide-react";
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

  const navBg = darkMode
    ? "bg-gray-900/90 border-gray-800 backdrop-blur-md shadow-lg"
    : "bg-slate-50/90 border-gray-200 backdrop-blur-md shadow-md";

  const desktopLinkBase =
    "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition duration-300 ease-in-out transform hover:scale-105";

  const desktopLinkActive = darkMode
    ? "text-purple-400 bg-purple-500/20 border-b-2 border-purple-400"
    : "text-purple-600 bg-purple-500/10 border-b-2 border-purple-600";

  const desktopLinkInactive = darkMode
    ? "text-gray-400 hover:text-purple-400 hover:bg-gray-700/60"
    : "text-gray-600 hover:text-purple-600 hover:bg-gray-100";

  const themeToggleStyle = darkMode
    ? "bg-gray-800 text-gray-400 hover:text-purple-400 hover:bg-gray-700/60 transition-transform hover:scale-110 rounded-full p-1"
    : "bg-gray-200 text-gray-600 hover:text-purple-600 hover:bg-gray-100 transition-transform hover:scale-110 rounded-full p-1";

  const iconButtonStyle = darkMode
    ? "text-gray-400 hover:text-purple-400 hover:bg-gray-700/60 transition-transform hover:scale-110 rounded-md p-1"
    : "text-gray-500 hover:text-purple-600 hover:bg-gray-100 transition-transform hover:scale-110 rounded-md p-1";

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
    <nav
      className={`fixed top-0 w-full z-50 border-b ${navBg} flex items-center justify-between px-4 md:px-8 py-3`}
      aria-label="Main Navigation"
    >
      {/* Logo */}
      <Link href="/" aria-label="Home">
        <a className="flex items-center space-x-2">
          <Image
            src={darkMode ? logoDark : logoLight}
            alt="Jal Wi Ki Logo"
            width={140}
            height={40}
            priority
          />
        </a>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} passHref>
              <a
                className={cn(
                  desktopLinkBase,
                  isActive(item.href)
                    ? desktopLinkActive
                    : desktopLinkInactive,
                  "flex items-center space-x-1"
                )}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}

        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
          className={themeToggleStyle}
          title="Toggle Light/Dark mode"
          type="button"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User actions */}
        {user ? (
          <>
            <Link href="/dashboard">
              <a
                className={cn(
                  desktopLinkBase,
                  desktopLinkInactive,
                  "flex items-center space-x-1"
                )}
              >
                <User size={18} />
                <span>Profile</span>
              </a>
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className={cn(
                desktopLinkBase,
                desktopLinkInactive,
                "flex items-center space-x-1"
              )}
              type="button"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link href="/auth">
            <a
              className={cn(
                desktopLinkBase,
                desktopLinkInactive,
                "flex items-center space-x-1"
              )}
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </a>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={iconButtonStyle}
        aria-expanded={mobileMenuOpen}
        aria-label="Toggle mobile menu"
        type="button"
      >
        {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md border-t border-gray-200 dark:border-gray-700 md:hidden`}
          role="menu"
          aria-label="Mobile Navigation"
        >
          <div className="flex flex-col px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <a
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200",
                    isActive(item.href)
                      ? darkMode
                        ? "bg-purple-500/30 text-purple-300"
                        : "bg-purple-100 text-purple-700"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-purple-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  role="menuitem"
                >
                  <item.icon className="mr-2" size={20} />
                  {item.label}
                </a>
              </Link>
            ))}

            <button
              onClick={() => {
                toggleDarkMode();
                setMobileMenuOpen(false);
              }}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-base font-medium transition-transform hover:scale-105",
                darkMode
                  ? "bg-gray-800 text-gray-400 hover:text-purple-400 hover:bg-gray-700/60"
                  : "bg-gray-200 text-gray-600 hover:text-purple-600 hover:bg-gray-100"
              )}
              role="menuitem"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
              Toggle Theme
            </button>

            {user ? (
              <>
                <Link href="/dashboard">
                  <a
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-base font-medium",
                      isActive("/dashboard")
                        ? darkMode
                          ? "bg-purple-500/30 text-purple-300"
                          : "bg-purple-100 text-purple-700"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-purple-400"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    role="menuitem"
                  >
                    <User className="mr-2" size={20} />
                    Profile
                  </a>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    router.push("/");
                  }}
                  className={cn(
                    "w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium",
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-purple-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  role="menuitem"
                >
                  <LogOut className="mr-2" size={20} />
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth">
                <a
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-base font-medium",
                    isActive("/auth")
                      ? darkMode
                        ? "bg-purple-500/30 text-purple-300"
                        : "bg-purple-100 text-purple-700"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-purple-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  role="menuitem"
                >
                  <LogIn className="mr-2" size={20} />
                  Sign In
                </a>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
