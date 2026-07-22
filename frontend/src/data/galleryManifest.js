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

export const GALLERY_CATEGORIES = {
  INTERIOR: "Interior ambiance",
  DISHES: "Menu dishes",
  EVENTS: "Special events",
  BEHIND_THE_SCENES: "Behind the scenes",
  STORY: "Founder or restaurant story",
};

// Every entry maps one supplied file (frontend/src/assets/images/) to the
// gallery category it best represents, plus the alt text and caption used
// wherever that image appears on the site. Dimensions match the optimized
// derivative in assets/images/optimized/ and are used for width/height
// attributes to prevent layout shift.
export const galleryManifest = [
  {
    id: "hero-restaurant-interior",
    file: "hero-restaurant-interior.jpg",
    src: heroRestaurantInterior,
    width: 1920,
    height: 1353,
    category: GALLERY_CATEGORIES.INTERIOR,
    alt: "Warmly lit dining room with wood-paneled walls, patterned tile floor, and tables set for service",
    caption: "Our dining room, set and ready for the evening",
  },
  {
    id: "restaurant-exterior",
    file: "restaurant-exterior.jpg",
    src: restaurantExterior,
    width: 1920,
    height: 1277,
    category: GALLERY_CATEGORIES.INTERIOR,
    alt: "Illuminated historic building beside a river at dusk, evoking the old-world elegance behind Café Fausse's design",
    caption: "The old-world elegance that inspires our space",
  },
  {
    id: "restaurant-dining-room",
    file: "restaurant-dining-room.jpg",
    src: restaurantDiningRoom,
    width: 1920,
    height: 1280,
    category: GALLERY_CATEGORIES.EVENTS,
    alt: "Long private-dining table set for a special event with candlesticks, white orchids, and wine glasses at each place setting",
    caption: "A private table set for a special occasion",
  },
  {
    id: "kitchen-team",
    file: "kitchen-team.jpg",
    src: kitchenTeam,
    width: 1920,
    height: 1080,
    category: GALLERY_CATEGORIES.BEHIND_THE_SCENES,
    alt: "Three chefs in white uniforms and toques preparing dishes together at a stainless steel kitchen counter",
    caption: "Our kitchen team at work behind the scenes",
  },
  {
    id: "chef-antonio-rossi",
    file: "chef-antonio-rossi.jpg",
    src: chefAntonioRossi,
    width: 1280,
    height: 1920,
    category: GALLERY_CATEGORIES.STORY,
    alt: "Portrait of Chef Antonio Rossi in a white chef's uniform and toque, arms crossed, smiling in the kitchen",
    caption: "Chef Antonio Rossi, co-founder",
  },
  {
    id: "maria-lopez-restaurateur",
    file: "maria-lopez-restaurateur.jpg",
    src: mariaLopezRestaurateur,
    width: 1280,
    height: 1920,
    category: GALLERY_CATEGORIES.STORY,
    alt: "Portrait of restaurateur Maria Lopez standing behind a display case of plated appetizers",
    caption: "Maria Lopez, co-founder and restaurateur",
  },
  {
    id: "bruschetta",
    file: "bruschetta.jpg",
    src: bruschetta,
    width: 1920,
    height: 1280,
    category: GALLERY_CATEGORIES.DISHES,
    alt: "Close-up of bruschetta: toasted baguette slices topped with diced tomatoes, basil, and olive oil",
    caption: "Bruschetta, a Café Fausse starter",
  },
  {
    id: "caesar-salad",
    file: "caesar-salad.jpg",
    src: caesarSalad,
    width: 1881,
    height: 1920,
    category: GALLERY_CATEGORIES.DISHES,
    alt: "Caesar salad with crisp romaine, shaved parmesan, croutons, grilled chicken, and cherry tomatoes on a blue plate",
    caption: "Caesar Salad, a Café Fausse starter",
  },
  {
    id: "grilled-salmon",
    file: "grilled-salmon.jpg",
    src: grilledSalmon,
    width: 1920,
    height: 1536,
    category: GALLERY_CATEGORIES.DISHES,
    alt: "Grilled salmon fillets over mixed greens and cucumber ribbons, garnished with olives and a crisp tuile",
    caption: "Grilled Salmon, a Café Fausse main course",
  },
  {
    id: "ribeye-steak",
    file: "ribeye-steak.jpg",
    src: ribeyeSteak,
    width: 1920,
    height: 1280,
    category: GALLERY_CATEGORIES.DISHES,
    alt: "Seared ribeye steak with grilled vegetables and garlic mashed potatoes, garnished with rosemary",
    caption: "Ribeye Steak, a Café Fausse main course",
  },
  {
    id: "vegetable-risotto",
    file: "vegetable-risotto.jpg",
    src: vegetableRisotto,
    width: 1920,
    height: 1076,
    category: GALLERY_CATEGORIES.DISHES,
    alt: "Creamy Arborio rice risotto topped with sauteed wild mushrooms, parsley, and shaved parmesan",
    caption: "Vegetable Risotto, a Café Fausse main course",
  },
  {
    id: "tiramisu",
    file: "tiramisu.jpg",
    src: tiramisu,
    width: 1920,
    height: 1536,
    category: GALLERY_CATEGORIES.DISHES,
    alt: "Layered tiramisu dusted with cocoa, topped with a tuile and fresh berries",
    caption: "Tiramisu, a Café Fausse dessert",
  },
  {
    id: "cheesecake",
    file: "cheesecake.jpg",
    src: cheesecake,
    width: 1920,
    height: 1536,
    category: GALLERY_CATEGORIES.DISHES,
    alt: "Individual cheesecake topped with berry compote, fresh strawberries, and red currants",
    caption: "Cheesecake, a Café Fausse dessert",
  },
  {
    id: "wine-glasses",
    file: "wine-glasses.jpg",
    src: wineGlasses,
    width: 1920,
    height: 1666,
    category: GALLERY_CATEGORIES.DISHES,
    alt: "A glass of red wine beside a wooden board of cheeses and cured accompaniments",
    caption: "Red wine, a Café Fausse beverage",
  },
];
