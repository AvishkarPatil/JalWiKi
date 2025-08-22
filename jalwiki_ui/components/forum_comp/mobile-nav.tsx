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

  const navLinkBase = "flex items-center gap-3 rounded-md px-3 py-2 transition-colors text-foreground hover:bg-accent/50 hover:text-accent-foreground";
  const navIconClass = "h-5 w-5 text-primary";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[350px] p-0 bg-background border-r border-border"
      >
        <SheetHeader
          className="p-4 border-b border-border"
        >
          <SheetTitle
            className="flex items-center gap-2 text-primary"
          >
            <Droplet className="h-5 w-5 text-primary" />
            <span className="font-bold">WaterForum</span>
          </SheetTitle>
          <SheetClose
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 text-muted-foreground hover:text-foreground focus:ring-primary focus:ring-offset-background"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        <div className="py-4 px-4">
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              className={navLinkBase}
              onClick={onClose}
            >
              <Home className={navIconClass} />
              <span>All Forums</span>
            </Link>
            <Link
              href="/new-posts" // Should this be /forum/new or similar?
              className={navLinkBase}
              onClick={onClose}
            >
              <PlusCircle className={navIconClass} />
              <span>New Posts</span>
            </Link>
            <Link
              href="/discussions" // Consider /forum?category=discussion
              className={navLinkBase}
              onClick={onClose}
            >
              <MessageSquare className={navIconClass} />
              <span>Discussions</span>
            </Link>
            <Link
              href="/resources" // Consider /forum?category=resource
              className={navLinkBase}
              onClick={onClose}
            >
              <FileText className={navIconClass} />
              <span>Resources</span>
            </Link>
            <Link
              href="/announcements" // Consider /forum?category=announcement
              className={navLinkBase}
              onClick={onClose}
            >
              <Megaphone className={navIconClass} />
              <span>Announcements</span>
            </Link>
            <Link
              href="/saved" // Consider /forum/saved
              className={navLinkBase}
              onClick={onClose}
            >
              <Bookmark className={navIconClass} />
              <span>Saved</span>
            </Link>
            <Link
              href="/following" // Consider /forum/following
              className={navLinkBase}
              onClick={onClose}
            >
              <Users className={navIconClass} />
              <span>Following</span>
            </Link>
            <Link
              href="/about"
              className={navLinkBase}
              onClick={onClose}
            >
              <Info className={navIconClass} />
              <span>About us</span>
            </Link>
          </nav>

          <div className="mt-6 space-y-2">
            <h3
              className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Popular Tags
            </h3>
            <div className="space-y-1">
              <Link
                href="/tag/conservation"
                className={`${navLinkBase} text-sm font-medium`}
                onClick={onClose}
              >
                <Hash className={navIconClass} />
                <span>conservation</span>
              </Link>
              <Link
                href="/tag/irrigation"
                className={`${navLinkBase} text-sm font-medium`}
                onClick={onClose}
              >
                <Hash className={navIconClass} />
                <span>irrigation</span>
              </Link>
              <Link
                href="/tag/rainwater"
                className={`${navLinkBase} text-sm font-medium`}
                onClick={onClose}
              >
                <Hash className={navIconClass} />
                <span>rainwater</span>
              </Link>
            </div>
          </div>

          <div
            className="mt-6 pt-4 flex items-center gap-4 border-t border-border"
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-accent/50"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50"
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