import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SilkVerse | Pure Handloom Silk Sarees",
    short_name: "SilkVerse",
    description: "Discover authentic handwoven Pure Kanchipuram, Banarasi & Mysore Silk Sarees directly from master weavers. 100% Silk Mark Certified.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8F0",
    theme_color: "#5B0D16",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo/logo-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
