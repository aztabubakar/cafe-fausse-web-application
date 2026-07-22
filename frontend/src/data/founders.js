import chefAntonioRossi from "../assets/images/optimized/chef-antonio-rossi.jpg";
import mariaLopezRestaurateur from "../assets/images/optimized/maria-lopez-restaurateur.jpg";

// History text is exact per the SRS (section 3.1.4, FR-10). Founder
// biographies are original text written for this project and do not
// contradict that required history.
export const history =
  "Café Fausse was founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez. It blends traditional Italian flavors with modern culinary innovation. Its mission is to provide an unforgettable dining experience that reflects quality and creativity.";

export const founders = [
  {
    name: "Chef Antonio Rossi",
    role: "Co-Founder & Executive Chef",
    image: chefAntonioRossi,
    alt: "Portrait of Chef Antonio Rossi in a white chef's uniform and toque, arms crossed in the kitchen",
    width: 1280,
    height: 1920,
    bio: "Trained in kitchens across northern Italy before honing his craft in Rome and Milan, Antonio brings a classicist's discipline to every plate. He founded Café Fausse in 2010 to give Washington, DC a dining room where traditional Italian technique meets a modern, seasonal point of view. He still walks the line most service nights and personally tastes every dish before it leaves the kitchen.",
  },
  {
    name: "Maria Lopez",
    role: "Co-Founder & Restaurateur",
    image: mariaLopezRestaurateur,
    alt: "Portrait of restaurateur Maria Lopez standing behind a display case of plated appetizers",
    width: 1280,
    height: 1920,
    bio: "With a background in hospitality management and years spent running dining rooms up and down the East Coast, Maria shapes the guest experience at Café Fausse from the moment a reservation is made. She partners with regional growers and purveyors, trains the front-of-house team, and believes a great meal is as much about how guests are made to feel as what is on the plate.",
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
];
