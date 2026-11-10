(function () {
  const CK = window.CK;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const rupee = n => "₹" + n.toLocaleString("en-IN");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- Nav ---------- */
  const navBar = $("#navBar"), toggle = $(".nav-toggle"), nav = $("#nav");
  if (navBar) {
    const onScroll = () => navBar.classList.toggle("scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    nav.addEventListener("click", e => { if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", false); } });
  }
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Hero parallax (scroll-linked, like Apple product pages) ---------- */
  const stage = $("#heroStage");
  if (stage && !reduceMotion) {
    let ticking = false;
    const update = () => {
      const r = stage.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, 1 - r.top / innerHeight));
      stage.style.setProperty("--p", p.toFixed(3));
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Products ---------- */
  const grid = $("#productGrid");
  if (grid) {
    grid.innerHTML = CK.products.map((p, i) => `
      <article class="tile reveal" style="--d:${(i % 2) * 0.1}s">
        <div class="tile-media"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy"></div>
        <div class="tile-body">
          ${p.badge ? `<span class="tile-badge">${esc(p.badge)}</span>` : ""}
          <h3>${esc(p.name)}</h3>
          <p class="pack">${esc(p.pack)}</p>
          <p class="tagline">${esc(p.tagline)}</p>
          <details><summary>What's inside</summary><p>${esc(p.details)}</p></details>
          <ul class="chips">${p.materials.map(m => `<li>${esc(m)}</li>`).join("")}</ul>
          <div class="buy"><span class="price">${rupee(p.price)}</span>
            <button class="btn btn-sm" data-add="${p.id}">Add to Bag</button></div>
        </div>
      </article>`).join("");
    grid.addEventListener("click", e => {
      const btn = e.target.closest("[data-add]"); if (!btn) return;
      const id = btn.dataset.add;
      cart[id] = (cart[id] || 0) + 1; saveCart();
      const bag = $("#bagBtn"); bag.classList.remove("bump"); void bag.offsetWidth; bag.classList.add("bump");
      toast(`${byId(id).name} added to Bag`);
    });
  }

  /* ---------- Cart ---------- */
  let cart = store.get("ck-cart", {});
  const byId = id => CK.products.find(p => p.id === id);
  const cartLines = () => Object.entries(cart).filter(([id, q]) => q > 0 && byId(id)).map(([id, q]) => ({ p: byId(id), q }));
  const cartTotal = () => cartLines().reduce((s, l) => s + l.p.price * l.q, 0);
  function saveCart() { store.set("ck-cart", cart); renderCart(); }
  function renderCart() {
    const lines = cartLines();
    const count = lines.reduce((s, l) => s + l.q, 0);
    const cc = $("#cartCount");
    if (cc) { cc.textContent = count; cc.classList.toggle("has", count > 0); }
    const box = $("#cartItems"); if (!box) return;
    box.innerHTML = lines.length ? lines.map(({ p, q }) => `
      <div class="cart-line">
        <img src="${p.image}" alt="">
        <span class="name">${esc(p.name)}<span class="unit">${rupee(p.price)} each</span></span>
        <span class="stepper"><button aria-label="Remove one ${esc(p.name)}" data-dec="${p.id}">−</button><span>${q}</span><button aria-label="Add one ${esc(p.name)}" data-inc="${p.id}">+</button></span>
        <strong>${rupee(p.price * q)}</strong>
      </div>`).join("")
      : `<div class="cart-empty"><span class="bag-big" aria-hidden="true">🛍️</span>Your bag is empty.<br><a href="#products" class="link-arrow">Browse products</a></div>`;
    $("#cartTotal").textContent = rupee(cartTotal());
  }
  const cartBox = $("#cartItems");
  if (cartBox) cartBox.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.inc) cart[b.dataset.inc]++;
    else if (b.dataset.dec) cart[b.dataset.dec] = Math.max(0, cart[b.dataset.dec] - 1);
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
      note.textContent = how === "sent" ? "Thank you! We'll be in touch soon." : "Your email app should open with everything filled in — just press send.";
      if (how === "sent") { cart = {}; saveCart(); orderForm.reset(); toast("Order sent ✓"); }
    } catch { note.textContent = "That didn't go through. Please contact us directly below."; }
    if (CK.contact.whatsapp) {
      note.innerHTML += ` Or <a href="https://wa.me/${CK.contact.whatsapp}?text=${encodeURIComponent(body)}" target="_blank" rel="noopener">send on WhatsApp</a>.`;
    }
  });

  /* ---------- Segmented control ---------- */
  $$(".segmented").forEach(seg => {
    const btns = $$("[data-tab]", seg), thumb = $(".seg-thumb", seg);
    const select = b => {
      const i = btns.indexOf(b);
      btns.forEach(x => {
        const on = x === b; x.setAttribute("aria-selected", on);
        document.getElementById(x.dataset.tab).hidden = !on;
      });
      if (thumb) thumb.style.transform = `translateX(${i * 100}%)`;
    };
    seg.addEventListener("click", e => { const b = e.target.closest("[data-tab]"); if (b) select(b); });
    seg.select = id => { const b = btns.find(x => x.dataset.tab === id); if (b) select(b); };
  });
  const p = new URLSearchParams(location.search).get("p");
  if (p) $$(".segmented").forEach(s => s.select("l-" + p));

  /* ---------- QR ---------- */
  const qrEl = $("#qrCode");
  if (qrEl && window.QRCode) {
    const url = new URL("learn.html", location.href).href.split("#")[0];
    new QRCode(qrEl, { text: url, width: 360, height: 360, colorDark: "#1d1d1f", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
    $("#qrUrl").textContent = url;
    $("#qrDownload").addEventListener("click", () => {
      const S = 1000, pad = 80, c = document.createElement("canvas");
      c.width = S; c.height = S + 120;
      const g = c.getContext("2d");
      g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
      const big = document.createElement("div");
      new QRCode(big, { text: url, width: S - pad * 2, height: S - pad * 2, colorDark: "#1d1d1f", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
      g.drawImage(big.querySelector("canvas"), pad, pad);
      g.fillStyle = "#1d1d1f"; g.font = "600 52px -apple-system, Helvetica, Arial, sans-serif"; g.textAlign = "center";
      g.fillText("Scan to learn · Chai Kavach", S / 2, S + 50);
      const a = document.createElement("a");
      a.download = "chai-kavach-qr.png"; a.href = c.toDataURL("image/png"); a.click();
      toast("QR code downloaded");
    });
  }

  /* ---------- Impact (bento + count-up) ---------- */
  const statsEl = $("#impactStats");
  if (statsEl) {
    statsEl.innerHTML = CK.impact.stats.map((s, i) => `
      <div class="stat reveal" style="--d:${i * 0.08}s"><div class="stat-icon" aria-hidden="true">${s.icon}</div>
        <div><div class="stat-num"><span data-count="${s.value}">0</span>${s.unit ? `<small> ${esc(s.unit)}</small>` : ""}</div>
        <div class="stat-label">${esc(s.label)}</div></div></div>`).join("");
    $("#impactUpdated").textContent = "Last updated " + CK.impact.updated + ".";
    const animate = () => $$("[data-count]", statsEl).forEach(el => {
      const target = +el.dataset.count;
      if (reduceMotion) { el.textContent = target.toLocaleString("en-IN"); return; }
      const t0 = performance.now(), dur = 1800;
      const step = t => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(target * (1 - Math.pow(1 - k, 4))).toLocaleString("en-IN"); if (k < 1) requestAnimationFrame(step); };
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
      <blockquote class="review">
        <div class="stars" aria-label="${r.rating} out of 5 stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
        <p>${esc(r.text)}</p>
        <footer>${esc(r.name)} · ${esc(r.product)}</footer>
      </blockquote>`).join("")
      : `<div class="reviews-empty"><span style="font-size:36px" aria-hidden="true">💬</span><strong>No reviews yet.</strong>Tried a Chai Kavach product? Be the first to share your experience and ideas.</div>`;
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
      note.textContent = how === "sent" ? "Thank you for your feedback." : "Thanks! Your email app will open so the team receives it too.";
      fbForm.reset(); toast("Thanks for your feedback 🌿");
    } catch { note.textContent = "Saved here, but couldn't reach the team. Please email us too."; }
  });

  /* ---------- Contact ---------- */
  const setLink = (id, href, text) => { const a = $(id); if (!a) return; if (!text) { a.hidden = true; return; } a.href = href; a.querySelector("span:last-child").textContent = text; };
  const c = CK.contact;
  setLink("#contactEmail", "mailto:" + c.email, c.email);
  setLink("#contactPhone", c.whatsapp ? "https://wa.me/" + c.whatsapp : "tel:" + c.phone.replace(/\s/g, ""), c.phone);
  setLink("#contactInsta", "https://instagram.com/" + c.instagram, c.instagram && "@" + c.instagram);

  /* ---------- Scroll reveal (staggered) ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const ro = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
    }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => ro.observe(el));
  } else revealEls.forEach(el => el.classList.add("in"));
})();
