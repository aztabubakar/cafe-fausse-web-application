import { IMAGES } from "./images.js";

// Item names, descriptions, and prices are exact per the SRS (section 3.1.2).
// Not every beverage has a supplied photo; items without one render without
// an image rather than a substitute or fabricated photo.
export const menu = [
  {
    category: "Starters",
    items: [
      {
        name: "Bruschetta",
        description: "Fresh tomatoes, basil, olive oil, and toasted baguette slices",
        price: "$8.50",
        image: IMAGES.bruschetta,
      },
      {
        name: "Caesar Salad",
        description: "Crisp romaine with homemade Caesar dressing",
        price: "$9.00",
        image: IMAGES.caesarSalad,
      },
    ],
  },
  {
    category: "Main Courses",
    items: [
      {
        name: "Grilled Salmon",
        description: "Served with lemon butter sauce and seasonal vegetables",
        price: "$22.00",
        image: IMAGES.grilledSalmon,
      },
      {
        name: "Ribeye Steak",
        description: "12 oz prime cut with garlic mashed potatoes",
        price: "$28.00",
        image: IMAGES.ribeyeSteak,
      },
      {
        name: "Vegetable Risotto",
        description: "Creamy Arborio rice with wild mushrooms",
        price: "$18.00",
        image: IMAGES.vegetableRisotto,
      },
    ],
  },
  {
    category: "Desserts",
    items: [
      {
        name: "Tiramisu",
        description: "Classic Italian dessert with mascarpone",
        price: "$7.50",
        image: IMAGES.tiramisu,
      },
      {
        name: "Cheesecake",
        description: "Creamy cheesecake with berry compote",
        price: "$7.00",
        image: IMAGES.cheesecake,
      },
    ],
  },
  {
    category: "Beverages",
    items: [
      {
        name: "Red Wine (Glass)",
        description: "A selection of Italian reds",
        price: "$10.00",
        image: IMAGES.wineGlasses,
      },
      {
        name: "White Wine (Glass)",
        description: "Crisp and refreshing",
        price: "$9.00",
      },
      {
        name: "Craft Beer",
        description: "Local artisan brews",
        price: "$6.00",
      },
      {
        name: "Espresso",
        description: "Strong and aromatic",
        price: "$3.00",
      },
    ],
  },
];
