(function () {
  const CK = window.CK;
  const $ = (s, el = document) => el.querySelector(s);
  const rupee = n => "₹" + n;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Nav ---------- */
  const toggle = $(".nav-toggle"), nav = $("#nav");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    nav.addEventListener("click", e => { if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", false); } });
  }
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Products ---------- */
  const grid = $("#productGrid");
  if (grid) {
    grid.innerHTML = CK.products.map(p => `
      <article class="card product">
        <img src="${p.image}" alt="${esc(p.name)}" loading="lazy">
        <div class="product-body">
          <h3>${esc(p.name)}</h3>
          <p class="pack">${esc(p.pack)}</p>
          <p>${esc(p.tagline)}</p>
          <details><summary>Details</summary><p>${esc(p.details)}</p></details>
          <ul class="chips">${p.materials.map(m => `<li>${esc(m)}</li>`).join("")}</ul>
          <div class="buy"><span class="price">${rupee(p.price)}</span>
            <button class="btn btn-sm" data-add="${p.id}">Add to cart</button></div>
        </div>
      </article>`).join("");
    grid.addEventListener("click", e => {
      const id = e.target.dataset.add; if (!id) return;
      cart[id] = (cart[id] || 0) + 1; saveCart();
      e.target.textContent = "Added ✓";
      setTimeout(() => (e.target.textContent = "Add to cart"), 1200);
    });
  }

  /* ---------- Cart ---------- */
  let cart = store.get("ck-cart", {});
  const byId = id => CK.products.find(p => p.id === id);
  function cartLines() {
    return Object.entries(cart).filter(([id, q]) => q > 0 && byId(id)).map(([id, q]) => ({ p: byId(id), q }));
  }
  function cartTotal() { return cartLines().reduce((s, l) => s + l.p.price * l.q, 0); }
  function saveCart() { store.set("ck-cart", cart); renderCart(); }
  function renderCart() {
    const lines = cartLines();
    const count = lines.reduce((s, l) => s + l.q, 0);
    const cc = $("#cartCount"); if (cc) cc.textContent = count;
    const box = $("#cartItems"); if (!box) return;
    box.innerHTML = lines.length ? lines.map(({ p, q }) => `
      <div class="cart-line">
        <span>${esc(p.name)}</span>
        <span class="qty"><button aria-label="Remove one" data-dec="${p.id}">−</button>${q}<button aria-label="Add one" data-inc="${p.id}">+</button></span>
        <strong>${rupee(p.price * q)}</strong>
      </div>`).join("") : `<p class="muted">Your cart is empty. Add products from the catalogue above.</p>`;
    $("#cartTotal").textContent = rupee(cartTotal());
  }
  const cartBox = $("#cartItems");
  if (cartBox) cartBox.addEventListener("click", e => {
    const inc = e.target.dataset.inc, dec = e.target.dataset.dec;
    if (inc) cart[inc]++; else if (dec) cart[dec] = Math.max(0, cart[dec] - 1); else return;
    saveCart();
  });
  renderCart();

  /* ---------- Sending (Formspree or email fallback) ---------- */
  async function send(subject, body, data) {
    if (CK.formEndpoint) {
      const r = await fetch(CK.formEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _subject: subject, ...data, summary: body })
      });
      if (!r.ok) throw new Error("send failed");
      return "sent";
    }
    location.href = `mailto:${CK.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return "mail";
  }

  const orderForm = $("#orderForm");
  if (orderForm) orderForm.addEventListener("submit", async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(orderForm));
    const lines = cartLines();
    const items = lines.length ? lines.map(l => `${l.p.name} x${l.q} = ${rupee(l.p.price * l.q)}`).join("\n") + `\nTotal: ${rupee(cartTotal())}` : "(no items — enquiry only)";
    const body = `Name: ${f.name}\nContact: ${f.contact}\nAddress: ${f.address}\n\nOrder:\n${items}\n\nMessage: ${f.message}`;
    const note = $("#orderNote");
    try {
      const how = await send(lines.length ? "New Chai Kavach order" : "Chai Kavach enquiry", body, f);
      note.textContent = how === "sent" ? "Thank you! We've received your order and will contact you soon." : "Your email app should open with the order filled in — just press send.";
      if (how === "sent") { cart = {}; saveCart(); orderForm.reset(); }
    } catch { note.textContent = "Sorry, that didn't go through. Please contact us directly below."; }
    if (CK.contact.whatsapp) {
      note.innerHTML += ` Or <a href="https://wa.me/${CK.contact.whatsapp}?text=${encodeURIComponent(body)}" target="_blank" rel="noopener">send it on WhatsApp</a>.`;
    }
  });

  /* ---------- Use tabs ---------- */
  document.querySelectorAll(".tabs").forEach(tabs => {
    tabs.addEventListener("click", e => {
      const b = e.target.closest("[data-tab]"); if (!b) return;
      tabs.querySelectorAll("[data-tab]").forEach(x => {
        const on = x === b; x.setAttribute("aria-selected", on);
        document.getElementById(x.dataset.tab).hidden = !on;
      });
    });
  });

  /* ---------- QR ---------- */
  const qrEl = $("#qrCode");
  if (qrEl && window.QRCode) {
    const url = new URL("learn.html", location.href).href.split("#")[0];
    new QRCode(qrEl, { text: url, width: 200, height: 200, colorDark: "#2f5d2a", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
    $("#qrUrl").textContent = url;
    $("#qrDownload").addEventListener("click", () => {
      const src = qrEl.querySelector("canvas");
      // Big, print-ready version with a white border and label
      const c = document.createElement("canvas"), S = 1000, pad = 80;
      c.width = S; c.height = S + 120;
      const g = c.getContext("2d");
      g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
      const big = document.createElement("div");
      new QRCode(big, { text: url, width: S - pad * 2, height: S - pad * 2, colorDark: "#2f5d2a", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
      g.drawImage(big.querySelector("canvas") || src, pad, pad);
      g.fillStyle = "#2f5d2a"; g.font = "bold 56px sans-serif"; g.textAlign = "center";
      g.fillText("Scan to learn · Chai Kavach", S / 2, S + 50);
      const a = document.createElement("a");
      a.download = "chai-kavach-qr.png"; a.href = c.toDataURL("image/png"); a.click();
    });
  }

  /* ---------- Impact counters ---------- */
  const statsEl = $("#impactStats");
  if (statsEl) {
    statsEl.innerHTML = CK.impact.stats.map((s, i) => `
      <div class="stat card"><div class="stat-icon" aria-hidden="true">${s.icon}</div>
        <div class="stat-num"><span data-count="${s.value}" id="st${i}">0</span>${s.unit ? ` <small>${esc(s.unit)}</small>` : ""}</div>
        <div class="stat-label">${esc(s.label)}</div></div>`).join("");
    $("#impactUpdated").textContent = "Last updated: " + CK.impact.updated;
    const animate = () => statsEl.querySelectorAll("[data-count]").forEach(el => {
      const target = +el.dataset.count, t0 = performance.now(), dur = 1400;
      const step = t => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString("en-IN"); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { animate(); io.disconnect(); } }, { threshold: .3 });
      io.observe(statsEl);
    } else animate();
  }

  /* ---------- Feedback ---------- */
  const reviewsEl = $("#reviews");
  let reviews = store.get("ck-reviews", []);
  function renderReviews() {
    if (!reviewsEl) return;
    reviewsEl.innerHTML = reviews.length ? reviews.slice().reverse().map(r => `
      <blockquote class="review card">
        <div class="stars" aria-label="${r.rating} out of 5 stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
        <p>${esc(r.text)}</p>
        <footer>— ${esc(r.name)}, <em>${esc(r.product)}</em></footer>
      </blockquote>`).join("")
      : `<p class="muted">No reviews yet — tried a Chai Kavach product? Be the first to share your experience and suggestions.</p>`;
  }
  renderReviews();
  const fbForm = $("#feedbackForm");
  if (fbForm) fbForm.addEventListener("submit", async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(fbForm));
    const r = { name: f.name, product: f.product, rating: +f.rating, text: f.text };
    reviews.push(r); store.set("ck-reviews", reviews); renderReviews();
    const note = $("#feedbackNote");
    try {
      const how = await send("Chai Kavach feedback", `${r.name} (${r.product}) rated ${r.rating}/5:\n\n${r.text}`, r);
      note.textContent = how === "sent" ? "Thank you for your feedback! 🌿" : "Thanks! Your email app will open so the team receives it too.";
      fbForm.reset();
    } catch { note.textContent = "Saved here, but couldn't reach the team. Please email us too."; }
  });

  /* ---------- Contact ---------- */
  const setLink = (id, href, text) => { const a = $(id); if (!a) return; if (!text) { a.hidden = true; return; } a.href = href; a.querySelector("span").textContent = text; };
  const c = CK.contact;
  setLink("#contactEmail", "mailto:" + c.email, c.email);
  setLink("#contactPhone", c.whatsapp ? "https://wa.me/" + c.whatsapp : "tel:" + c.phone.replace(/\s/g, ""), c.phone);
  setLink("#contactInsta", "https://instagram.com/" + c.instagram, c.instagram && "@" + c.instagram);
})();
