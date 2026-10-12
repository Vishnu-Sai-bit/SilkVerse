import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "sonner";

import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import FloatingConciergeButton from "@/components/common/FloatingConciergeButton";
import RoyalCurtainLoader from "@/components/common/RoyalCurtainLoader";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "SilkVerse | Pure Handloom Silk Sarees & Artisan Heritage",
  description: "Discover authentic handwoven Pure Kanchipuram, Banarasi & Mysore Silk Sarees directly from master weavers. 100% Silk Mark Certified with Free Insured Shipping Across India.",
  icons: {
    icon: "/icon.png",
    apple: "/logo/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,400&family=Playfair+Display:ital,wght@0,400..700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans antialiased min-h-screen"
      >
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <NotificationProvider>
                {/* Royal Silk Curtain Opening Animation on Website Load */}
                <RoyalCurtainLoader />

                <div className="flex min-h-screen flex-col pb-16 md:pb-0">
                  {/* Skip to Main Content Link (Page 15 Accessibility Blueprint) */}
                  <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#5B0D16] focus:text-white focus:rounded-xl focus:shadow-xl focus:outline-2 focus:outline-[#D4AF37] focus:outline-offset-2 font-bold text-xs uppercase tracking-wider"
                  >
                    Skip to main content
                  </a>

                  {/* Global Navbar */}
                  <div className="print:hidden">
                    <Navbar />
                  </div>

                  <main id="main-content" className="flex-1" tabIndex={-1}>
                    {children}
                  </main>

                  {/* Global Footer */}
                  <div className="print:hidden">
                    <Footer />
                  </div>

                  {/* Mobile App Bottom Navigation Bar */}
                  <div className="print:hidden">
                    <MobileBottomNav />
                  </div>

                  {/* Floating Weaver Concierge & Video Shopping Widget */}
                  <FloatingConciergeButton />

                  {/* Floating Back-to-Top Button */}
                  <ScrollToTopButton />
                </div>
              </NotificationProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>

        <Toaster
          position="top-right"
          richColors
          duration={2500}
          closeButton
        />

        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}