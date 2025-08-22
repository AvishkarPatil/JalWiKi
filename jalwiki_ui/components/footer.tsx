"use client"

import Link from "next/link"
import { Twitter, Github, Linkedin, Rss, Mail, Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/theme-context"

export function Footer() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <footer className="border-t border-border bg-background/50 py-12 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold tracking-tighter text-foreground">
                Jal<span className="text-primary">WiKi</span>
              </Link>
            </div>
            
            <p className="text-muted-foreground text-sm">
              Exploring sustainable water management and conservation techniques.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://x.com/HeyAvishkar" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="https://github.com/AvishkarPatil/JalWiKi" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="https://www.linkedin.com/in/TheAvishkar" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              {/* <Link href="#" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <Rss className="h-5 w-5" /> 
              </Link>*/}
            </div>
          </div>
          <div className="text-left">
            <h3 className="font-medium mb-4">Techniques</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="https://jalwiki.vercel.app/techniques/drip-irrigation-system" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Drip Irrigation System
                </Link>
              </li>
              <li>
                <Link 
                  href="https://jalwiki.vercel.app/techniques/contour-farming" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contour Farming
                </Link>
              </li>
              <li>
                <Link 
                  href="https://jalwiki.vercel.app/techniques/rainwater-harvesting" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rainwater Harvesting
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-left">
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Research Papers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-left">
            <h3 className="font-medium mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contact@jalwiki.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-6 text-sm text-left">
          <p className="text-muted-foreground">© {new Date().getFullYear()} JalWiki. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

