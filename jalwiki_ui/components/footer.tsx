"use client"

import Link from "next/link"
import { Twitter, Github, Linkedin, Rss, Mail, Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/theme-context"

export function Footer() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <footer className={`border-t ${
      darkMode 
        ? 'bg-gray-900 border-gray-800 text-gray-300' 
        : 'bg-gray-100 border-gray-200 text-gray-700'
    } py-12 transition-colors duration-200`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold tracking-tighter">
                Jal<span className={darkMode ? "text-blue-400" : "text-blue-600"}>Wiki</span>
              </Link>
              
              {/* Dark/Light Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  darkMode 
                    ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                } transition-colors duration-200`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
            
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              Exploring sustainable water management and conservation techniques.
            </p>
            <div className="flex space-x-4">
              <Link href="https://x.com/HeyAvishkar" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://github.com/AvishkarPatil/JalWiKi" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://www.linkedin.com/in/TheAvishkar" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
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
                <Link href="https://jalwiki.vercel.app/techniques/drip-irrigation-system" className={`${darkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                  Drip Irrigation System
                </Link>
              </li>
              <li>
                <Link href="https://jalwiki.vercel.app/techniques/contour-farming" className={`${darkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                  Counter Farming
                </Link>
              </li>
              <li>
                <Link href="https://jalwiki.vercel.app/techniques/rainwater-harvesting" className={`${darkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                  Rainwater Harvesting
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-left">
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className={`${darkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="#" className={`${darkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                  Research Papers
                </Link>
              </li>
              <li>
                <Link href="#" className={`${darkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-left">
            <h3 className="font-medium mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@jalwiki.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-300'} mt-12 pt-6 text-sm text-left`}>
          <p>© {new Date().getFullYear()} JalWiki. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

