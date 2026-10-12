"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export type Language = "en" | "te";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.freeShipping": "FREE SHIPPING",
    "nav.freeShippingSub": "on orders above ₹1,000",
    "nav.pureSilk": "100% Pure Silk",
    "nav.easyReturns": "Easy Returns",
    "nav.trackOrder": "Track Order",
    "nav.help": "Help",
    "nav.sareesCollections": "SAREES & COLLECTIONS",
    "nav.newArrivals": "NEW ARRIVALS",
    "nav.bestSellers": "BEST SELLERS",
    "nav.aboutUs": "ABOUT US",
    "nav.offers": "OFFERS",
    "nav.myAccount": "My Account",
    "nav.myProfile": "My Profile",
    "nav.myOrders": "My Orders",
    "nav.myWishlist": "My Wishlist",
    "nav.savedAddresses": "Saved Addresses",
    "product.addToCart": "Add to Cart",
    "product.buyNow": "Buy Now",
    "product.inStock": "In Stock",
    "product.fewLeft": "Only a few left",
    "product.outOfStock": "Out of Stock",
    "product.pureHandloom": "100% Pure Handloom Silk",
    "search.placeholder": "Try 'maroon silk saree for a wedding under 20000'...",
    "search.button": "Search",
    "search.aiTitle": "AI SEMANTIC SEARCH EXAMPLES",
    "search.trendingTitle": "TRENDING SEARCHES",
    "search.recentTitle": "RECENT SEARCHES",
  },
  te: {
    "nav.freeShipping": "ఉచిత షిప్పింగ్",
    "nav.freeShippingSub": "₹1,000 పైన ఆర్డర్లపై",
    "nav.pureSilk": "100% స్వచ్ఛమైన పట్టు",
    "nav.easyReturns": "సులభమైన రిటర్న్స్",
    "nav.trackOrder": "ఆర్డర్ ట్రాక్",
    "nav.help": "సహాయం",
    "nav.sareesCollections": "చీరలు & కలెక్షన్స్",
    "nav.newArrivals": "కొత్త కలెక్షన్స్",
    "nav.bestSellers": "బెస్ట్ సెల్లర్స్",
    "nav.aboutUs": "మా గురించి",
    "nav.offers": "ఆఫర్లు",
    "nav.myAccount": "నా ఖాతా",
    "nav.myProfile": "నా ప్రొఫైల్",
    "nav.myOrders": "నా ఆర్డర్లు",
    "nav.myWishlist": "నా విష్‌లిస్ట్",
    "nav.savedAddresses": "సేవ్ చేసిన చిరునామాలు",
    "product.addToCart": "కార్ట్‌లో చేర్చండి",
    "product.buyNow": "ఇప్పుడే కొనండి",
    "product.inStock": "స్టాక్‌లో ఉంది",
    "product.fewLeft": "కొన్ని మాత్రమే మిగిలి ఉన్నాయి",
    "product.outOfStock": "స్టాక్ లేదు",
    "product.pureHandloom": "100% స్వచ్ఛమైన చేనేత పట్టు",
    "search.placeholder": "'పెళ్లి కోసం మెరూన్ పట్టు చీర' లేదా 'Bridal saree under 20000' వెతకండి...",
    "search.button": "వెతకండి",
    "search.aiTitle": "AI స్మార్ట్ సెర్చ్ ఉదాహరణలు",
    "search.trendingTitle": "ట్రెండింగ్ సెర్చ్‌లు",
    "search.recentTitle": "ఇటీవలి సెర్చ్‌లు",
  },
};

/**
 * Comprehensive Curated English -> Telugu Dictionary for Instant (0ms) Full-Site Conversion
 */
const TELUGU_PHRASE_DICT: Record<string, string> = {
  // Top Bar & Navbar
  "FREE SHIPPING": "ఉచిత షిప్పింగ్",
  "on orders above ₹1,000": "₹1,000 పైన ఆర్డర్లపై",
  "On orders above ₹1,000": "₹1,000 పైన ఆర్డర్లపై",
  "100% Pure Silk": "100% స్వచ్ఛమైన పట్టు",
  "100% PURE SILK": "100% స్వచ్ఛమైన పట్టు",
  "Easy Returns": "సులభమైన రిటర్న్స్",
  "EASY RETURNS": "సులభమైన రిటర్న్స్",
  "Track Order": "ఆర్డర్ ట్రాక్",
  "Track Your Order": "మీ ఆర్డర్ ట్రాక్ చేయండి",
  "Help": "సహాయం",
  "SAREES & COLLECTIONS": "చీరలు & కలెక్షన్స్",
  "NEW ARRIVALS": "కొత్త కలెక్షన్స్",
  "New Arrivals": "కొత్త కలెక్షన్స్",
  "BEST SELLERS": "బెస్ట్ సెల్లర్స్",
  "Best Sellers": "బెస్ట్ సెల్లర్స్",
  "ABOUT US": "మా గురించి",
  "About Us": "మా గురించి",
  "OFFERS": "ఆఫర్లు",
  "Offers": "ఆఫర్లు",
  "Sign In": "సైన్ ఇన్",
  "Sign Out": "సైన్ అవుట్",
  "Login": "లాగిన్",
  "Register": "రిజిస్టర్",
  "Create Account": "ఖాతా సృష్టించండి",
  "Admin Panel": "అడ్మిన్ ప్యానెల్",
  "Admin": "అడ్మిన్",
  "Wishlist": "విష్‌లిస్ట్",
  "Cart": "కార్ట్",
  "Account": "ఖాతా",
  "Search": "వెతకండి",

  // Hero Banner Carousel
  "ROYAL DHARMAVARAM HERITAGE": "రాయల్ ధర్మవరం వారసత్వం",
  "Timeless Elegance,": "శాశ్వతమైన అందం,",
  "Woven with Heritage": "వారసత్వంతో నేసిన పట్టు",
  "Explore our exclusive collection of pure silk sarees crafted for every graceful moment.":
    "ప్రతి శుభ సందర్భానికి ప్రత్యేకంగా చేనేతతో రూపొందించిన స్వచ్ఛమైన ధర్మవరం పట్టు చీరల సేకరణను అన్వేషించండి.",
  "SHOP NOW": "ఇప్పుడే షాపింగ్ చేయండి",
  "Shop Now": "ఇప్పుడే షాపింగ్ చేయండి",
  "EXPLORE COLLECTION": "కలెక్షన్ చూడండి",
  "Explore Collection": "కలెక్షన్ చూడండి",
  "EXPLORE NEW ARRIVALS": "కొత్త కలెక్షన్స్ చూడండి",
  "WEDDING & BRIDAL SPLENDOR": "వివాహ & పెళ్లి పట్టు వైభవం",
  "Royal Bridal Splendor,": "రాయల్ పెళ్లి పట్టు వైభవం,",
  "Sacred Dharmavaram Heirlooms": "పవిత్ర ధర్మవరం సాంప్రదాయ చీరలు",
  "Handcrafted with pure gold and silver tested zari on 100% pure mulberry silk. A treasured heirloom for your sacred vows.":
    "100% స్వచ్ఛమైన మల్బరీ పట్టుపై అసలైన బంగారు మరియు వెండి జరీతో చేతితో నేసిన అపురూపమైన పెళ్లి పట్టు చీరలు.",
  "EXPLORE BRIDAL EDIT": "పెళ్లి కలెక్షన్ చూడండి",
  "VIEW WEDDING SILKS": "వివాహ పట్టు చీరలు చూడండి",
  "FESTIVE EDIT 2026": "పండుగ స్పెషల్ కలెక్షన్ 2026",
  "Festive Celebrations,": "పండుగ వేడుకలు,",
  "Pure Handloom Silks": "స్వచ్ఛమైన చేనేత పట్టు చీరలు",
  "Fluid drape, gentle shimmer, and vivid heritage hues certified with authentic Silk Mark India. Direct from artisan pit-looms.":
    "సిల్క్ మార్క్ ఇండియా ధృవీకరణతో, నేరుగా ధర్మవరం చేనేత మగ్గాల నుండి మీ ముందుకు వచ్చే అద్భుతమైన పట్టు చీరలు.",
  "SHOP FESTIVE WEAVES": "పండుగ చీరలు కొనండి",
  "EXPLORE SOFT SILK": "సాఫ్ట్ సిల్క్ చూడండి",
  "100% Silk Mark India": "100% సిల్క్ మార్క్ ఇండియా",
  "Complimentary Insured Shipping": "ఉచిత భీమా షిప్పింగ్",
  "Direct Loom Price": "నేరుగా మగ్గం ధరకే",

  // Homepage Sections & Categories
  "Shop By Collection": "కలెక్షన్ల వారీగా షాపింగ్ చేయండి",
  "SHOP BY COLLECTION": "కలెక్షన్ల వారీగా షాపింగ్ చేయండి",
  "Featured Sarees": "ప్రత్యేక పట్టు చీరలు",
  "FEATURED SAREES": "ప్రత్యేక పట్టు చీరలు",
  "WEDDING": "వివాహ పట్టు",
  "Wedding": "వివాహ పట్టు",
  "BRIDAL": "పెళ్లి కూతురు పట్టు",
  "Bridal": "పెళ్లి కూతురు పట్టు",
  "FESTIVE": "పండుగ కలెక్షన్",
  "Festive": "పండుగ కలెక్షన్",
  "HERITAGE": "వారసత్వ చేనేత",
  "Heritage": "వారసత్వ చేనేత",
  "Handloom": "చేనేత పట్టు",
  "CASUAL": "క్యాజువల్ సిల్క్",
  "Casual": "క్యాజువల్ సిల్క్",
  "DESIGNER": "డిజైనర్ పట్టు",
  "Designer": "డిజైనర్ పట్టు",
  "Luxury Silk": "లగ్జరీ పట్టు",
  "LUXURY SILK": "లగ్జరీ పట్టు",
  "Soft Silk": "సాఫ్ట్ సిల్క్",
  "SOFT SILK": "సాఫ్ట్ సిల్క్",
  "PARTY WEAR": "పార్టీ వేర్",
  "Party Wear": "పార్టీ వేర్",

  // 18 Saree Product Names
  "Royal Midnight Blue Heavy Zari Silk Saree": "రాయల్ మిడ్‌నైట్ బ్లూ హెవీ జరీ పట్టు చీర",
  "Champagne Ivory Bridal Heritage Silk Saree": "షాంపైన్ ఐవరీ బ్రైడల్ హెరిటేజ్ పట్టు చీర",
  "Golden Mustard Festive Handloom Silk Saree": "గోల్డెన్ మస్టర్డ్ ఫెస్టివ్ చేనేత పట్టు చీర",
  "Vibrant Rani Pink Bridal Brocade Silk Saree": "వైబ్రెంట్ రాణి పింక్ బ్రైడల్ బ్రోకేడ్ పట్టు చీర",
  "Royal Crimson Handloom Dharmavaram Silk Saree": "రాయల్ క్రిమ్సన్ చేనేత ధర్మవరం పట్టు చీర",
  "Marigold Yellow Traditional Pooja Silk Saree": "బంతిపూల పసుపు సాంప్రదాయ పూజ పట్టు చీర",
  "Deep Plum Violet Floral Jaal Silk Saree": "డీప్ ప్లమ్ వైలెట్ ఫ్లోరల్ జాల్ పట్టు చీర",
  "Emerald Green Temple Border Pure Silk Saree": "ఎమరాల్డ్ గ్రీన్ టెంపుల్ బోర్డర్ స్వచ్ఛమైన పట్టు చీర",
  "Regal Wine Burgundy Korvai Handloom Silk Saree": "రీగల్ వైన్ బర్గండీ కోర్వై చేనేత పట్టు చీర",
  "Blush Peach Floral Zari Soft Silk Saree": "బ్లష్ పీచ్ ఫ్లోరల్ జరీ సాఫ్ట్ సిల్క్ చీర",
  "Regal Purple Gold Brocade Dharmavaram Silk Saree": "రీగల్ పర్పుల్ గోల్డ్ బ్రోకేడ్ ధర్మవరం పట్టు చీర",
  "Coral Rose Soft Silk Festive Saree": "కోరల్ రోజ్ సాఫ్ట్ సిల్క్ పండుగ చీర",
  "Sky Blue Pastel Heritage Bridal Silk Saree": "స్కై బ్లూ పాస్టెల్ హెరిటేజ్ పెళ్లి పట్టు చీర",
  "Turquoise Teal Peacocks Pure Silk Saree": "టర్క్వాయిస్ టీల్ నెమలి డిజైన్ స్వచ్ఛమైన పట్టు చీర",
  "Mint Sage Contrast Border Pure Silk Saree": "మింట్ సేజ్ కాంట్రాస్ట్ బోర్డర్ స్వచ్ఛమైన పట్టు చీర",
  "Midnight Charcoal Antique Gold Silk Saree": "మిడ్‌నైట్ చార్‌కోల్ యాంటిక్ గోల్డ్ పట్టు చీర",
  "Olive Emerald Dual-Tone Heritage Silk Saree": "ఆలివ్ ఎమరాల్డ్ డ్యూయల్-టోన్ హెరిటేజ్ పట్టు చీర",
  "Sunset Orange Antique Temple Zari Silk Saree": "సన్‌సెట్ ఆరెంజ్ యాంటిక్ టెంపుల్ జరీ పట్టు చీర",
  "100 Products Found": "100 పట్టు చీరలు అందుబాటులో ఉన్నాయి",
  "20 Products Found": "20 పట్టు చీరలు అందుబాటులో ఉన్నాయి",
  "Bottle Green": "బాటిల్ గ్రీన్ (ఆకుపచ్చ)",
  "Emerald Green": "ఎమరాల్డ్ గ్రీన్",
  "Mint Green": "మింట్ గ్రీన్",
  "Olive Emerald": "ఆలివ్ ఎమరాల్డ్",
  "Mustard Gold": "మస్టర్డ్ గోల్డ్ (పసుపు)",
  "Marigold Yellow": "బంతిపూల పసుపు",
  "Champagne Gold": "షాంపైన్ గోల్డ్",
  "Champagne Ivory": "షాంపైన్ ఐవరీ",
  "Wine Burgundy": "వైన్ బర్గండీ",
  "Royal Maroon": "రాయల్ మెరూన్",
  "Crimson Red": "క్రిమ్సన్ రెడ్ (ఎరుపు)",
  "Vermilion Red": "కుంకుమ ఎరుపు",
  "Terracotta Rust": "టెర్రకోట రస్ట్",
  "Sunset Orange": "సన్‌సెట్ ఆరెంజ్",
  "Coral Orange": "కోరల్ ఆరెంజ్",
  "Coral Rose": "కోరల్ రోజ్",
  "Blush Peach": "బ్లష్ పీచ్",
  "Rani Pink": "రాణి పింక్",
  "Mauve Lavender": "లావెండర్ ఊదా",
  "Plum Violet": "ప్లమ్ వైలెట్",
  "Royal Purple": "రాయల్ పర్పుల్ (ఊదా)",
  "Indigo Blue": "ఇండిగో బ్లూ",
  "Midnight Blue": "మిడ్‌నైట్ బ్లూ",
  "Royal Blue": "రాయల్ బ్లూ (నీలం)",
  "Peacock Blue": "నెమలి నీలం (Peacock Blue)",
  "Peacock Teal": "నెమలి టీల్",
  "Turquoise Teal": "టర్క్వాయిస్ టీల్",
  "Sky Blue": "స్కై బ్లూ",
  "Midnight Charcoal": "మిడ్‌నైట్ చార్‌కోల్",

  // Product Card & Badges
  "BEST SELLER": "బెస్ట్ సెల్లర్",
  "Best Seller": "బెస్ట్ సెల్లర్",
  "NEW ARRIVAL": "కొత్త కలెక్షన్",
  "New Arrival": "కొత్త కలెక్షన్",
  "BRIDAL PICK": "పెళ్లి స్పెషల్",
  "FESTIVE PICK": "పండుగ స్పెషల్",
  "HERITAGE WEAVE": "వారసత్వ చేనేత",
  "LIMITED EDITION": "లిమిటెడ్ ఎడిషన్",
  "Add to Cart": "కార్ట్‌లో చేర్చండి",
  "Added to Cart": "కార్ట్‌లో చేర్చబడింది",
  "Added": "చేర్చబడింది",
  "Buy Now": "ఇప్పుడే కొనండి",
  "In Stock": "స్టాక్‌లో ఉంది",
  "Only a few left": "కొన్ని మాత్రమే మిగిలి ఉన్నాయి",
  "Out of Stock": "స్టాక్ లేదు",
  "Quick View": "త్వరిత వీక్షణ",

  // Trust Features Strip
  "Premium quality guaranteed": "అత్యుత్తమ నాణ్యత హామీ",
  "HANDWOVEN": "చేనేత మగ్గం",
  "By skilled weavers": "నిపుణులైన చేనేత కళాకారులచే",
  "SECURE PAYMENT": "సురక్షిత చెల్లింపు",
  "100% secure checkout": "100% సురక్షిత చెక్అవుట్",
  "Hassle-free returns": "సులభమైన రిటర్న్ సదుపాయం",

  // Recently Viewed Section
  "Personalized For You": "మీ కోసం ప్రత్యేకంగా",
  "Continue Your Silk Journey": "మీ పట్టు షాపింగ్ కొనసాగించండి",
  "Clear History": "చరిత్రను తొలగించండి",
  "VIEW ALL": "అన్నీ చూడండి",
  "View All": "అన్నీ చూడండి",

  // Festive Offer Strip & Testimonials Section
  "Exclusive Handloom Privileges": "ప్రత్యేక చేనేత ఆఫర్లు",
  "Festive & Wedding Season Privileges": "పండుగ & వివాహ సీజన్ ప్రత్యేక కూపన్లు",
  "Tap any coupon below to copy and redeem instant weaver-direct savings at checkout.":
    "చెక్అవుట్‌లో తక్షణ తగ్గింపు పొందడానికి క్రింది ఏదైనా కూపన్‌పై క్లిక్ చేసి కాపీ చేయండి.",
  "FLAT 10% OFF": "ఫ్లాట్ 10% తగ్గింపు",
  "On all Dharmavaram Silk Sarees (Min ₹1,000)": "అన్ని ధర్మవరం పట్టు చీరలపై (కనీసం ₹1,000)",
  "FESTIVE 15% OFF": "పండుగ 15% తగ్గింపు",
  "Bridal & Festive Weaves (Orders ₹5,000+)": "పెళ్లి & పండుగ చీరలపై (₹5,000+ ఆర్డర్లపై)",
  "ROYAL 20% OFF": "రాయల్ 20% తగ్గింపు",
  "Heirloom Wedding Silks (Orders ₹10,000+)": "వివాహ పట్టు చీరలపై (₹10,000+ ఆర్డర్లపై)",
  "All 6 Offers": "మొత్తం 6 ఆఫర్లు",
  "Loved By Our Customers": "మా కస్టమర్ల అభిప్రాయాలు",
  "Real experiences from our cherished patrons across the country":
    "దేశవ్యాప్తంగా మా కస్టమర్లు పంచుకున్న నిజమైన అనుభవాలు",
  "Verified": "ధృవీకరించబడింది",
  "In Bag • Add +1": "బ్యాగ్‌లో ఉంది • +1 చేర్చండి",
  "Handpicked pure Dharmavaram pit-loom weaves curated by occasion & craft":
    "ప్రతి శుభ సందర్భానికి ప్రత్యేకంగా ఎంపిక చేసిన అసలైన ధర్మవరం చేనేత పట్టు చీరలు",
  "Featured All": "అన్ని ప్రత్యేక చీరలు",
  "Bridal & Wedding": "పెళ్లి & వివాహ పట్టు",
  "Festive Pattu": "పండుగ పట్టు",
  "Curated For Every Celebration": "ప్రతి వేడుక కోసం ప్రత్యేకంగా",
  "Shop By Budget": "బడ్జెట్ వారీగా షాపింగ్ చేయండి",
  "Under ₹12,000": "₹12,000 లోపు",
  "Lightweight Soft & Pooja Silks": "తేలికపాటి సాఫ్ట్ & పూజ పట్టు చీరలు",
  "EVERYDAY ELEGANCE": "రోజువారీ అందం",
  "₹12,000 – ₹18,000": "₹12,000 – ₹18,000",
  "Festive Zari & Temple Borders": "పండుగ జరీ & టెంపుల్ బోర్డర్ చీరలు",
  "FESTIVE FAVORITES": "పండుగ స్పెషల్",
  "₹18,000 – ₹25,000": "₹18,000 – ₹25,000",
  "Rich Brocade & Wedding Drapes": "రిచ్ బ్రోకేడ్ & వివాహ పట్టు చీరలు",
  "WEDDING COLLECTION": "వివాహ కలెక్షన్",
  "Above ₹25,000": "₹25,000 పైన",
  "Pure Gold Zari Bridal Heirlooms": "స్వచ్ఛమైన బంగారు జరీ పెళ్లి పట్టు చీరలు",
  "ROYAL BRIDAL": "రాయల్ బ్రైడల్",
  "Weaver Concierge": "చేనేత సహాయం",
  "SilkVerse Concierge": "సిల్క్‌వర్స్ సహాయ కేంద్రం",
  "How May We Assist You?": "మేము మీకు ఎలా సహాయం చేయగలము?",
  "WhatsApp Weaver Desk": "వాట్సాప్ చేనేత సహాయం",
  "Instant saree & order help": "చీరలు & ఆర్డర్ల కోసం తక్షణ సహాయం",
  "Live Video Saree Shopping": "లైవ్ వీడియో కాల్ షాపింగ్",
  "Preview bridal drapes on video call": "వీడియో కాల్‌లో నేరుగా పట్టు చీరలను చూడండి",
  "6 Coupons": "6 కూపన్లు",
  "Copy Code": "కోడ్ కాపీ చేయండి",
  "Copied": "కాపీ చేయబడింది",

  // Heritage Section
  "— THE SILKVERSE STORY —": "— సిల్క్‌వర్స్ వారసత్వ కథ —",
  "Crafted with Passion, Worn with Pride": "అంకితభావంతో నేసిన పట్టు, గర్వంగా ధరించే వైభవం",
  "SilkVerse is born from a love for India's rich weaving heritage. Each saree is a masterpiece, handcrafted with precision, passion and timeless tradition directly on heritage pit-looms.":
    "భారతదేశపు గొప్ప చేనేత వారసత్వంపై ప్రేమతో సిల్క్‌వర్స్ జన్మించింది. ప్రతి చీర ఒక కళాఖండం — సాంప్రదాయ మగ్గాలపై నిపుణులైన కళాకారులచే ఎంతో నైపుణ్యంతో, భక్తిశ్రద్ధలతో నేయబడుతుంది.",
  "Authentic Dharmavaram pit-loom weaving with certified tested zari":
    "ధృవీకరించబడిన జరీతో అసలైన ధర్మవరం సాంప్రదాయ మగ్గం నేత",
  "Ethically sourced pure mulberry silk directly supporting artisan clusters":
    "చేనేత కళాకారుల కుటుంబాలకు నేరుగా మద్దతునిచ్చే స్వచ్ఛమైన మల్బరీ పట్టు",
  "Every drape individually inspected for heirloom quality and longevity":
    "తరతరాలకు నిలిచే నాణ్యత కోసం ప్రతి చీరను ప్రత్యేకంగా పరీక్షించబడింది",
  "DISCOVER OUR STORY": "మా వారసత్వ కథను తెలుసుకోండి",

  // Instagram & Newsletter Section
  "Community & Social": "కమ్యూనిటీ & సోషల్ మీడియా",
  "Follow Us On Instagram": "ఇన్‌స్టాగ్రామ్‌లో మమ్మల్ని ఫాలో అవ్వండి",
  "Join our vibrant community for daily handloom saree styling lookbooks, behind-the-scenes pit-loom artisan reels, and first previews of festive drops.":
    "రోజువారీ చేనేత పట్టు చీరల స్టైలింగ్, మగ్గం వెనుక కళాకారుల నైపుణ్యం మరియు కొత్త పండుగ కలెక్షన్ల అప్‌డేట్స్ కోసం మా కమ్యూనిటీలో చేరండి.",
  "Official Page": "అధికారిక పేజీ",
  "Also Connect With Us On:": "వీటిలో కూడా మమ్మల్ని సంప్రదించండి:",
  "SilkVerse Privileges": "సిల్క్‌వర్స్ ప్రత్యేక ఆఫర్లు",
  "Stay in the Loop": "తాజా అప్‌డేట్స్ పొందండి",
  "Subscribe to receive curated invitations to limited-edition Dharmavaram weave drops, festive seasonal discounts, and bridal styling guides.":
    "లిమిటెడ్-ఎడిషన్ ధర్మవరం పట్టు చీరల కలెక్షన్స్, పండుగ డిస్కౌంట్లు మరియు పెళ్లి స్టైలింగ్ గైడ్‌ల కోసం సబ్‌స్క్రైబ్ చేయండి.",
  "Get Flat ₹500 OFF instant coupon on your first silk order!":
    "మీ మొదటి పట్టు చీర ఆర్డర్‌పై నేరుగా ₹500 తగ్గింపు కూపన్ పొందండి!",
  "You are now subscribed!": "మీరు విజయవంతంగా సబ్‌స్క్రైబ్ అయ్యారు!",
  "SUBSCRIBE": "సబ్‌స్క్రైబ్ చేయండి",
  "Subscribe": "సబ్‌స్క్రైబ్ చేయండి",
  "We respect your privacy. No spam, unsubscribe anytime.":
    "మీ గోప్యతను మేము గౌరవిస్తాము. ఎప్పుడైనా అన్‌సబ్‌స్క్రైబ్ చేయవచ్చు.",
  "Exclusive Subscriber Privileges:": "సబ్‌స్క్రైబర్లకు ప్రత్యేక ప్రయోజనాలు:",
  "Early access to limited festive & bridal silk collections":
    "కొత్త పండుగ & పెళ్లి పట్టు కలెక్షన్లకు ముందస్తు యాక్సెస్",
  "Special VIP discounts & private festive salon invitations":
    "ప్రత్యేక VIP డిస్కౌంట్లు & పండుగ సేల్ ఆహ్వానాలు",
  "Direct master weaver heritage stories & silk care handbook":
    "చేనేత కళాకారుల కథనాలు & పట్టు చీరల సంరక్షణ గైడ్",

  // Footer
  "Authentic pure Dharmavaram silk sarees handcrafted by master artisans on traditional pit-looms. Rooted in centuries of heritage, certified with Silk Mark purity.":
    "సాంప్రదాయ మగ్గాలపై నిపుణులైన కళాకారులచే చేతితో నేయబడిన అసలైన ధర్మవరం పట్టు చీరలు. శతాబ్దాల వారసత్వం మరియు సిల్క్ మార్క్ స్వచ్ఛత ధృవీకరణ.",
  "Silk Mark Certified 100% Pure Mulberry Silk": "సిల్క్ మార్క్ ధృవీకరించిన 100% స్వచ్ఛమైన మల్బరీ పట్టు",
  "7-Day Hassle-Free Returns & Exchanges": "7-రోజుల సులభమైన రిటర్న్స్ & ఎక్స్ఛేంజ్",
  "256-Bit SSL Encrypted Secure Checkout": "256-బిట్ SSL సురక్షిత ఆన్‌లైన్ చెల్లింపులు",
  "Free Express Shipping Across India": "భారతదేశం అంతటా ఉచిత ఎక్స్‌ప్రెస్ షిప్పింగ్",
  "Shop Collections": "షాపింగ్ కలెక్షన్స్",
  "All Handloom Sarees": "అన్ని చేనేత చీరలు",
  "Bridal & Wedding Silks": "పెళ్లి & వివాహ పట్టు చీరలు",
  "Festive Dharmavaram": "పండుగ ధర్మవరం పట్టు",
  "Luxury Heavy Zari": "లగ్జరీ హెవీ జరీ చీరలు",
  "Lightweight Soft Silks": "తేలికపాటి సాఫ్ట్ సిల్క్ చీరలు",
  "New Festive Arrivals": "కొత్త పండుగ కలెక్షన్స్",
  "Special Offers & Promos": "ప్రత్యేక ఆఫర్లు & కూపన్లు",
  "Save": "ఆదా",
  "Help & Concierge": "సహాయం & సేవలు",
  "Contact Support": "కస్టమర్ సపోర్ట్",
  "WhatsApp Concierge": "వాట్సాప్ సహాయం",
  "Ordering & FAQs": "ఆర్డర్ సహాయం & ప్రశ్నలు (FAQs)",
  "Shipping & Delivery": "షిప్పింగ్ & డెలివరీ",
  "Returns & Exchange Portal": "రిటర్న్స్ & ఎక్స్ఛేంజ్ పోర్టల్",
  "Saree Care & Zari Guide": "పట్టు చీరల సంరక్షణ గైడ్",
  "Our Heritage": "మా వారసత్వం",
  "The Dharmavaram Story": "ధర్మవరం చేనేత కథ",
  "Master Artisans & Looms": "చేనేత కళాకారులు & మగ్గాలు",
  "Silk Mark India Authenticity": "సిల్క్ మార్క్ ఇండియా స్వచ్ఛత",
  "Ethical Fair-Trade Weaving": "నైతిక చేనేత వ్యాపారం",
  "Customer Testimonials": "కస్టమర్ల అభిప్రాయాలు",
  "Weavers Studio & Store": "చేనేత స్టూడియో & స్టోర్",
  "Stay Connected": "మాతో కనెక్ట్ అవ్వండి",
  "Subscribe for private salon invitations, limited festive drop notifications, and bridal styling tips.":
    "ప్రత్యేక పండుగ ఆఫర్లు, కొత్త కలెక్షన్ల అప్‌డేట్స్ మరియు పెళ్లి స్టైలింగ్ చిట్కాల కోసం సబ్‌స్క్రైబ్ చేయండి.",
  "No spam ever. Unsubscribe anytime with 1 click.": "స్పామ్ ఉండదు. ఒక క్లిక్‌తో ఎప్పుడైనా అన్‌సబ్‌స్క్రైబ్ చేయవచ్చు.",
  "Follow Our Journey": "మమ్మల్ని అనుసరించండి",
  "Platform Specifications & Architectural Blueprints": "ప్లాట్‌ఫారమ్ వివరాలు & బ్లూప్రింట్స్",
  "Explore Documentation": "డాక్యుమెంటేషన్ చూడండి",
  "Collapse": "మూసివేయండి",
  "Privacy Policy": "గోప్యతా విధానం",
  "Terms & Conditions": "నిబంధనలు & షరతులు",
  "Shipping Policy": "షిప్పింగ్ విధానం",
  "Sitemap": "సైట్‌మ్యాప్",
  "Handcrafted with": "ప్రేమతో చేనేత చేయబడింది",
  "in Dharmavaram, India": "ధర్మవరం, భారతదేశం",

  // Shop / Collections / Filters
  "All Sarees": "అన్ని పట్టు చీరలు",
  "Handloom Sarees": "చేనేత పట్టు చీరలు",
  "Filters": "ఫిల్టర్లు",
  "FILTERS": "ఫిల్టర్లు",
  "Clear All": "అన్నీ క్లియర్ చేయండి",
  "CLEAR ALL": "అన్నీ క్లియర్ చేయండి",
  "Reset Filters": "ఫిల్టర్లను రీసెట్ చేయండి",
  "Category": "విభాగం (Category)",
  "CATEGORY": "విభాగం",
  "Price Range": "ధర పరిధి",
  "PRICE RANGE": "ధర పరిధి",
  "Customer Rating": "కస్టమర్ రేటింగ్",
  "Minimum Rating": "కనీస రేటింగ్",
  "Fabric / Weave": "ఫ్యాబ్రిక్ / నేత రకం",
  "Occasion": "సందర్భం (Occasion)",
  "Color": "రంగు",
  "Availability": "లభ్యత",
  "In Stock Only": "స్టాక్‌లో ఉన్నవి మాత్రమే",
  "Include Out of Stock": "స్టాక్ లేనివి కూడా చూపించు",
  "SORT BY:": "క్రమం:",
  "Sort By": "క్రమం",
  "Featured": "ప్రత్యేకమైనవి",
  "Newest First": "కొత్తవి ముందుగా",
  "Price: Low to High": "ధర: తక్కువ నుండి ఎక్కువ",
  "Price: High to Low": "ధర: ఎక్కువ నుండి తక్కువ",
  "Customer Rating: High to Low": "రేటింగ్: ఎక్కువ నుండి తక్కువ",
  "Load More Sarees": "మరిన్ని చీరలను చూడండి",

  // Cart & Checkout
  "Shopping Bag": "షాపింగ్ బ్యాగ్",
  "Your Shopping Bag": "మీ షాపింగ్ బ్యాగ్",
  "Your shopping bag is empty": "మీ షాపింగ్ బ్యాగ్ ఖాళీగా ఉంది",
  "Continue Shopping": "షాపింగ్ కొనసాగించండి",
  "Proceed to Checkout": "చెక్అవుట్‌కు వెళ్లండి",
  "PROCEED TO CHECKOUT": "చెక్అవుట్‌కు వెళ్లండి",
  "Order Summary": "ఆర్డర్ సారాంశం",
  "Price Details": "ధర వివరాలు",
  "Subtotal": "ఉప మొత్తం (Subtotal)",
  "Shipping": "షిప్పింగ్",
  "Free": "ఉచితం",
  "FREE": "ఉచితం",
  "Discount": "తగ్గింపు (Discount)",
  "Total Amount": "మొత్తం చెల్లించాల్సిన ధర",
  "Total": "మొత్తం",
  "1. Bag": "1. బ్యాగ్",
  "2. Address": "2. చిరునామా",
  "3. Shipping": "3. షిప్పింగ్",
  "4. Payment": "4. చెల్లింపు",
  "5. Confirmation": "5. నిర్ధారణ",
  "SilkVerse Secure Checkout": "సిల్క్‌వర్స్ సురక్షిత చెక్అవుట్",
  "Complete Your Order": "మీ ఆర్డర్‌ను పూర్తి చేయండి",
  "Review your delivery details and complete your order securely.":
    "మీ డెలివరీ వివరాలను సరిచూసుకుని సురక్షితంగా ఆర్డర్ పూర్తి చేయండి.",
  "Delivery Address": "డెలివరీ చిరునామా",
  "Choose where you want your saree delivered.": "మీ చీరను ఎక్కడికి డెలివరీ చేయాలో ఎంచుకోండి.",
  "Manage Addresses": "చిరునామాలను నిర్వహించండి",
  "No delivery address found.": "డెలివరీ చిరునామా కనుగొనబడలేదు.",
  "Add an address before placing your order.": "ఆర్డర్ చేసే ముందు దయచేసి మీ చిరునామాను జోడించండి.",
  "Add Address": "చిరునామా జోడించండి",
  "Add New Address": "కొత్త చిరునామా జోడించండి",
  "Default": "డిఫాల్ట్",
  "DEFAULT": "డిఫాల్ట్",
  "Home": "ఇల్లు (Home)",
  "Work": "ఆఫీసు (Work)",
  "Other": "ఇతర (Other)",
  "Landmark:": "ల్యాండ్‌మార్క్:",
  "Payment Method": "చెల్లింపు విధానం",
  "Select your preferred payment option.": "మీకు నచ్చిన చెల్లింపు విధానాన్ని ఎంచుకోండి.",
  "Cash on Delivery": "క్యాష్ ఆన్ డెలివరీ (COD)",
  "Cash on Delivery (COD)": "క్యాష్ ఆన్ డెలివరీ (COD)",
  "Credit / Debit Card": "క్రెడిట్ / డెబిట్ కార్డ్",
  "Net Banking": "నెట్ బ్యాంకింగ్",
  "Wallets": "వాలెట్లు",
  "Have a Coupon?": "కూపన్ కోడ్ ఉందా?",
  "Apply Coupon": "కూపన్ వర్తింపజేయండి",
  "Apply": "వర్తింపజేయి",
  "APPLY": "వర్తింపజేయి",
  "Remove": "తొలగించు",
  "Place Order": "ఆర్డర్ చేయండి",
  "PLACE ORDER": "ఆర్డర్ చేయండి",

  // Account, Profile, Addresses & Orders
  "My Account": "నా ఖాతా",
  "Account Overview": "ఖాతా వివరాలు",
  "My Orders": "నా ఆర్డర్లు",
  "My Profile": "నా ప్రొఫైల్",
  "Saved Addresses": "సేవ్ చేసిన చిరునామాలు",
  "My Wishlist": "నా విష్‌లిస్ట్",
  "Returns & Refunds": "రిటర్న్స్ & రీఫండ్స్",
  "My Reviews": "నా సమీక్షలు",
  "Personal Details": "వ్యక్తిగత వివరాలు",
  "Edit Profile": "ప్రొఫైల్ సవరించండి",
  "Save Changes": "మార్పులను సేవ్ చేయండి",
  "Cancel": "రద్దు చేయండి",
  "Full Name": "పూర్తి పేరు",
  "Email Address": "ఇమెయిల్ చిరునామా",
  "Mobile Number": "మొబైల్ నంబర్",
  "Mobile": "మొబైల్",
  "Phone": "ఫోన్ నంబర్",
  "City / Town": "నగరం / పట్టణం (City / Town)",
  "City": "నగరం / పట్టణం",
  "District": "జిల్లా (District)",
  "State": "రాష్ట్రం (State)",
  "Country": "దేశం (Country)",
  "Pincode": "పిన్‌కోడ్ (Pincode)",
  "House / Flat / Building No.": "ఇంటి నంబర్ / ఫ్లాట్ / భవనం",
  "Area / Street / Colony": "ప్రాంతం / వీధి / కాలనీ",
  "Landmark (Optional)": "ల్యాండ్‌మార్క్ (ఐచ్ఛికం)",
  "Address Type": "చిరునామా రకం",
  "Set as default delivery address": "దీనిని డిఫాల్ట్ డెలివరీ చిరునామాగా సెట్ చేయండి",
  "Save Address": "చిరునామా సేవ్ చేయండి",
  "Update Address": "చిరునామా అప్‌డేట్ చేయండి",
  "Edit Address": "చిరునామా సవరించండి",
  "Set Default": "డిఫాల్ట్‌గా సెట్ చేయండి",
  "Edit": "సవరించు",
  "Delete": "తొలగించు",
  "Recent Orders": "ఇటీవలి ఆర్డర్లు",
  "Primary Address": "ప్రధాన చిరునామా",
  "Profile Information": "ప్రొఫైల్ సమాచారం",
  "Manage": "నిర్వహించండి",
  "View Details": "వివరాలు చూడండి",
  "Download Invoice": "ఇన్‌వాయిస్ డౌన్‌లోడ్",
  "Invoice": "ఇన్‌వాయిస్",
  "Buy Again": "మళ్ళీ కొనండి",
  "Order Confirmed": "ఆర్డర్ నిర్ధారించబడింది",
  "Processing": "ప్రాసెస్ అవుతోంది",
  "Shipped": "షిప్ చేయబడింది",
  "Out for Delivery": "డెలివరీకి బయలుదేరింది",
  "Delivered": "డెలివరీ చేయబడింది",
  "Cancelled": "రద్దు చేయబడింది",

  // Indian States & Key Telugu Districts
  "India": "భారతదేశం (India)",
  "Andhra Pradesh": "ఆంధ్రప్రదేశ్",
  "Telangana": "తెలంగాణ",
  "Karnataka": "కర్ణాటక",
  "Tamil Nadu": "తమిళనాడు",
  "Kerala": "కేరళ",
  "Maharashtra": "మహారాష్ట్ర",
  "Delhi (NCT)": "ఢిల్లీ (NCT)",
  "Gujarat": "గుజరాత్",
  "West Bengal": "పశ్చిమ బెంగాల్",
  "Uttar Pradesh": "ఉత్తర ప్రదేశ్",
  "Rajasthan": "రాజస్థాన్",
  "Odisha": "ఒడిశా",
  "Madhya Pradesh": "మధ్యప్రదేశ్",
  "Sri Sathya Sai (Dharmavaram)": "శ్రీ సత్యసాయి (ధర్మవరం)",
  "Dharmavaram": "ధర్మవరం",
  "Anantapur": "అనంతపురం",
  "Tirupati": "తిరుపతి",
  "Chittoor": "చిత్తూరు",
  "Kurnool": "కర్నూలు",
  "Nandyal": "నంద్యాల",
  "YSR Kadapa": "వైఎస్ఆర్ కడప",
  "Annamayya": "అన్నమయ్య",
  "SPSR Nellore": "నెల్లూరు",
  "Prakasam": "ప్రకాశం",
  "Bapatla": "బాపట్ల",
  "Guntur": "గుంటూరు",
  "Palnadu": "పల్నాడు",
  "NTR (Vijayawada)": "ఎన్టీఆర్ (విజయవాడ)",
  "Krishna": "కృష్ణా",
  "Eluru": "ఏలూరు",
  "West Godavari": "పశ్చిమ గోదావరి",
  "East Godavari": "తూర్పు గోదావరి",
  "Dr. B.R. Ambedkar Konaseema": "డా. బి.ఆర్. అంబేద్కర్ కోనసీమ",
  "Kakinada": "కాకినాడ",
  "Anakapalli": "అనకాపల్లి",
  "Visakhapatnam": "విశాఖపట్నం",
  "Vizianagaram": "విజయనగరం",
  "Srikakulam": "శ్రీకాకుళం",
  "Hyderabad": "హైదరాబాద్",
  "Rangareddy": "రంగారెడ్డి",
  "Medchal-Malkajgiri": "మేడ్చల్-మల్కాజిగిరి",
  "Sangareddy": "సంగారెడ్డి",
  "Warangal": "వరంగల్",
  "Hanumakonda": "హనుమకొండ",
  "Karimnagar": "కరీంనగర్",
  "Nizamabad": "నిజామాబాద్",
  "Khammam": "ఖమ్మం",
  "Nalgonda": "నల్గొండ",
  "Mahabubnagar": "మహబూబ్‌నగర్",
  "Siddipet": "సిద్దిపేట",

  // Live Video Saree Viewing, Color Swatches, Quick Filters & Gift Packaging
  "Live Video Saree Viewing": "లైవ్ వీడియోలో చీర వీక్షణ",
  "Book Video Call": "వీడియో కాల్ బుక్ చేయండి",
  "Live Virtual Showroom Appointment": "లైవ్ వర్చువల్ షోరూమ్ అపాయింట్‌మెంట్",
  "Confirm Slot": "స్లాట్ ఖరారు చేయండి",
  "Shade:": "రంగు:",
  "All Shades": "అన్ని రంగులు",
  "Crimson & Red": "కుంకుమ & ఎరుపు",
  "Emerald & Green": "పచ్చ & ఆకుపచ్చ",
  "Royal Blue & Teal": "రాయల్ బ్లూ & నెమలి నీలం",
  "Rani Pink & Peach": "రాణి పింక్ & పీచ్",
  "Purple & Wine": "పర్పుల్ & వైన్",
  "Gold & Mustard": "బంగారు & పసుపు",
  "Ivory & Pastel": "ఐవరీ & పేస్టల్",
  "Quick Pick:": "ధర ఎంపిక:",
  "All Price Ranges": "అన్ని ధరలు",
  "Under ₹14,000": "₹14,000 లోపు",
  "₹14,000 – ₹20,000": "₹14,000 – ₹20,000",
  "Bridal Luxury ₹20,000+": "పెళ్లి పట్టు ₹20,000+",
  "Auspicious Wedding & Festive Gift Packaging": "శుభకార్య & పెళ్లి కానుక ప్యాకేజింగ్",
  "Complimentary": "ఉచితం",
  "Zari Silk Potli Wrap": "జరీ పట్టు పోట్లీ ప్యాకింగ్",
  "Royal Bridal Box": "రాయల్ బ్రైడల్ గిఫ్ట్ బాక్స్",
  "Save Gift Card to Bag": "గిఫ్ట్ కార్డ్ సేవ్ చేయండి",
  "Gift Card Saved": "గిఫ్ట్ కార్డ్ సేవ్ చేయబడింది",
  "Notify Me": "నాకు తెలియజేయండి",
};

// Build a case-insensitive lookup map for fast matching
const LOWER_PHRASE_MAP = new Map<string, string>();
for (const [enText, teText] of Object.entries(TELUGU_PHRASE_DICT)) {
  LOWER_PHRASE_MAP.set(enText.trim().toLowerCase(), teText);
}

/**
 * Dynamic Regex Pattern Translators for strings with numbers/variables
 */
function translateDynamicPatterns(trimmed: string): string | null {
  // VIEW ALL SAREES (18)
  const viewAllMatch = trimmed.match(/^VIEW ALL SAREES\s*\((\d+)\)$/i);
  if (viewAllMatch) {
    return `అన్ని చీరలను చూడండి (${viewAllMatch[1]})`;
  }

  // Showing X of Y Sarees / Showing X Sarees
  const showingOfMatch = trimmed.match(/^Showing\s+(\d+)\s+of\s+(\d+)\s+Sarees?$/i);
  if (showingOfMatch) {
    return `${showingOfMatch[2]} చీరలలో ${showingOfMatch[1]} చూపబడుతున్నాయి`;
  }
  const showingMatch = trimmed.match(/^Showing\s+(\d+)\s+Sarees?$/i);
  if (showingMatch) {
    return `${showingMatch[1]} చీరలు చూపబడుతున్నాయి`;
  }

  // All 18 Sarees Loaded
  const allLoadedMatch = trimmed.match(/^All\s+(\d+)\s+Sarees?\s+Loaded$/i);
  if (allLoadedMatch) {
    return `మొత్తం ${allLoadedMatch[1]} చీరలు లోడ్ అయ్యాయి`;
  }

  // (128 Reviews) or 128 Reviews
  const parenReviewsMatch = trimmed.match(/^\((\d+)\s*Reviews?\)$/i);
  if (parenReviewsMatch) {
    return `(${parenReviewsMatch[1]} సమీక్షలు)`;
  }
  const reviewsMatch = trimmed.match(/^(\d+)\s*Reviews?$/i);
  if (reviewsMatch) {
    return `${reviewsMatch[1]} సమీక్షలు`;
  }

  // 24% OFF / 20% off
  const offMatch = trimmed.match(/^(\d+)%\s*OFF$/i);
  if (offMatch) {
    return `${offMatch[1]}% తగ్గింపు`;
  }

  // Save ₹X,XXX
  const saveMatch = trimmed.match(/^Save\s+(₹[\d,]+)$/i);
  if (saveMatch) {
    return `${saveMatch[1]} ఆదా చేయండి`;
  }

  // Follow @handle
  const followMatch = trimmed.match(/^Follow\s+(@[\w._]+)$/i);
  if (followMatch) {
    return `${followMatch[1]} ని ఫాలో అవ్వండి`;
  }

  // Copyright line
  const copyMatch = trimmed.match(/^©\s*(\d{4})\s+(.+?)\.\s*All Rights Reserved\.?$/i);
  if (copyMatch) {
    return `© ${copyMatch[1]} ${copyMatch[2]}. సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.`;
  }

  // X Items / X Item
  const itemsMatch = trimmed.match(/^(\d+)\s+Items?$/i);
  if (itemsMatch) {
    return `${itemsMatch[1]} వస్తువులు`;
  }

  return null;
}

// Persistent cache for async translated sentences/descriptions
const ASYNC_TE_CACHE = new Map<string, string>();
const PENDING_REQUESTS = new Map<string, Promise<string>>();

function loadAsyncCacheFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("silkverse-te-cache-v1");
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, string>;
      for (const [k, v] of Object.entries(parsed)) {
        ASYNC_TE_CACHE.set(k, v);
      }
    }
  } catch {
    // ignore
  }
}

let saveCacheTimeout: ReturnType<typeof setTimeout> | null = null;
function scheduleSaveAsyncCache() {
  if (typeof window === "undefined") return;
  if (saveCacheTimeout) clearTimeout(saveCacheTimeout);
  saveCacheTimeout = setTimeout(() => {
    try {
      const obj: Record<string, string> = {};
      let count = 0;
      for (const [k, v] of ASYNC_TE_CACHE.entries()) {
        obj[k] = v;
        count++;
        if (count > 800) break;
      }
      localStorage.setItem("silkverse-te-cache-v1", JSON.stringify(obj));
    } catch {
      // ignore
    }
  }, 600);
}

async function fetchTeluguTranslation(text: string): Promise<string> {
  const key = text.trim();
  if (!key) return text;
  if (ASYNC_TE_CACHE.has(key)) {
    return ASYNC_TE_CACHE.get(key)!;
  }
  if (PENDING_REQUESTS.has(key)) {
    return PENDING_REQUESTS.get(key)!;
  }

  const promise = (async () => {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=${encodeURIComponent(
        key
      )}`;
      const res = await fetch(url);
      if (!res.ok) return key;
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0]
          .map((part: unknown) => (Array.isArray(part) ? part[0] : ""))
          .join("")
          .trim();
        if (translated) {
          ASYNC_TE_CACHE.set(key, translated);
          scheduleSaveAsyncCache();
          return translated;
        }
      }
    } catch {
      // ignore network error
    } finally {
      PENDING_REQUESTS.delete(key);
    }
    return key;
  })();

  PENDING_REQUESTS.set(key, promise);
  return promise;
}

/**
 * Synchronous lookup for a string: returns immediate Telugu string if known, or null if it needs async translation
 */
function lookupSyncTelugu(rawText: string): { translated: string | null; needsAsync: boolean } {
  const trimmed = rawText.trim();
  if (!trimmed) return { translated: null, needsAsync: false };

  // Skip pure numbers, prices, symbols, emails, URLs, coupon codes, or already-Telugu strings
  if (/^[\d\s₹$,.%+\-•✦✓×/:()@#&*!|]+$/.test(trimmed)) {
    return { translated: null, needsAsync: false };
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { translated: null, needsAsync: false };
  }
  if (/[\u0C00-\u0C7F]/.test(trimmed) && !/[a-zA-Z]{3,}/.test(trimmed)) {
    return { translated: null, needsAsync: false };
  }
  // Keep brand name "SilkVerse" or coupon codes intact when standalone
  if (/^(SilkVerse|WELCOME10|SILK10|FESTIVE15|ROYAL20|WELCOME500|FREESHIP|EN|తెలుగు|UPI|COD)$/i.test(trimmed)) {
    return { translated: null, needsAsync: false };
  }

  const leadingSpace = rawText.match(/^\s*/)?.[0] || "";
  const trailingSpace = rawText.match(/\s*$/)?.[0] || "";

  // 1. Exact or case-insensitive phrase dictionary match
  if (TELUGU_PHRASE_DICT[trimmed]) {
    return {
      translated: `${leadingSpace}${TELUGU_PHRASE_DICT[trimmed]}${trailingSpace}`,
      needsAsync: false,
    };
  }
  const lowerMatch = LOWER_PHRASE_MAP.get(trimmed.toLowerCase());
  if (lowerMatch) {
    return {
      translated: `${leadingSpace}${lowerMatch}${trailingSpace}`,
      needsAsync: false,
    };
  }

  // 2. Dynamic regex pattern match
  const patternMatch = translateDynamicPatterns(trimmed);
  if (patternMatch) {
    return {
      translated: `${leadingSpace}${patternMatch}${trailingSpace}`,
      needsAsync: false,
    };
  }

  // 3. Cached async translation
  if (ASYNC_TE_CACHE.has(trimmed)) {
    return {
      translated: `${leadingSpace}${ASYNC_TE_CACHE.get(trimmed)!}${trailingSpace}`,
      needsAsync: false,
    };
  }

  // Needs async translation if it contains English words
  if (/[a-zA-Z]{2,}/.test(trimmed)) {
    return { translated: null, needsAsync: true };
  }

  return { translated: null, needsAsync: false };
}

const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "CODE",
  "PRE",
  "SVG",
  "PATH",
  "TEXTAREA",
  "INPUT",
]);

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
  t: (key, fallback) => fallback || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const originalTextMapRef = useRef<WeakMap<Text, string>>(new WeakMap());
  const lastTranslatedMapRef = useRef<WeakMap<Text, string>>(new WeakMap());
  const originalPlaceholderMapRef = useRef<WeakMap<Element, string>>(new WeakMap());
  const lastPlaceholderMapRef = useRef<WeakMap<Element, string>>(new WeakMap());
  const langRef = useRef<Language>("en");

  useEffect(() => {
    loadAsyncCacheFromStorage();
    try {
      const saved = localStorage.getItem("silkverse-lang") as Language | null;
      if (saved === "en" || saved === "te") {
        setLangState(saved);
        langRef.current = saved;
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (newLang: Language) => {
    langRef.current = newLang;
    setLangState(newLang);
    try {
      localStorage.setItem("silkverse-lang", newLang);
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "te" : "en");
  };

  const t = (key: string, fallback?: string): string => {
    return translations[lang]?.[key] || translations.en[key] || fallback || key;
  };

  // Full-Website DOM Text & Placeholder Translator
  useEffect(() => {
    langRef.current = lang;
    if (typeof document === "undefined") return;

    document.documentElement.lang = lang === "te" ? "te" : "en";

    const originalTextMap = originalTextMapRef.current;
    const lastTranslatedMap = lastTranslatedMapRef.current;
    const originalPlaceholderMap = originalPlaceholderMapRef.current;
    const lastPlaceholderMap = lastPlaceholderMapRef.current;

    const shouldSkipNode = (node: Node): boolean => {
      const parent = node.parentElement;
      if (!parent) return true;
      if (SKIP_TAGS.has(parent.tagName)) return true;
      if (parent.closest("[data-no-translate='true']")) return true;
      // Don't translate font-mono coupon codes or order IDs
      if (parent.classList.contains("font-mono")) return true;
      return false;
    };

    const processTextNode = (textNode: Text) => {
      if (shouldSkipNode(textNode)) return;
      const currentVal = textNode.nodeValue || "";
      if (!currentVal.trim()) return;

      const lastTranslated = lastTranslatedMap.get(textNode);
      if (!originalTextMap.has(textNode) || (lastTranslated && currentVal !== lastTranslated)) {
        // Store the fresh English original if not already Telugu
        if (!/[\u0C00-\u0C7F]/.test(currentVal)) {
          originalTextMap.set(textNode, currentVal);
        }
      }

      const sourceEn = originalTextMap.get(textNode) ?? currentVal;

      if (langRef.current === "en") {
        if (originalTextMap.has(textNode) && currentVal !== sourceEn) {
          textNode.nodeValue = sourceEn;
        }
        return;
      }

      // lang === "te"
      const { translated, needsAsync } = lookupSyncTelugu(sourceEn);
      if (translated && textNode.nodeValue !== translated) {
        lastTranslatedMap.set(textNode, translated);
        textNode.nodeValue = translated;
      } else if (needsAsync) {
        const leadingSpace = sourceEn.match(/^\s*/)?.[0] || "";
        const trailingSpace = sourceEn.match(/\s*$/)?.[0] || "";
        fetchTeluguTranslation(sourceEn).then((asyncTe) => {
          if (langRef.current !== "te") return;
          if (!textNode.isConnected) return;
          const finalStr = `${leadingSpace}${asyncTe}${trailingSpace}`;
          if (textNode.nodeValue !== finalStr) {
            lastTranslatedMap.set(textNode, finalStr);
            textNode.nodeValue = finalStr;
          }
        });
      }
    };

    const processPlaceholders = (root: ParentNode) => {
      if (!(root instanceof Element || root instanceof Document)) return;
      const inputs = root.querySelectorAll("input[placeholder], textarea[placeholder]");
      inputs.forEach((el) => {
        const currentPh = el.getAttribute("placeholder") || "";
        if (!currentPh.trim()) return;

        const lastPh = lastPlaceholderMap.get(el);
        if (!originalPlaceholderMap.has(el) || (lastPh && currentPh !== lastPh)) {
          if (!/[\u0C00-\u0C7F]/.test(currentPh)) {
            originalPlaceholderMap.set(el, currentPh);
          }
        }

        const sourcePh = originalPlaceholderMap.get(el) ?? currentPh;
        if (langRef.current === "en") {
          if (originalPlaceholderMap.has(el) && currentPh !== sourcePh) {
            el.setAttribute("placeholder", sourcePh);
          }
          return;
        }

        const { translated, needsAsync } = lookupSyncTelugu(sourcePh);
        if (translated && currentPh !== translated) {
          lastPlaceholderMap.set(el, translated);
          el.setAttribute("placeholder", translated);
        } else if (needsAsync) {
          fetchTeluguTranslation(sourcePh).then((asyncTe) => {
            if (langRef.current !== "te") return;
            if (el.getAttribute("placeholder") !== asyncTe) {
              lastPlaceholderMap.set(el, asyncTe);
              el.setAttribute("placeholder", asyncTe);
            }
          });
        }
      });
    };

    const walkAndTranslate = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) {
        processTextNode(root as Text);
        return;
      }
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Node | null = walker.nextNode();
      while (node) {
        processTextNode(node as Text);
        node = walker.nextNode();
      }
      if (root instanceof Element || root instanceof Document) {
        processPlaceholders(root);
      }
    };

    // Initial full-DOM pass
    walkAndTranslate(document.body);

    // Observe dynamic route changes, modals, dropdowns, and state updates
    let rafId: number | null = null;
    const pendingRoots = new Set<Node>();

    const observer = new MutationObserver((mutations) => {
      if (langRef.current !== "te") return;
      for (const m of mutations) {
        if (m.type === "characterData" && m.target.nodeType === Node.TEXT_NODE) {
          const tNode = m.target as Text;
          if (tNode.nodeValue !== lastTranslatedMap.get(tNode)) {
            pendingRoots.add(tNode);
          }
        } else if (m.type === "childList") {
          m.addedNodes.forEach((added) => {
            pendingRoots.add(added);
          });
        }
      }

      if (pendingRoots.size > 0 && rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          const nodes = Array.from(pendingRoots);
          pendingRoots.clear();
          for (const n of nodes) {
            if (n.isConnected) {
              walkAndTranslate(n);
            }
          }
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
