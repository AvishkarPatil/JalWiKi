"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useTheme } from "@/context/theme-context"
import { cn } from "@/lib/utils"

const usersData = [
  { name: "Students", icon: "https://cdn-icons-png.flaticon.com/512/5850/5850276.png", baseColor: "purple" },
  { name: "Households", icon: "https://cdn-icons-png.flaticon.com/512/16848/16848691.png", baseColor: "green" },
  { name: "Farmers", icon: "https://cdn-icons-png.flaticon.com/512/843/843349.png", baseColor: "yellow" },
  { name: "NGOs", icon: "https://cdn-icons-png.flaticon.com/512/9235/9235319.png", baseColor: "blue" },
  { name: "Industries", icon: "https://cdn-icons-png.flaticon.com/256/4514/4514899.png", baseColor: "red" },
  { name: "Government Bodies", icon: "https://i.ibb.co/qMsHVfZr/Emblem-of-India.png", baseColor: "teal" },
  { name: "Researchers", icon: "https://cdn-icons-png.flaticon.com/512/1876/1876739.png", baseColor: "orange" },
  { name: "Educational Institutions", icon: "https://cdn-icons-png.flaticon.com/512/224/224545.png", baseColor: "indigo" },
]

// Helper to generate placeholder URLs if actual icons are missing
const getIconUrl = (iconPath: string, name: string) => {
  // Basic check, in a real app you might have a more robust way to check if icons exist
  // For now, if it doesn't start with /icons/, assume it's a placeholder request
  if (!iconPath.startsWith("/icons/")) return iconPath;
  // Fallback to placeholder if you want to handle missing specific icons
  return iconPath; // Or return a placeholder like `/placeholder.svg?text=${name.charAt(0)}...`
};

// Duplicate users for the infinite scroll illusion
const duplicatedUsers = [...usersData, ...usersData, ...usersData]; // Tripled for smoother long scroll

// Function to get theme-aware classes with explicit color definitions
const getThemeAwareCircleClasses = (baseColor: string, darkMode: boolean) => {
  let bgClass = "", borderClass = "", hoverBgClass = "", hoverBorderClass = "";

  switch (baseColor) {
    case "purple":
      bgClass = darkMode ? "bg-purple-600/10" : "bg-purple-100";
      borderClass = darkMode ? "border-purple-500/30" : "border-purple-300/50";
      hoverBgClass = darkMode ? "group-hover:bg-purple-500/20" : "group-hover:bg-purple-200/80";
      hoverBorderClass = darkMode ? "group-hover:border-purple-400/60" : "group-hover:border-purple-400/70";
      break;
    case "green":
      bgClass = darkMode ? "bg-green-600/10" : "bg-green-100";
      borderClass = darkMode ? "border-green-500/30" : "border-green-300/50";
      hoverBgClass = darkMode ? "group-hover:bg-green-500/20" : "group-hover:bg-green-200/80";
      hoverBorderClass = darkMode ? "group-hover:border-green-400/60" : "group-hover:border-green-400/70";
      break;
    case "yellow":
      bgClass = darkMode ? "bg-yellow-500/10" : "bg-yellow-100"; // Adjusted yellow for dark mode
      borderClass = darkMode ? "border-yellow-400/30" : "border-yellow-300/50";
      hoverBgClass = darkMode ? "group-hover:bg-yellow-400/20" : "group-hover:bg-yellow-200/80";
      hoverBorderClass = darkMode ? "group-hover:border-yellow-400/60" : "group-hover:border-yellow-400/70";
      break;
    case "blue":
      bgClass = darkMode ? "bg-blue-600/10" : "bg-blue-100";
      borderClass = darkMode ? "border-blue-500/30" : "border-blue-300/50";
      hoverBgClass = darkMode ? "group-hover:bg-blue-500/20" : "group-hover:bg-blue-200/80";
      hoverBorderClass = darkMode ? "group-hover:border-blue-400/60" : "group-hover:border-blue-400/70";
      break;
    case "red":
      bgClass = darkMode ? "bg-red-600/10" : "bg-red-100";
      borderClass = darkMode ? "border-red-500/30" : "border-red-300/50";
      hoverBgClass = darkMode ? "group-hover:bg-red-500/20" : "group-hover:bg-red-200/80";
      hoverBorderClass = darkMode ? "group-hover:border-red-400/60" : "group-hover:border-red-400/70";
      break;
    case "teal":
      bgClass = darkMode ? "bg-teal-600/10" : "bg-teal-100";
      borderClass = darkMode ? "border-teal-500/30" : "border-teal-300/50";
      hoverBgClass = darkMode ? "group-hover:bg-teal-500/20" : "group-hover:bg-teal-200/80";
      hoverBorderClass = darkMode ? "group-hover:border-teal-400/60" : "group-hover:border-teal-400/70";
      break;
    case "orange":
      bgClass = darkMode ? "bg-orange-500/10" : "bg-orange-100"; // Adjusted orange for dark mode
      borderClass = darkMode ? "border-orange-400/30" : "border-orange-300/50";
      hoverBgClass = darkMode ? "group-hover:bg-orange-400/20" : "group-hover:bg-orange-200/80";
      hoverBorderClass = darkMode ? "group-hover:border-orange-400/60" : "group-hover:border-orange-400/70";
      break;
    case "indigo":
      bgClass = darkMode ? "bg-indigo-600/10" : "bg-indigo-100";
      borderClass = darkMode ? "border-indigo-500/30" : "border-indigo-300/50";
      hoverBgClass = darkMode ? "group-hover:bg-indigo-500/20" : "group-hover:bg-indigo-200/80";
      hoverBorderClass = darkMode ? "group-hover:border-indigo-400/60" : "group-hover:border-indigo-400/70";
      break;
    default:
      bgClass = darkMode ? "bg-gray-700/20" : "bg-gray-100";
      borderClass = darkMode ? "border-gray-600/30" : "border-gray-300/50";
      hoverBgClass = darkMode ? "group-hover:bg-gray-600/30" : "group-hover:bg-gray-200/80";
      hoverBorderClass = darkMode ? "group-hover:border-gray-500/60" : "group-hover:border-gray-400/70";
  }
  return cn(bgClass, "border-2", borderClass, hoverBgClass, hoverBorderClass, "group-hover:shadow-xl");
};


export function UserScroller() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { darkMode } = useTheme();
  const [scrollWidthToAnimate, setScrollWidthToAnimate] = useState(0);

  useLayoutEffect(() => {
    if (scrollerRef.current) {
      // Width of one set of original items
      const singleSetWidth = scrollerRef.current.scrollWidth / (duplicatedUsers.length / usersData.length);
      setScrollWidthToAnimate(singleSetWidth * 2); // Animate by two sets for smoother long loop with tripled data
    }
  }, []);

  const scrollerContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const userItemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] } },
  };

  const scrollDuration = usersData.length * 3.5; // Slower, more graceful scroll

  return (
    <>
      {/*
        IMPORTANT: For the gradient edge fading to work with your theme,
        add the following CSS to your global CSS file (e.g., globals.css or styles.css):

        .user-scroller-container {
          position: relative;
          --scroller-fade-bg: hsl(var(--background)); // Uses your Tailwind CSS variable
        }

        .user-scroller-container::before,
        .user-scroller-container::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px; // Adjust fade width as needed
          z-index: 2;
          pointer-events: none;
        }

        .user-scroller-container::before {
          left: 0;
          background: linear-gradient(to right, var(--scroller-fade-bg) 20%, transparent);
        }

        .user-scroller-container::after {
          right: 0;
          background: linear-gradient(to left, var(--scroller-fade-bg) 20%, transparent);
        }
      */}
      <motion.div
        className="w-full overflow-hidden py-8 user-scroller-container" // Added class for gradient mask
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div
          ref={scrollerRef}
          className="flex gap-x-10" // Using gap for spacing
          style={{ perspective: '1200px' }} // For 3D hover effect
          variants={scrollerContainerVariants}
          animate={scrollWidthToAnimate > 0 ? { x: [0, -scrollWidthToAnimate] } : {}}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: scrollDuration,
              ease: "linear",
            },
          }}
        >
          {duplicatedUsers.map((user, index) => (
            <motion.div
              key={`${user.name}-${index}`}
              className="flex flex-col items-center flex-shrink-0 w-36 text-center group cursor-pointer" // Wider items
              variants={userItemVariants}
              animate={{ y: ["0rem", "-0.3rem", "0rem"] }} // Idle bobbing
              transition={{
                y: {
                  duration: 2 + (index % usersData.length) * 0.2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
              }}
              whileHover={{
                y: -12,
                scale: 1.1,
                rotateY: index % 2 === 0 ? 10 : -10, // Alternate tilt direction
                rotateX: -5,
                zIndex: 10,
                transition: { type: "spring", stiffness: 250, damping: 15 }
              }}
            >
              <div
                className={cn(
                  "w-28 h-28 rounded-full flex items-center justify-center mb-4 overflow-hidden transition-all duration-300 ease-out transform-gpu", // Larger circles
                  getThemeAwareCircleClasses(user.baseColor, darkMode)
                )}
              >
                <Image
                  src={getIconUrl(user.icon, user.name)}
                  alt={user.name}
                  width={64} // Larger image
                  height={64}
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                  unoptimized={user.icon.includes("placeholder.svg")} // If using SVG placeholders
                />
              </div>
              <span
                className={cn(
                  "text-base font-semibold transition-colors duration-300", // Slightly larger font
                  darkMode ? "text-gray-200 group-hover:text-white" : "text-gray-700 group-hover:text-black"
                )}
              >
                {user.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>
  )
}