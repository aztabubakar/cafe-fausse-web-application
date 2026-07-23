import heroRestaurantInterior from "../assets/images/optimized/hero-restaurant-interior.jpg";
import restaurantExterior from "../assets/images/optimized/restaurant-exterior.jpg";
import restaurantDiningRoom from "../assets/images/optimized/restaurant-dining-room.jpg";
import kitchenTeam from "../assets/images/optimized/kitchen-team.jpg";
import chefAntonioRossi from "../assets/images/optimized/chef-antonio-rossi.jpg";
import mariaLopezRestaurateur from "../assets/images/optimized/maria-lopez-restaurateur.jpg";
import bruschetta from "../assets/images/optimized/bruschetta.jpg";
import caesarSalad from "../assets/images/optimized/caesar-salad.jpg";
import grilledSalmon from "../assets/images/optimized/grilled-salmon.jpg";
import ribeyeSteak from "../assets/images/optimized/ribeye-steak.jpg";
import vegetableRisotto from "../assets/images/optimized/vegetable-risotto.jpg";
import tiramisu from "../assets/images/optimized/tiramisu.jpg";
import cheesecake from "../assets/images/optimized/cheesecake.jpg";
import wineGlasses from "../assets/images/optimized/wine-glasses.jpg";
import whiteWine from "../assets/images/optimized/white-wine.jpg";
import craftBeer from "../assets/images/optimized/craft-beer.jpg";
import espresso from "../assets/images/optimized/espresso.jpg";

// Every image on the site is imported exactly once, here. Pages and other
// data modules (menu.js, founders.js) reference entries from IMAGES rather
// than importing asset files directly, so each photo has one description,
// one alt text, and one on-disk source of truth. Dimensions match the
// optimized derivatives in assets/images/optimized/ (see that folder's
// README for why they exist) and are used as width/height attributes to
// prevent layout shift.
//
// galleryCategory is one of the Gallery page's filter ids (see
// GALLERY_FILTERS below) for images that belong in the Gallery grid, or
// null for images used only elsewhere on the site (the founder portraits
// appear on the About page instead).
export const IMAGES = {
  heroRestaurantInterior: {
    id: "hero-restaurant-interior",
    src: heroRestaurantInterior,
    width: 1920,
    height: 1353,
    title: "Dining Room",
    galleryCategory: "interior",
    alt: "Warmly lit dining room with wood-paneled walls, patterned tile floor, and tables set for service",
    caption: "Our dining room, set and ready for the evening",
  },
  restaurantExterior: {
    id: "restaurant-exterior",
    src: restaurantExterior,
    width: 1920,
    height: 1277,
    title: "Old-World Elegance",
    galleryCategory: "interior",
    alt: "Illuminated historic building beside a river at dusk, evoking the old-world elegance behind Café Fausse's design",
    caption: "The old-world elegance that inspires our space",
  },
  restaurantDiningRoom: {
    id: "restaurant-dining-room",
    src: restaurantDiningRoom,
    width: 1920,
    height: 1280,
    title: "Private Event Table",
    galleryCategory: "events",
    alt: "Long private-dining table set for a special event with candlesticks, white orchids, and wine glasses at each place setting",
    caption: "A private table set for a special occasion",
  },
  kitchenTeam: {
    id: "kitchen-team",
    src: kitchenTeam,
    width: 1920,
    height: 1080,
    title: "Kitchen Team",
    galleryCategory: "behind-the-scenes",
    alt: "Three chefs in white uniforms and toques preparing dishes together at a stainless steel kitchen counter",
    caption: "Our kitchen team at work behind the scenes",
  },
  chefAntonioRossi: {
    id: "chef-antonio-rossi",
    src: chefAntonioRossi,
    width: 1280,
    height: 1920,
    title: "Chef Antonio Rossi",
    galleryCategory: null,
    alt: "Portrait of Chef Antonio Rossi in a white chef's uniform and toque, arms crossed, smiling in the kitchen",
    caption: "Chef Antonio Rossi, co-founder",
  },
  mariaLopezRestaurateur: {
    id: "maria-lopez-restaurateur",
    src: mariaLopezRestaurateur,
    width: 1280,
    height: 1920,
    title: "Maria Lopez",
    galleryCategory: null,
    alt: "Portrait of restaurateur Maria Lopez standing behind a display case of plated appetizers",
    caption: "Maria Lopez, co-founder and restaurateur",
  },
  bruschetta: {
    id: "bruschetta",
    src: bruschetta,
    width: 1920,
    height: 1280,
    title: "Bruschetta",
    galleryCategory: "cuisine",
    alt: "Close-up of bruschetta: toasted baguette slices topped with diced tomatoes, basil, and olive oil",
    caption: "Bruschetta, a Café Fausse starter",
  },
  caesarSalad: {
    id: "caesar-salad",
    src: caesarSalad,
    width: 1881,
    height: 1920,
    title: "Caesar Salad",
    galleryCategory: "cuisine",
    alt: "Caesar salad with crisp romaine, shaved parmesan, croutons, grilled chicken, and cherry tomatoes on a blue plate",
    caption: "Caesar Salad, a Café Fausse starter",
  },
  grilledSalmon: {
    id: "grilled-salmon",
    src: grilledSalmon,
    width: 1920,
    height: 1536,
    title: "Grilled Salmon",
    galleryCategory: "cuisine",
    alt: "Grilled salmon fillets over mixed greens and cucumber ribbons, garnished with olives and a crisp tuile",
    caption: "Grilled Salmon, a Café Fausse main course",
  },
  ribeyeSteak: {
    id: "ribeye-steak",
    src: ribeyeSteak,
    width: 1920,
    height: 1280,
    title: "Ribeye Steak",
    galleryCategory: "cuisine",
    alt: "Seared ribeye steak with grilled vegetables and garlic mashed potatoes, garnished with rosemary",
    caption: "Ribeye Steak, a Café Fausse main course",
  },
  vegetableRisotto: {
    id: "vegetable-risotto",
    src: vegetableRisotto,
    width: 1920,
    height: 1076,
    title: "Vegetable Risotto",
    galleryCategory: "cuisine",
    alt: "Creamy Arborio rice risotto topped with sauteed wild mushrooms, parsley, and shaved parmesan",
    caption: "Vegetable Risotto, a Café Fausse main course",
  },
  tiramisu: {
    id: "tiramisu",
    src: tiramisu,
    width: 1920,
    height: 1536,
    title: "Tiramisu",
    galleryCategory: "cuisine",
    alt: "Layered tiramisu dusted with cocoa, topped with a tuile and fresh berries",
    caption: "Tiramisu, a Café Fausse dessert",
  },
  cheesecake: {
    id: "cheesecake",
    src: cheesecake,
    width: 1920,
    height: 1536,
    title: "Cheesecake",
    galleryCategory: "cuisine",
    alt: "Individual cheesecake topped with berry compote, fresh strawberries, and red currants",
    caption: "Cheesecake, a Café Fausse dessert",
  },
  wineGlasses: {
    id: "wine-glasses",
    src: wineGlasses,
    width: 1920,
    height: 1666,
    title: "Red Wine",
    galleryCategory: "cuisine",
    alt: "A glass of red wine beside a wooden board of cheeses and cured accompaniments",
    caption: "Red wine, a Café Fausse beverage",
  },
  whiteWine: {
    id: "white-wine",
    src: whiteWine,
    width: 1920,
    height: 1920,
    title: "White Wine",
    galleryCategory: "cuisine",
    alt: "A glass of white wine beside a plate of creamy pasta garnished with parsley, with grapes in the foreground",
    caption: "White wine, a Café Fausse beverage",
  },
  craftBeer: {
    id: "craft-beer",
    src: craftBeer,
    width: 1920,
    height: 1440,
    title: "Craft Beer",
    galleryCategory: "cuisine",
    alt: "A glass of amber craft beer with a foam head, with additional glasses in the background",
    caption: "Craft beer, a Café Fausse beverage",
  },
  espresso: {
    id: "espresso",
    src: espresso,
    width: 1920,
    height: 1536,
    title: "Espresso",
    galleryCategory: "cuisine",
    alt: "Overhead view of a small cup of espresso on a dark saucer, surrounded by scattered ground coffee",
    caption: "Espresso, a Café Fausse beverage",
  },
};

export const GALLERY_FILTERS = [
  { id: "all", label: "All" },
  { id: "interior", label: "Interior" },
  { id: "cuisine", label: "Cuisine" },
  { id: "events", label: "Events" },
  { id: "behind-the-scenes", label: "Behind the Scenes" },
];

const CATEGORY_LABELS = Object.fromEntries(
  GALLERY_FILTERS.map((filter) => [filter.id, filter.label]),
);

export const galleryImages = Object.values(IMAGES)
  .filter((image) => image.galleryCategory)
  .map((image) => ({ ...image, categoryLabel: CATEGORY_LABELS[image.galleryCategory] }));
