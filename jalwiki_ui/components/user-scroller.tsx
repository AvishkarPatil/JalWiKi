"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
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

// Function to get theme-aware classes using design system tokens
const getThemeAwareCircleClasses = (baseColor: string) => {
  const colorMap = {
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      border: "border-purple-300/50 dark:border-purple-500/30",
      hover: "hover:bg-purple-200/80 dark:hover:bg-purple-800/40 hover:border-purple-400/70 dark:hover:border-purple-400/50"
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900/30",
      border: "border-green-300/50 dark:border-green-500/30",
      hover: "hover:bg-green-200/80 dark:hover:bg-green-800/40 hover:border-green-400/70 dark:hover:border-green-400/50"
    },
    yellow: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      border: "border-yellow-300/50 dark:border-yellow-500/30",
      hover: "hover:bg-yellow-200/80 dark:hover:bg-yellow-800/40 hover:border-yellow-400/70 dark:hover:border-yellow-400/50"
    },
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      border: "border-blue-300/50 dark:border-blue-500/30",
      hover: "hover:bg-blue-200/80 dark:hover:bg-blue-800/40 hover:border-blue-400/70 dark:hover:border-blue-400/50"
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900/30",
      border: "border-red-300/50 dark:border-red-500/30",
      hover: "hover:bg-red-200/80 dark:hover:bg-red-800/40 hover:border-red-400/70 dark:hover:border-red-400/50"
    },
    teal: {
      bg: "bg-teal-100 dark:bg-teal-900/30",
      border: "border-teal-300/50 dark:border-teal-500/30",
      hover: "hover:bg-teal-200/80 dark:hover:bg-teal-800/40 hover:border-teal-400/70 dark:hover:border-teal-400/50"
    },
    orange: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      border: "border-orange-300/50 dark:border-orange-500/30",
      hover: "hover:bg-orange-200/80 dark:hover:bg-orange-800/40 hover:border-orange-400/70 dark:hover:border-orange-400/50"
    },
    indigo: {
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
      border: "border-indigo-300/50 dark:border-indigo-500/30",
      hover: "hover:bg-indigo-200/80 dark:hover:bg-indigo-800/40 hover:border-indigo-400/70 dark:hover:border-indigo-400/50"
    }
  };

  const colors = colorMap[baseColor as keyof typeof colorMap] || {
    bg: "bg-gray-100 dark:bg-gray-800/30",
    border: "border-gray-300/50 dark:border-gray-500/30",
    hover: "hover:bg-gray-200/80 dark:hover:bg-gray-700/40 hover:border-gray-400/70 dark:hover:border-gray-400/50"
  };

  return cn(
    "border-2 transition-all duration-300 ease-out transform-gpu",
    "group-hover:shadow-lg",
    colors.bg,
    colors.border,
    colors.hover
  );
};


export function UserScroller() {
  const scrollerRef = useRef<HTMLDivElement>(null);
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
                  getThemeAwareCircleClasses(user.baseColor)
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
                className="text-base font-semibold text-foreground/90 transition-colors duration-300 group-hover:text-foreground"
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