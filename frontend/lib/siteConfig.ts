/**
 * SilkVerse - Centralized Contact & Brand Configuration
 * All official contact info, addresses, customer support channels,
 * and social media links are managed here for platform-wide consistency.
 */

export const siteConfig = {
  name: "SilkVerse",
  legalName: "SilkVerse Handloom Silks Private Limited",
  tagline: "Elegance Woven Into Every Thread",
  description: "Authentic pure Dharmavaram silk sarees handcrafted by master artisans on traditional pit-looms.",
  domain: "silkverse.com",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",

  // Contact Channels
  contact: {
    phone: "+91 78935 84708", // Primary customer care phone
    phoneDisplay: "+91 78935 84708",
    whatsapp: "+91 78935 84708", // Dedicated WhatsApp concierge
    whatsappDisplay: "+91 78935 84708",
    whatsappLink: "https://wa.me/917893584708",

    emails: {
      support: "silkverse.official@gmail.com", // Official customer care & orders
      enquiry: "silkverse.official@gmail.com", // General inquiries & wholesale
      care: "silkverse.official@gmail.com",    // VIP concierge & bridal consultation
    },

    hours: {
      days: "Monday – Saturday",
      timing: "9:30 AM – 6:30 PM IST",
      display: "Mon – Sat, 9:30 AM – 6:30 PM IST",
      closed: "Sunday & Public Holidays",
    },

    address: {
      line1: "123 Heritage Weavers Street",
      line2: "Near Temple Car Street",
      city: "Dharmavaram",
      district: "Sri Sathya Sai District",
      state: "Andhra Pradesh",
      country: "India",
      pincode: "515671",
      full: "123 Heritage Weavers Street, Dharmavaram, Andhra Pradesh, India – 515671",
    },
  },

  // Social Media Handles & URLs
  social: {
    instagram: {
      handle: "@silkverse_official",
      url: "https://www.instagram.com/silkverse_official/",
    },
    facebook: {
      name: "Silkverseofficial",
      url: "https://www.facebook.com/profile.php?id=61595088805865",
    },
    whatsapp: {
      url: "https://wa.me/917893584708",
    },
    pinterest: {
      handle: "@silkverseo",
      url: "https://in.pinterest.com/silkverseo/",
    },
    youtube: {
      handle: "@Silkverseofficial",
      url: "https://www.youtube.com/@Silkverseofficial",
    },
  },
};

export type SiteConfig = typeof siteConfig;
