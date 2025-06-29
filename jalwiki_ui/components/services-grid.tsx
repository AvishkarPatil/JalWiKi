"use client";

import { Brain, Droplets, Filter, Users } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"; // Import motion

const servicesData = [
  // ... (your servicesData remains the same)
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

const renderIcon = (iconName: string, className: string) => {
  // ... (renderIcon remains the same)
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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Stagger animation of each card
        delayChildren: 0.1, // Optional delay before children start animating
      },
    },
  };

  const gridItemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const cardHoverEffect = {
    y: -5,
    scale: 1.03,
    boxShadow: darkMode
      ? "0 10px 20px rgba(168, 85, 247, 0.15)" // Purple shadow
      : "0 10px 20px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 }
  };


  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
      variants={gridContainerVariants}
      initial="hidden"
      // Trigger animation when this grid comes into view
      // This ensures it animates relative to its own appearance,
      // not just when the parent section on page.tsx appears.
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }} // Adjust amount as needed
    >
      {servicesData.map((service, index) => (
        <motion.div
          key={index}
          className={cn(
            "rounded-lg p-6 transition-shadow duration-300", // Removed hover:scale from here
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
        </motion.div>
      ))}
    </motion.div>
  );
}