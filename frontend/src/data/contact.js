// Exact per the SRS (section 3.1.1, FR-2). Referenced by Header, Footer,
// and the Home page so the address, phone, and hours are never retyped.
export const contact = {
  name: "Café Fausse",
  address: "1234 Culinary Ave, Suite 100, Washington, DC 20002",
  phone: "(202) 555-4567",
  phoneHref: "tel:+12025554567",
  hours: [
    { days: "Monday–Saturday", time: "5:00 PM–11:00 PM" },
    { days: "Sunday", time: "5:00 PM–9:00 PM" },
  ],
};
