/** All 28 States + 8 Union Territories of India */
export const INDIAN_STATES = [
  // States (28)
  { code: "AP", name: "Andhra Pradesh", type: "state" as const },
  { code: "AR", name: "Arunachal Pradesh", type: "state" as const },
  { code: "AS", name: "Assam", type: "state" as const },
  { code: "BR", name: "Bihar", type: "state" as const },
  { code: "CG", name: "Chhattisgarh", type: "state" as const },
  { code: "GA", name: "Goa", type: "state" as const },
  { code: "GJ", name: "Gujarat", type: "state" as const },
  { code: "HR", name: "Haryana", type: "state" as const },
  { code: "HP", name: "Himachal Pradesh", type: "state" as const },
  { code: "JH", name: "Jharkhand", type: "state" as const },
  { code: "KA", name: "Karnataka", type: "state" as const },
  { code: "KL", name: "Kerala", type: "state" as const },
  { code: "MP", name: "Madhya Pradesh", type: "state" as const },
  { code: "MH", name: "Maharashtra", type: "state" as const },
  { code: "MN", name: "Manipur", type: "state" as const },
  { code: "ML", name: "Meghalaya", type: "state" as const },
  { code: "MZ", name: "Mizoram", type: "state" as const },
  { code: "NL", name: "Nagaland", type: "state" as const },
  { code: "OD", name: "Odisha", type: "state" as const },
  { code: "PB", name: "Punjab", type: "state" as const },
  { code: "RJ", name: "Rajasthan", type: "state" as const },
  { code: "SK", name: "Sikkim", type: "state" as const },
  { code: "TN", name: "Tamil Nadu", type: "state" as const },
  { code: "TS", name: "Telangana", type: "state" as const },
  { code: "TR", name: "Tripura", type: "state" as const },
  { code: "UP", name: "Uttar Pradesh", type: "state" as const },
  { code: "UK", name: "Uttarakhand", type: "state" as const },
  { code: "WB", name: "West Bengal", type: "state" as const },
  // Union Territories (8)
  { code: "AN", name: "Andaman and Nicobar Islands", type: "ut" as const },
  { code: "CH", name: "Chandigarh", type: "ut" as const },
  { code: "DD", name: "Dadra and Nagar Haveli and Daman and Diu", type: "ut" as const },
  { code: "DL", name: "Delhi", type: "ut" as const },
  { code: "JK", name: "Jammu and Kashmir", type: "ut" as const },
  { code: "LA", name: "Ladakh", type: "ut" as const },
  { code: "LD", name: "Lakshadweep", type: "ut" as const },
  { code: "PY", name: "Puducherry", type: "ut" as const },
] as const;

export type IndianState = typeof INDIAN_STATES[number];

/** 15 supported languages */
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "ur", label: "Urdu", native: "اردو", dir: "rtl" as const },
  { code: "as", label: "Assamese", native: "অসমীয়া" },
  { code: "sa", label: "Sanskrit", native: "संस्कृतम्" },
  { code: "ne", label: "Nepali", native: "नेपाली" },
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
