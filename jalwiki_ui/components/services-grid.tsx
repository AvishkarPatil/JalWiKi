"use client";

import { Brain, Droplets, Filter, Users, Home, Droplet, BrainCircuit, Library, MessageSquare, Info } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link"; // Import Link

const servicesData = [
  {
    iconName: "Filter",
    title: "Smart Technique Suggestions",
    description: "Intelligent filters for relevant water-saving techniques based on your needs and location.",
  },
  {
    iconName: "Brain",
    title: "Water AI",
    description: "AI-powered insights for water usage forecasts and smart conservation alerts.",
  },
  {
    iconName: "Droplets",
    title: "Government Collaboration",
    description: "Connecting citizens with verified schemes and subsidies from government bodies.",
  },
  {
    iconName: "Users",
    title: "Expert Guidance & Community",
    description: "Connect with experts and contribute through our community platform.",
  },
];

// Navigation items for mapping
const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/techniques", label: "Techniques", icon: Droplet },
  { href: "/waterai", label: "WaterAI", icon: BrainCircuit },
  { href: "/gov", label: "Gov & NGO", icon: Library },
  { href: "/forum", label: "Forums", icon: MessageSquare },
  { href: "/about", label: "About", icon: Info },
];

// Map service title to navItem href
const serviceTitleToHref: Record<string, string> = {
  "Smart Technique Suggestions": "/techniques",
  "Water AI": "/waterai",
  "Government Collaboration": "/gov",
  "Expert Guidance & Community": "/forum",
};

const renderIcon = (iconName: string, className: string) => {
  // ...existing code...
  switch (iconName) {
    case "Filter":
      return <Filter className={className} />;
    case "Brain":
      return <Brain className={className} />;
    case "Droplets":
      return <Droplets className={className} />;
    case "Users":
      return <Users className={className} />;
    default:
      return null;
  }
};

export function ServicesGrid() {
  const { darkMode } = useTheme();

  const gridContainerVariants = {
    // ...existing code...
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const gridItemVariants = {
    // ...existing code...
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const cardHoverEffect = {
    // ...existing code...
    y: -5,
    scale: 1.03,
    boxShadow: darkMode
      ? "0 10px 20px rgba(168, 85, 247, 0.15)"
      : "0 10px 20px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 }
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
      variants={gridContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {servicesData.map((service, index) => (
        <motion.div
          key={index}
          className={cn(
            "rounded-lg p-6 transition-shadow duration-300",
            darkMode
              ? "bg-gray-950 shadow-lg shadow-purple-900/10 border border-gray-800 hover:border-purple-600"
              : "bg-white shadow-md hover:shadow-lg border border-gray-200 hover:border-purple-300"
          )}
          variants={gridItemVariants}
          whileHover={cardHoverEffect}
        >
          <div className="flex items-start">
            <div
              className={cn(
                "mr-4 p-3 rounded-full",
                darkMode ? "bg-purple-600/20" : "bg-purple-100"
              )}
            >
              {renderIcon(
                service.iconName,
                cn("h-8 w-8", darkMode ? "text-purple-400" : "text-purple-600")
              )}
            </div>
            <div>
              <h3
                className={cn(
                  "text-xl font-semibold mb-2",
                  darkMode ? "text-gray-100" : "text-gray-900"
                )}
              >
                {service.title}
              </h3>
              <p
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-600"
                )}
              >
                {service.description}
              </p>
            </div>
          </div>
          {/* Add Learn More button */}
          <div className="mt-6 flex justify-end">
            <Link
              href={serviceTitleToHref[service.title] || "/"}
              className={cn(
                "inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors",
                darkMode
                  ? "bg-purple-700 text-white hover:bg-purple-800"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              )}
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}