import type { Metadata } from "next";
import { Inter, Outfit, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Toaster } from "@/components/ui/Toast";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-body",
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-heading",
});

const tiroDevanagari = Tiro_Devanagari_Hindi({ 
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-devanagari",
});

export const metadata: Metadata = {
  title: "Vandanam | Online Puja & Chadhava Services",
  description: "Connect with divine spirituality through our trusted online platform for authentic temple pujas, chadhava, and astrology services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${tiroDevanagari.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-[var(--color-mandir-bg)] text-[var(--color-mandir-text)] selection:bg-[var(--color-saffron-500)]/30">
        <Toaster />
        <Navbar />
        <AdminSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full pb-20 sm:pb-0 sm:pl-0 admin-layout:sm:pl-64">
          {children}
        </main>
        
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
