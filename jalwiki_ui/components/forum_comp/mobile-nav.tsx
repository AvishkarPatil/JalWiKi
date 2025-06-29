"use client"

import {
  Droplet,
  Home,
  MessageSquare,
  FileText,
  Megaphone,
  Bookmark,
  Users,
  Info,
  X,
  User,
  Bell,
  Hash,
  PlusCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"; // Import useTheme
import { cn } from "@/lib/utils"; // Import cn

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { darkMode } = useTheme(); // Get darkMode state

  const navLinkBase = "flex items-center gap-3 rounded-md px-3 py-2 transition-colors";
  const navLinkLight = "text-gray-700 hover:bg-gray-100 hover:text-purple-700";
  const navLinkDark = "text-gray-300 hover:bg-gray-700/60 hover:text-purple-400";
  const navIconLight = "text-purple-600";
  const navIconDark = "text-purple-400";

  const actionButtonLight = "text-gray-500 hover:text-purple-600";
  const actionButtonDark = "text-gray-400 hover:text-purple-400 hover:bg-gray-700/60";


  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className={cn(
          "w-[300px] sm:w-[350px] p-0",
          darkMode ? "bg-gray-900 border-r border-gray-800" : "bg-white border-r border-gray-200"
        )}
      >
        <SheetHeader
          className={cn(
            "p-4",
            darkMode ? "border-b border-gray-800" : "border-b border-gray-200"
          )}
        >
          <SheetTitle
            className={cn(
              "flex items-center gap-2",
              darkMode ? "text-purple-400" : "text-purple-700"
            )}
          >
            <Droplet className={cn("h-5 w-5", darkMode ? "text-purple-400" : "text-purple-600")} />
            <span className="font-bold">WaterForum</span>
          </SheetTitle>
          <SheetClose
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100",
              darkMode ? "text-gray-400 hover:text-gray-200 focus:ring-purple-500 ring-offset-gray-900" : "focus:ring-purple-500 ring-offset-white"
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        <div className="py-4 px-4">
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              className={cn(navLinkBase, darkMode ? navLinkDark : navLinkLight)}
              onClick={onClose}
            >
              <Home className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
              <span>All Forums</span>
            </Link>
            <Link
              href="/new-posts" // Should this be /forum/new or similar?
              className={cn(navLinkBase, darkMode ? navLinkDark : navLinkLight)}
              onClick={onClose}
            >
              <PlusCircle className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
              <span>New Posts</span>
            </Link>
            <Link
              href="/discussions" // Consider /forum?category=discussion
              className={cn(navLinkBase, darkMode ? navLinkDark : navLinkLight)}
              onClick={onClose}
            >
              <MessageSquare className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
              <span>Discussions</span>
            </Link>
            <Link
              href="/resources" // Consider /forum?category=resource
              className={cn(navLinkBase, darkMode ? navLinkDark : navLinkLight)}
              onClick={onClose}
            >
              <FileText className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
              <span>Resources</span>
            </Link>
            <Link
              href="/announcements" // Consider /forum?category=announcement
              className={cn(navLinkBase, darkMode ? navLinkDark : navLinkLight)}
              onClick={onClose}
            >
              <Megaphone className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
              <span>Announcements</span>
            </Link>
            <Link
              href="/saved" // Consider /forum/saved
              className={cn(navLinkBase, darkMode ? navLinkDark : navLinkLight)}
              onClick={onClose}
            >
              <Bookmark className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
              <span>Saved</span>
            </Link>
            <Link
              href="/following" // Consider /forum/following
              className={cn(navLinkBase, darkMode ? navLinkDark : navLinkLight)}
              onClick={onClose}
            >
              <Users className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
              <span>Following</span>
            </Link>
            <Link
              href="/about"
              className={cn(navLinkBase, darkMode ? navLinkDark : navLinkLight)}
              onClick={onClose}
            >
              <Info className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
              <span>About us</span>
            </Link>
          </nav>

          <div className="mt-6 space-y-2">
            <h3
              className={cn(
                "px-3 text-xs font-semibold uppercase tracking-wider",
                darkMode ? "text-gray-500" : "text-gray-500" // gray-500 often works for both
              )}
            >
              Popular Tags
            </h3>
            <div className="space-y-1">
              <Link
                href="/tag/conservation"
                className={cn(navLinkBase, "text-sm font-medium", darkMode ? navLinkDark : navLinkLight)}
                onClick={onClose}
              >
                <Hash className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
                <span>conservation</span>
              </Link>
              <Link
                href="/tag/irrigation"
                className={cn(navLinkBase, "text-sm font-medium", darkMode ? navLinkDark : navLinkLight)}
                onClick={onClose}
              >
                <Hash className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
                <span>irrigation</span>
              </Link>
              <Link
                href="/tag/rainwater"
                className={cn(navLinkBase, "text-sm font-medium", darkMode ? navLinkDark : navLinkLight)}
                onClick={onClose}
              >
                <Hash className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
                <span>rainwater</span>
              </Link>
            </div>
          </div>

          <div
            className={cn(
              "mt-6 pt-4 flex items-center gap-4",
              darkMode ? "border-t border-gray-800" : "border-t border-gray-200"
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className={cn(darkMode ? actionButtonDark : actionButtonLight)}
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-full", darkMode ? actionButtonDark : actionButtonLight)}
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}