/* =========================================================
   CHAI KAVACH — EDIT THIS FILE TO UPDATE THE WEBSITE
   No coding needed: just change the text/numbers in quotes.
   ========================================================= */
window.CK = {

  /* ---- Contact details (shown in Contact section & used for orders) ---- */
  contact: {
    email: "chaikavach@example.com",      // TODO: your team email
    phone: "+91 00000 00000",             // TODO: phone shown on site
    whatsapp: "",                         // TODO: e.g. "919876543210" (country code, no +). Leave "" to hide.
    instagram: "chaikavach"               // TODO: Instagram handle without @
  },

  /* ---- Optional: free Formspree form (https://formspree.io) ----
     Paste your form endpoint here, e.g. "https://formspree.io/f/abcdwxyz"
     to receive orders & feedback in your inbox automatically.
     If left empty, orders/feedback open the visitor's email app instead. */
  formEndpoint: "",

  /* ---- Products ---- */
  products: [
    {
      id: "sticks",
      name: "Kavach Sticks",
      price: 25,
      pack: "Pack of 5 sticks",
      image: "images/kavach-sticks.jpg",
      tagline: "Fragrant incense that helps keep mosquitoes away.",
      details: "A neem twig coated with a dough of dried used-tea powder, marigold powder, neem powder and a natural binder.",
      materials: ["Used tea", "Marigold", "Neem", "Natural binder"]
    },
    {
      id: "dhoop",
      name: "Kavach Dhoop",
      price: 30,                         // TODO: confirm dhoop price
      pack: "Pack of 10 cones",          // TODO: confirm pack size
      image: "images/kavach-dhoop.svg",
      tagline: "Slow-burning cones for a calm, mosquito-free evening.",
      details: "Hand-shaped cones made from the same tea, marigold and neem powder as our sticks — no twig, so nothing goes to waste.",
      materials: ["Used tea", "Marigold", "Neem", "Natural binder"]
    },
    {
      id: "pouch",
      name: "Kavach Pouch",
      price: 30,
      pack: "1 jute pouch",
      image: "images/kavach-pouch.jpg",
      tagline: "Natural deodorising pouch for shoes, fridge and cupboards.",
      details: "A raw jute pouch filled with dried used tea leaves and a little neem leaf to absorb odours naturally.",
      materials: ["Used tea", "Neem leaf", "Jute"]
    },
    {
      id: "bundle",
      name: "Kavach Bundle",
      price: 50,
      pack: "Sticks + Pouch",
      image: "images/kavach-pouch.jpg",
      tagline: "Both protectors together — save ₹5.",
      details: "One pack of Kavach Sticks and one Kavach Pouch.",
      materials: ["Best value"]
    }
  ],

  /* ---- Impact tracker ----
     TODO: replace these with your real totals and update the date. */
  impact: {
    updated: "November 2026",
    stats: [
      { label: "Used tea leaves reused", value: 12,  unit: "kg", icon: "🍵" },
      { label: "Temple marigolds saved", value: 4,   unit: "kg", icon: "🌼" },
      { label: "Neem prunings reused",   value: 3,   unit: "kg", icon: "🌿" },
      { label: "Products made",          value: 150, unit: "",   icon: "📦" }
    ]
  }
};
