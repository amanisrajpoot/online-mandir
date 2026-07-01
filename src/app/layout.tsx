import type { Metadata } from "next";
import { Inter, Outfit, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Toaster } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

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
  metadataBase: new URL("https://www.vandanam.online"),
  title: {
    template: "%s | Vandanam",
    default: "Vandanam | Online Puja, Chadhava & Spiritual Services",
  },
  description: "Connect with divine spirituality through our trusted online platform for authentic temple pujas, chadhava, and astrology services across India's most sacred temples.",
  keywords: [
    "online puja booking", "book puja online India", "online chadhava",
    "temple chadhava online", "online mandir puja", "pandit booking online",
    "rudrabhishek online", "satyanarayan puja online", "temple puja booking",
    "online pooja services", "vandanam puja", "spiritual services online",
    "kashi vishwanath puja online", "mahakaleshwar puja booking"
  ],
  authors: [{ name: "Vandanam" }],
  openGraph: {
    title: "Vandanam | Online Puja & Chadhava Services",
    description: "Connect with divine spirituality through our trusted online platform for authentic temple pujas, chadhava, and astrology services.",
    url: "https://www.vandanam.online",
    siteName: "Vandanam",
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 600,
        alt: "Vandanam Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vandanam | Online Puja & Chadhava Services",
    description: "Connect with divine spirituality through our trusted online platform for authentic temple pujas, chadhava, and astrology services.",
    images: ["/icon.png"],
  },
  alternates: {
    canonical: "https://www.vandanam.online",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Vandanam",
  "url": "https://www.vandanam.online",
  "logo": "https://www.vandanam.online/icon.png",
  "description": "Vandanam connects devotees with ancient temples through digital pujas, authentic chadhava, and spiritual content.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9876543210",
    "contactType": "Customer Service",
    "areaServed": "IN",
    "availableLanguage": ["en", "hi"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} ${tiroDevanagari.variable}`}>
      <head>
        {/* Inline script to prevent flash-of-wrong-theme (FOWT) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('vandanam-theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})()`
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[var(--color-mandir-bg)] text-[var(--color-mandir-text)] selection:bg-[var(--color-saffron-500)]/30">
        <ThemeProvider>
          <LanguageProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Toaster />
            <Navbar />
            <AdminSidebar />
            
            {/* Main Content Area */}
            <main className="flex-1 w-full pb-20 sm:pb-0 sm:pl-0 admin-layout:sm:pl-64">
              {children}
            </main>
            
            <Footer />
            <BottomNav />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
