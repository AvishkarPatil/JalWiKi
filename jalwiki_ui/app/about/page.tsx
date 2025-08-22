"use client"

import { motion } from "framer-motion"
import { Droplets, BookOpen, Users, Lightbulb, Settings, Globe, UserCheck, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/theme-context" // For theme toggling
import { cn } from "@/lib/utils" // For conditional class names

export default function AboutPage() {
  const { darkMode } = useTheme(); // Get current theme state

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2, // Stagger children animations
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const cardHoverEffect = "hover:border-primary/50 hover:shadow-md transition-all duration-200";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section: Our Mission & About Us */}
      <motion.section
        className="pt-24 pb-16 px-4"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
            variants={itemVariants}
          >
            Our Mission: Every Drop Counts
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8 text-muted-foreground"
            variants={itemVariants}
          >
            JalWiki champions water conservation through shared knowledge and community action.
            We empower individuals to preserve this vital resource for a sustainable future.
          </motion.p>
          <motion.div variants={itemVariants}>
            <motion.div
              className="w-24 h-1 mx-auto mb-10 bg-primary"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "circOut" }}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Our Motive Section */}
      <motion.section
        className="py-12 px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible" // Animate when section scrolls into view
        viewport={{ once: true, amount: 0.3 }} // Trigger animation once, when 30% is visible
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants} className="inline-flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, -15, 15, -15, 0], scale: [1, 1.1, 1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            >
              <Droplets className="mr-3 h-8 w-8 text-primary" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Why We Do This
            </h2>
          </motion.div>
          <motion.p
            className="text-lg leading-relaxed max-w-3xl mx-auto text-muted-foreground"
            variants={itemVariants}
          >
            Water is life. Facing global scarcity, JalWiki unites innovation and wisdom to inspire actionable water-saving solutions for everyone.
          </motion.p>
        </div>
      </motion.section>

      {/* What We Provide Section */}
      <motion.section
        className="py-16 px-4 bg-muted/50"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
            variants={itemVariants}
          >
            What JalWiki Offers
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: BookOpen, title: "Knowledge Hub", description: "Explore diverse water-saving articles, guides, and research." },
              { icon: Users, title: "Community Forum", description: "Connect, discuss, and learn from shared experiences with peers and experts." },
              { icon: Lightbulb, title: "Innovation Platform", description: "Discover and share local solutions, DIY projects, and success stories." },
              { icon: UserCheck, title: "Personalized Journey", description: "Save techniques, track discussions, and contribute your knowledge." },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className={cn(
                  "p-6 rounded-xl shadow-md border border-border bg-card",
                  cardHoverEffect
                )}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-start">
                  <div className="p-3 rounded-lg mr-4 bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-primary">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How This Works Section */}
      <motion.section
        className="py-16 px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants} className="inline-flex items-center justify-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity, ease: "linear" } }}
            >
              <Settings className="mr-3 h-8 w-8 text-primary" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              How JalWiki Works
            </h2>
          </motion.div>
          <motion.p
            className="text-lg leading-relaxed max-w-3xl mx-auto mb-8"
            variants={itemVariants}
          >
            JalWiki is intuitive: Explore curated content, engage in forums, share insights, and find practical water conservation methods.
            We make saving water accessible to all.
          </motion.p>
          <motion.div variants={itemVariants}>
            {/* Corrected Button Animation */}
            <motion.div
              className="inline-block" // Ensures the motion.div behaves like a button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild
                className="px-8 py-3 text-lg"
              >
                <Link href="/techniques">Explore Techniques</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="py-16 px-4 bg-muted/50"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-16 text-center text-foreground"
            variants={itemVariants}
          >
            Meet the Team
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Avishkar Patil", role: "Lead Developer", image: "https://i.ibb.co/YzbR4Kc/avi.jpg" },
              { name: "Akash Patil", role: "Frontend Developer", image: "https://i.ibb.co/KzyPnhBD/akash.jpg" },
              { name: "Lucky Nawale", role: "Backend Developer", image: "https://i.ibb.co/4nzwWy7D/lucky.jpg" },
              { name: "Aditya Mulik", role: "UI/UX & Content", image: "https://i.ibb.co/kVCw13XK/aditya.jpg" },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                className="flex flex-col items-center group" // Added group for hover effects
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <div className="relative mb-4">
                  <div className={cn(
                    "w-36 h-36 rounded-full overflow-hidden border-4 relative z-10 transition-all duration-300 group-hover:shadow-2xl",
"border-primary/50 group-hover:border-primary/80"
                  )}>
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className={cn(
                    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%+20px)] h-[calc(100%+20px)] rounded-full -z-10 transition-all duration-300 opacity-0 group-hover:opacity-100",
                    "bg-gradient-to-br from-primary/10 to-primary/20"
                  )}></div>
                </div>
                <div className={cn(
                  "px-6 py-4 rounded-xl shadow-lg text-center w-full mt-[-35px] pt-8 transition-all duration-300",
                  "bg-card border border-border group-hover:bg-accent/50"
                )}>
                  <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Join the Movement Section */}
      <motion.section
        className="py-20 px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants} className="inline-flex items-center justify-center mb-6">
            <motion.div
              animate={{
                y: [0, -5, 0, 5, 0],
                transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Zap className="mr-3 h-8 w-8 text-primary" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Join Our Water-Wise Community
            </h2>
          </motion.div>
          <motion.p
            className="text-lg leading-relaxed max-w-3xl mx-auto mb-8 text-muted-foreground"
            variants={itemVariants}
          >
            Whether saving water at home, optimizing farm irrigation, or sharing expertise—JalWiki is your platform. Let's conserve water, together.
          </motion.p>
          <motion.div variants={itemVariants}>
            {/* Corrected Button Animation */}
            <motion.div
              className="inline-block" // Ensures the motion.div behaves like a button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px var(--primary/0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild
                className={cn(
                  "text-white px-10 py-4 rounded-lg shadow-xl transition-all text-xl font-semibold",
"bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                )}
              >
                <Link href="/forum">Visit the Forum</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}