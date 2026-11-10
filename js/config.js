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
      image: "images/kavach-dhoop.jpg",   // TODO: replace with a real dhoop photo, then delete comingSoon below
      comingSoon: true,
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
      image: "images/kavach-bundle.jpg",
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
  },

  /* ---- Contribute: drop-off point shown in the donation flow ---- */
  dropOff: "TODO: your school / drop-off address and timings",

  /* ---- Contribute: what you accept for donation ---- */
  donations: [
    { id: "tea",     icon: "🍵", name: "Used tea leaves",  unit: "kg",
      accept: ["Used tea leaves or tea dust from chai", "Tea bags with the paper/string removed"],
      prep: ["Rinse once to remove milk and sugar", "Spread on a plate and sun-dry for 1–2 days until crisp", "Store in a paper bag or box — not plastic"],
      no: ["Leaves mixed with food scraps", "Mouldy or wet leaves", "Plastic or nylon tea bags"] },
    { id: "flowers", icon: "🌼", name: "Temple flowers",   unit: "kg",
      accept: ["Marigolds, roses and other offering flowers", "Loose petals or full garlands"],
      prep: ["Remove thread, plastic, foil and pins", "Shake off sindoor, rice and sweets", "Keep loose in a cloth or paper bag; drop off within 2 days"],
      no: ["Flowers with plastic decorations", "Rotting or slimy flowers"] },
    { id: "neem",    icon: "🌿", name: "Neem prunings",    unit: "kg",
      accept: ["Neem leaves and thin twigs from pruning", "Fallen healthy neem leaves"],
      prep: ["Only prune — please don't cut healthy branches for us", "Tie twigs in a bundle", "Leaves can be fresh or dry"],
      no: ["Thick branches or trunk wood", "Leaves sprayed with pesticide"] }
  ],

  /* ---- Kavach Sustainability Heroes ----
     Add a row each time your team weighs and records a donation.
     displayName: exactly what the person agreed to show (full name, initials or nickname).
     TODO: replace the example rows with real records. */
  heroes: {
    month: "November 2026",
    // Example row:  { displayName: "Priya S.", kg: 4.5, type: "tea" }   (type: tea | flowers | neem)
    records: [
    ],
    badges: [
      { min: 10, label: "Kavach Champion", icon: "🏆" },
      { min: 5,  label: "Green Guardian",  icon: "🛡️" },
      { min: 1,  label: "Leaf Saver",      icon: "🌱" }
    ]
  }
};
