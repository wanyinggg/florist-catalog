const WA_NUMBER = "60169322176";
const IMG_BASE = "images/"; // ← change this to your folder name if different

const TABS = [
  { id: "graduation", label: "🎓 Graduation" },
  { id: "valentines", label: "💘 Valentines" },
  { id: "single", label: "🌹 Single Stalk Bouquet" },
  { id: "yellow", label: "💛 Yellow" },
  { id: "purple", label: "💜 Purple" },
  { id: "pink", label: "🩷 Pink" },
  { id: "red", label: "❤️ Red" },
  { id: "cny", label: "🎊 CNY / Moving House / Opening" },
  { id: "mothers", label: "💃 Mother's Day" },
  { id: "teachers", label: "👩‍🏫 Teacher's Day" },
  { id: "basket", label: "🧺 Flower Basket" },
];

const BADGE_CLASS = {
  custom: "badge-custom",
  popular: "badge-popular",
  seasonal: "badge-seasonal",
};
const BADGE_LABEL = {
  custom: "Custom-friendly",
  popular: "Popular",
  seasonal: "Seasonal",
};
const COL_LABEL = {
  graduation: "Graduation",
  valentines: "Valentines",
  single: "Single Stalk Bouquet",
  yellow: "Yellow",
  purple: "Purple",
  pink: "Pink",
  red: "Red",
  cny: "CNY / Moving House / Opening",
  mothers: "Mother's Day",
  teachers: "Teacher's Day",
  basket: "Flower Basket",
};
const BG = {
  graduation: "#e8f5ff",
  valentines: "#ffe8f0",
  single: "#fff0f0",
  yellow: "#fffbe8",
  purple: "#f3e8ff",
  pink: "#ffe8f5",
  red: "#ffe8e8",
  cny: "#fff3e8",
  mothers: "#fce8ff",
  teachers: "#e8fff0",
  basket: "#f0ffe8",
};

// Products live in Supabase — populated at runtime by sbGetProducts()
var PRODUCTS = [];
