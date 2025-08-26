import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { AuthProvider } from "@/context/auth-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JalWiki: Your Hub for Water Conservation & Sustainable Solutions", // Updated Title
  description: "JalWiki is a collaborative platform dedicated to advancing water conservation and sustainable management. Explore innovative techniques, government schemes, NGO initiatives, and engage with a community passionate about preserving our most vital resource.", // Updated Description
  icons: {
    icon: 'https://i.ibb.co/yFtJLFLG/android-chrome-192x192.png', // Path to your favicon in the public folder
    // You can also add other icon types if needed:
    apple: 'https://i.ibb.co/7dkVRHVr/android-chrome-512x512.png',
    shortcut: 'https://i.ibb.co/twsxCGJ2/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <ScrollToTop />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}