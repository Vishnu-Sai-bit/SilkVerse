export const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Canada",
  "Australia",
  "Singapore",
] as const;

export const INDIA_STATES_AND_DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Sri Sathya Sai (Dharmavaram)",
    "Anantapur",
    "Tirupati",
    "Chittoor",
    "Visakhapatnam",
    "NTR (Vijayawada)",
    "Guntur",
    "Kurnool",
    "YSR Kadapa",
    "SPSR Nellore",
    "Kakinada",
    "East Godavari (Rajahmundry)",
    "West Godavari (Bhimavaram)",
    "Eluru",
    "Krishna (Machilipatnam)",
    "Prakasam (Ongole)",
    "Srikakulam",
    "Vizianagaram",
    "Nandyal",
    "Annamayya (Rayachoti)",
    "Palnadu (Narasaraopet)",
    "Bapatla",
    "Dr. B.R. Ambedkar Konaseema",
    "Anakapalli",
    "Alluri Sitharama Raju",
    "Parvathipuram Manyam",
  ],
  Telangana: [
    "Hyderabad",
    "Rangareddy",
    "Medchal-Malkajgiri",
    "Sangareddy",
    "Warangal",
    "Hanamkonda",
    "Karimnagar",
    "Nizamabad",
    "Khammam",
    "Nalgonda",
    "Mahabubnagar",
    "Siddipet",
    "Suryapet",
    "Adilabad",
    "Bhadradri Kothagudem",
    "Jagtial",
    "Kamareddy",
    "Kumuram Bheem Asifabad",
    "Mahabubabad",
    "Mancherial",
    "Medak",
    "Mulugu",
    "Nagarkurnool",
    "Narayanpet",
    "Nirmal",
    "Peddapalli",
    "Rajanna Sircilla",
    "Vikarabad",
    "Wanaparthy",
    "Yadadri Bhuvanagiri",
  ],
  Karnataka: [
    "Bengaluru Urban",
    "Bengaluru Rural",
    "Mysuru",
    "Mangaluru (Dakshina Kannada)",
    "Hubballi-Dharwad",
    "Belagavi",
    "Ballari",
    "Tumakuru",
    "Shivamogga",
    "Udupi",
    "Kalaburagi",
    "Davanagere",
    "Kolar",
    "Chikkaballapur",
    "Raichur",
    "Vijayapura",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Kanchipuram",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tirunelveli",
    "Erode",
    "Vellore",
    "Tiruppur",
    "Thanjavur",
    "Chengalpattu",
    "Tiruvallur",
    "Kanyakumari",
  ],
  Maharashtra: [
    "Mumbai City",
    "Mumbai Suburban",
    "Pune",
    "Thane",
    "Nagpur",
    "Nashik",
    "Chhatrapati Sambhajinagar (Aurangabad)",
    "Solapur",
    "Kolhapur",
    "Raigad",
  ],
  Kerala: [
    "Thiruvananthapuram",
    "Ernakulam (Kochi)",
    "Kozhikode",
    "Thrissur",
    "Kollam",
    "Palakkad",
    "Alappuzha",
    "Kottayam",
    "Kannur",
    "Malappuram",
  ],
  Delhi: [
    "New Delhi",
    "South Delhi",
    "North Delhi",
    "East Delhi",
    "West Delhi",
    "Central Delhi",
    "Dwarka",
  ],
  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Gandhinagar",
    "Bhavnagar",
    "Jamnagar",
    "Kutch",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Varanasi (Banaras)",
    "Gautam Buddha Nagar (Noida)",
    "Ghaziabad",
    "Kanpur Nagar",
    "Agra",
    "Prayagraj",
    "Meerut",
    "Gorakhpur",
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "North 24 Parganas",
    "South 24 Parganas",
    "Darjeeling",
    "Hooghly",
    "Murshidabad",
    "Bardhaman",
  ],
  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Alwar",
  ],
  "Madhya Pradesh": [
    "Indore",
    "Bhopal",
    "Gwalior",
    "Jabalpur",
    "Ujjain",
    "Chanderi (Ashoknagar)",
  ],
  Odisha: [
    "Khordha (Bhubaneswar)",
    "Cuttack",
    "Puri",
    "Sambalpur",
    "Ganjam",
    "Sundargarh",
  ],
  Punjab: [
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "SAS Nagar (Mohali)",
  ],
  Haryana: [
    "Gurugram",
    "Faridabad",
    "Panipat",
    "Ambala",
    "Karnal",
    "Hisar",
  ],
  Bihar: [
    "Patna",
    "Gaya",
    "Bhagalpur",
    "Muzaffarpur",
    "Darbhanga",
  ],
  Assam: [
    "Kamrup Metropolitan (Guwahati)",
    "Sualkuchi (Kamrup)",
    "Dibrugarh",
    "Jorhat",
    "Silchar",
  ],
  Chhattisgarh: [
    "Raipur",
    "Bilaspur",
    "Durg",
    "Janjgir-Champa (Champa Silk)",
  ],
  Jharkhand: [
    "Ranchi",
    "East Singhbhum (Jamshedpur)",
    "Dhanbad",
    "Bokaro",
  ],
  Goa: [
    "North Goa (Panaji)",
    "South Goa (Margao)",
  ],
  Puducherry: [
    "Puducherry",
    "Karaikal",
  ],
  Uttarakhand: [
    "Dehradun",
    "Haridwar",
    "Nainital",
  ],
  "Himachal Pradesh": [
    "Shimla",
    "Kangra",
    "Kullu",
  ],
};

export const INDIAN_STATES = Object.keys(INDIA_STATES_AND_DISTRICTS);

export function getDistrictsForState(state: string): string[] {
  if (!state) return [];
  return INDIA_STATES_AND_DISTRICTS[state] || [];
}

/**
 * Smart PIN code lookup helper for common Indian PIN prefixes
 */
export function inferLocationFromPincode(pincode: string): {
  state?: string;
  district?: string;
  city?: string;
} | null {
  const clean = pincode.trim();
  if (!/^\d{6}$/.test(clean)) return null;

  if (clean === "515671" || clean === "515672") {
    return {
      state: "Andhra Pradesh",
      district: "Sri Sathya Sai (Dharmavaram)",
      city: "Dharmavaram",
    };
  }
  if (clean.startsWith("515")) {
    return {
      state: "Andhra Pradesh",
      district: "Anantapur",
    };
  }
  if (clean.startsWith("517")) {
    return {
      state: "Andhra Pradesh",
      district: "Tirupati",
    };
  }
  if (clean.startsWith("520")) {
    return {
      state: "Andhra Pradesh",
      district: "NTR (Vijayawada)",
    };
  }
  if (clean.startsWith("522")) {
    return {
      state: "Andhra Pradesh",
      district: "Guntur",
    };
  }
  if (clean.startsWith("530")) {
    return {
      state: "Andhra Pradesh",
      district: "Visakhapatnam",
    };
  }
  if (clean.startsWith("500") || clean.startsWith("501")) {
    return {
      state: "Telangana",
      district: "Hyderabad",
    };
  }
  if (clean.startsWith("506")) {
    return {
      state: "Telangana",
      district: "Warangal",
    };
  }
  if (clean.startsWith("560")) {
    return {
      state: "Karnataka",
      district: "Bengaluru Urban",
    };
  }
  if (clean.startsWith("600")) {
    return {
      state: "Tamil Nadu",
      district: "Chennai",
    };
  }
  if (clean.startsWith("631")) {
    return {
      state: "Tamil Nadu",
      district: "Kanchipuram",
    };
  }
  if (clean.startsWith("400")) {
    return {
      state: "Maharashtra",
      district: "Mumbai City",
    };
  }
  if (clean.startsWith("110")) {
    return {
      state: "Delhi",
      district: "New Delhi",
    };
  }
  return null;
}
