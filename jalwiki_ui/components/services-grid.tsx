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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: {
    y: -4,
    transition: { duration: 0.2 },
  },
};

export function ServicesGrid() {
  const { darkMode } = useTheme();

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {servicesData.map((service, index) => (
        <motion.div
          key={index}
          className={cn(
            "relative rounded-xl p-6 transition-all duration-300 border border-border bg-card",
            "hover:shadow-md hover:shadow-accent/10 hover:border-primary/20"
          )}
          variants={itemVariants}
          whileHover="hover"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-accent/10 text-primary">
              {renderIcon(service.iconName, "h-6 w-6")}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Link
              href={serviceTitleToHref[service.title] || "/"}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "bg-primary text-primary-foreground hover:bg-primary/90"
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