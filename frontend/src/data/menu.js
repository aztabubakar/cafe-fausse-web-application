import bruschetta from "../assets/images/optimized/bruschetta.jpg";
import caesarSalad from "../assets/images/optimized/caesar-salad.jpg";
import grilledSalmon from "../assets/images/optimized/grilled-salmon.jpg";
import ribeyeSteak from "../assets/images/optimized/ribeye-steak.jpg";
import vegetableRisotto from "../assets/images/optimized/vegetable-risotto.jpg";
import tiramisu from "../assets/images/optimized/tiramisu.jpg";
import cheesecake from "../assets/images/optimized/cheesecake.jpg";
import wineGlasses from "../assets/images/optimized/wine-glasses.jpg";

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
        image: bruschetta,
        alt: "Toasted baguette slices topped with diced tomatoes and basil",
        width: 1920,
        height: 1280,
      },
      {
        name: "Caesar Salad",
        description: "Crisp romaine with homemade Caesar dressing",
        price: "$9.00",
        image: caesarSalad,
        alt: "Caesar salad with romaine, shaved parmesan, and croutons on a blue plate",
        width: 1881,
        height: 1920,
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
        image: grilledSalmon,
        alt: "Grilled salmon fillets over mixed greens, garnished with a crisp tuile",
        width: 1920,
        height: 1536,
      },
      {
        name: "Ribeye Steak",
        description: "12 oz prime cut with garlic mashed potatoes",
        price: "$28.00",
        image: ribeyeSteak,
        alt: "Seared ribeye steak with grilled vegetables and garlic mashed potatoes",
        width: 1920,
        height: 1280,
      },
      {
        name: "Vegetable Risotto",
        description: "Creamy Arborio rice with wild mushrooms",
        price: "$18.00",
        image: vegetableRisotto,
        alt: "Creamy risotto topped with sauteed wild mushrooms and shaved parmesan",
        width: 1920,
        height: 1076,
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
        image: tiramisu,
        alt: "Layered tiramisu dusted with cocoa and topped with fresh berries",
        width: 1920,
        height: 1536,
      },
      {
        name: "Cheesecake",
        description: "Creamy cheesecake with berry compote",
        price: "$7.00",
        image: cheesecake,
        alt: "Cheesecake topped with berry compote and fresh strawberries",
        width: 1920,
        height: 1536,
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
        image: wineGlasses,
        alt: "A glass of red wine beside a wooden cheese board",
        width: 1920,
        height: 1666,
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
