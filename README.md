# Chai Kavach website

*"Kal ki chai, aaj ka kavach."* A static website for Chai Kavach, which makes natural products from used tea leaves, temple marigolds and neem.

## Editing content
Most of the content you'll want to change is in **`js/config.js`**: contact details, product prices, the impact tracker numbers, and the optional Formspree endpoint that delivers orders and feedback to your inbox.

## Pages
- `index.html`: home, catalogue, how it's made, how to use, cart and order form, QR code, impact tracker, feedback, FAQ, contact
- `learn.html`: the page the packaging QR code opens. Add `?p=sticks`, `?p=dhoop` or `?p=pouch` to open a specific product's tab.

## Hosting on GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.

## Contribute section
- **Drop-off point**: set `dropOff` in `js/config.js`.
- **WhatsApp**: set `contact.whatsapp` (e.g. `919876543210`). The "Message us" and "Confirm on WhatsApp" buttons use it. Until it's set, they open email instead.
- **Sorting guide**: edit the `donations` list (what you accept, how to prepare it, what not to send).
- **Sustainability Heroes leaderboard**: after weighing a collection, add a row to `heroes.records`, e.g.
  `{ displayName: "Priya S.", kg: 4.5, type: "tea" }`. Use exactly the display name the donor chose in the form (initials, nickname or full name), and leave out anyone who chose "Don't show me". Totals, ranking and badges are calculated automatically. Update `heroes.month` each month.
- **Dhoop photo**: replace `images/kavach-dhoop.jpg` with a real photo and delete `comingSoon: true` from the dhoop product.
