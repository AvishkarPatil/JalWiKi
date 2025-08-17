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
    if (path === "/techniques") return pathname.startsWith("/techniques");
    if (path === "/forum") return pathname.startsWith("/forum");
    if (path === "/gov") return pathname.startsWith("/gov");
    return pathname === path;
  };

  const navBg = darkMode
    ? "bg-gray-900/90 border-gray-800 backdrop-blur-md shadow-lg"
    : "bg-slate-50/90 border-gray-200 backdrop-blur-md shadow-md";

  const linkBase =
    "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition duration-300 ease-in-out";
  const linkActive = darkMode
    ? "text-purple-400 bg-purple-500/20 border-b-2 border-purple-400"
    : "text-purple-600 bg-purple-500/10 border-b-2 border-purple-600";
  const linkInactive = darkMode
    ? "text-gray-400 hover:text-purple-400 hover:bg-gray-700/60"
    : "text-gray-600 hover:text-purple-600 hover:bg-gray-100";

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/techniques", label: "Techniques", icon: Droplet },
    { href: "/waterai", label: "WaterAI", icon: BrainCircuit },
    { href: "/gov", label: "Gov & NGO", icon: Library },
    { href: "/forum", label: "Forums", icon: MessageSquare },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 border-b ${navBg} flex items-center justify-between px-4 md:px-8 py-3`}
      aria-label="Main Navigation"
    >
      {/* Logo */}
      <Link href="/" aria-label="Home" className="flex items-center space-x-2">
        <Image
          src={darkMode ? "/logo-dark.png" : "/logo-light.png"}
          alt="Jal Wi Ki Logo"
          width={140}
          height={40}
          priority
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/fallback-logo.png";
          }}
        />
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              linkBase,
              isActive(href) ? linkActive : linkInactive,
              "flex items-center space-x-1"
            )}
            aria-current={isActive(href) ? "page" : undefined}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
          className="rounded-full p-1 transition-transform hover:scale-110"
          type="button"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Auth Buttons */}
        {user ? (
          <>
            <Link
              href="/dashboard"
              className={cn(linkBase, linkInactive, "flex items-center space-x-1")}
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className={cn(linkBase, linkInactive, "flex items-center space-x-1")}
              type="button"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link
            href="/auth"
            className={cn(linkBase, linkInactive, "flex items-center space-x-1")}
          >
            <LogIn size={18} />
            <span>Sign In</span>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="ml-2 p-1 rounded-md"
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle mobile menu"
        type="button"
      >
        {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md border-t border-gray-200 dark:border-gray-700 md:hidden"
        >
          <ul className="flex flex-col px-4 py-3 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-base font-medium",
                    isActive(href)
                      ? darkMode
                        ? "bg-purple-500/30 text-purple-300"
                        : "bg-purple-100 text-purple-700"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-purple-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="mr-2" size={20} />
                  {label}
                </Link>
              </li>
            ))}

            {/* Theme Toggle */}
            <li>
              <button
                onClick={() => {
                  toggleDarkMode();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium w-full"
              >
                {darkMode ? <Sun size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
                Toggle Theme
              </button>
            </li>

            {/* Auth Buttons */}
            <li>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium"
                  >
                    <User className="mr-2" size={20} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      router.push("/");
                    }}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium w-full"
                  >
                    <LogOut className="mr-2" size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium"
                >
                  <LogIn className="mr-2" size={20} />
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
