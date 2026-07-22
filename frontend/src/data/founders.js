import { IMAGES } from "./images.js";

// History text is exact per the SRS (section 3.1.4, FR-10). Founder
// biographies are original fictional text written for this project; they
// do not contradict that required history and do not claim any real
// awards, employers, schools, or credentials.
export const history =
  "Founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez, Café Fausse blends traditional Italian flavors with modern culinary innovation. Our mission is to provide an unforgettable dining experience that reflects both quality and creativity.";

export const founders = [
  {
    name: "Chef Antonio Rossi",
    role: "Co-Founder & Executive Chef",
    image: IMAGES.chefAntonioRossi,
    bio: "Antonio grew up cooking alongside his grandmother in a small kitchen in northern Italy, where he first learned that great food starts with respect for simple, honest ingredients. That grounding in traditional Italian technique has stayed with him through every stage of his career, even as his style has evolved to embrace a more modern, seasonal point of view. As Café Fausse's executive chef, he leads the kitchen with the same discipline he learned as a young cook: every dish is tasted, every plate is checked, and every guest is treated like family.",
  },
  {
    name: "Maria Lopez",
    role: "Co-Founder & Restaurateur",
    image: IMAGES.mariaLopezRestaurateur,
    bio: "Maria has spent her career in dining rooms, learning that a truly memorable meal is built as much on warmth and attentiveness as it is on what arrives at the table. Her background in restaurant hospitality shaped a deep commitment to service that guides everything at Café Fausse, from the tone of a first greeting to the pace of a long, celebratory dinner. Maria shaped the restaurant's atmosphere from the ground up and continues to focus the entire front-of-house team on one goal: making every visit feel memorable.",
  },
];

export const commitments = [
  {
    title: "Unforgettable Dining",
    description:
      "Every visit is treated as an occasion, from a considered dining room to attentive, unhurried service.",
  },
  {
    title: "Excellent Food",
    description:
      "Classic Italian technique and exacting kitchen standards guide a menu built for consistency and craft.",
  },
  {
    title: "Locally Sourced Ingredients",
    description:
      "Long-standing partnerships with regional farms and purveyors keep the menu seasonal and the ingredients honest.",
  },
  {
    title: "Creativity",
    description:
      "Traditional Italian recipes are reinterpreted with modern technique and a seasonally changing point of view.",
  },
  {
    title: "Warm Hospitality",
    description:
      "A welcoming, unhurried dining room where every guest is made to feel like a returning friend.",
  },
];
