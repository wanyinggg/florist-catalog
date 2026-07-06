const WA_NUMBER = "60169322176";
const IMG_BASE = "images/";

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

// Collections live in Supabase — populated at runtime by sbGetCollections()
var TABS = [];
var BG = {};

// Products live in Supabase — populated at runtime by sbGetProducts()
var PRODUCTS = [];
