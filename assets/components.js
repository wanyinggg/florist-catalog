// Shared nav, footer, and cart logic for Lazy Cloudd

const LC = (() => {
  const WA_ICON = `<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
  const ARROW_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>`;
  const CART_ICON = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;
  const CLOSE_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
  const PLUS_ICON = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>`;

  // ── Nav ────────────────────────────────────────────────────────────────
  function renderNav(type) {
    const el = document.getElementById("site-nav");
    if (!el) return;
    if (type === "item") {
      el.innerHTML = `
        <button class="nav-back" onclick="history.back()">${ARROW_ICON} Back</button>
        <a href="catalog.html"><img class="nav-logo" src="logo.png" alt="Lazy Cloudd" /></a>`;
    } else if (type === "collection") {
      el.innerHTML = `
        <a href="catalog.html" class="nav-back">${ARROW_ICON} Collections</a>
        <a href="catalog.html"><img class="nav-logo" src="logo.png" alt="Lazy Cloudd" /></a>`;
    } else {
      el.innerHTML = `
        <a href="catalog.html"><img class="nav-logo" src="logo.png" alt="Lazy Cloudd" /></a>
        `;
    }
  }

  // ── Footer ─────────────────────────────────────────────────────────────
  function renderFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML = `
      <img src="logo.png" alt="Lazy Cloudd" /><br />
      © ${new Date().getFullYear()} Lazy Cloudd`;
  }

  // ── Cart ───────────────────────────────────────────────────────────────
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("lc_cart") || "[]");
  } catch {}

  function saveCart() {
    localStorage.setItem("lc_cart", JSON.stringify(cart));
  }

  function addToCart(id) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    const existing = cart.find((c) => c.product.id === id);
    if (existing) existing.qty++;
    else cart.push({ product, qty: 1 });
    saveCart();
    updateCartFab();
    renderDrawer();
    showToast(`${product.emoji || ""} Added!`);
  }

  function updateCartFab() {
    const count = cart.reduce((s, c) => s + c.qty, 0);
    const badge = document.getElementById("cartBadge");
    badge.textContent = count;
    badge.style.display = count === 0 ? "none" : "";
    document.getElementById("cartFabText").textContent =
      count === 0 ? "Cart is empty" : `View cart `;
    document.getElementById("cartTotal").textContent = `RM ${cart.reduce(
      (s, c) => s + c.product.price * c.qty,
      0
    )}`;
  }

  let _emptyMsg = "No items yet!";

  function renderDrawer() {
    const body = document.getElementById("drawerBody");
    if (cart.length === 0) {
      body.innerHTML = `<div class="drawer-empty"><div class="drawer-empty-icon">🌸</div><span>${_emptyMsg}</span></div>`;
      return;
    }
    body.innerHTML = "";
    cart.forEach(({ product, qty, note }) => {
      const item = document.createElement("div");
      item.className = "cart-item";
      const imgSrc = product.img
        ? Array.isArray(product.img)
          ? product.img[0]
          : product.img
        : null;
      const thumb = imgSrc
        ? `<img class="cart-item-thumb" src="${IMG_BASE}${imgSrc}" alt="${product.name}" />`
        : `<span class="cart-item-emoji">${product.emoji || "🌸"}</span>`;
      item.innerHTML = `
        ${thumb}
        <div class="cart-item-info">
          <p class="cart-item-name">${product.name}</p>
          <p class="cart-item-price">RM ${product.price}</p>
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="dec" data-id="${
              product.id
            }">−</button>
            <span class="qty-val">${qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${
              product.id
            }">+</button>
          </div>
          <textarea class="cart-item-note-input" data-id="${
            product.id
          }" rows="2" placeholder="Special requests">${note || ""}</textarea>
        </div>
        <button class="cart-item-remove" data-id="${product.id}">✕</button>`;
      body.appendChild(item);
    });
    body.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = +btn.dataset.id,
          item = cart.find((c) => c.product.id === id);
        if (!item) return;
        if (btn.dataset.action === "inc") item.qty++;
        else {
          item.qty--;
          if (item.qty <= 0) cart = cart.filter((c) => c.product.id !== id);
        }
        saveCart();
        updateCartFab();
        renderDrawer();
      });
    });
    body.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        cart = cart.filter((c) => c.product.id !== +btn.dataset.id);
        saveCart();
        updateCartFab();
        renderDrawer();
      });
    });
    body.querySelectorAll(".cart-item-note-input").forEach((ta) => {
      ta.addEventListener("input", () => {
        const item = cart.find((c) => c.product.id === +ta.dataset.id);
        if (item) {
          item.note = ta.value;
          saveCart();
        }
      });
    });
  }

  function openDrawer() {
    if (cart.length === 0) {
      showToast("Add some items first ");
      return;
    }
    renderDrawer();
    document.getElementById("drawerOverlay").classList.add("open");
    document.getElementById("drawer").classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    document.getElementById("drawerOverlay").classList.remove("open");
    document.getElementById("drawer").classList.remove("open");
    document.body.style.overflow = "";
  }

  function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2000);
  }

  function sanitize(str) {
    return str
      .replace(/\p{Extended_Pictographic}/gu, "")
      .replace(/[️‍]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function buildWaMsg(items, total) {
    let m = "Hi! I'd like to enquire about:\n\n";
    items.forEach(({ product, qty, note }) => {
      m += `• *${sanitize(product.name)}* x${qty} (RM ${product.price * qty})`;
      if (note && note.trim()) m += `\n  > ${note.trim()}`;
      m += "\n";
    });
    m += `\n*Estimated total:* RM ${total} (excl. shipping)`;
    m +=
      "\n\nCould you confirm availability, final price and shipping? Thank you!";
    return m;
  }

  const CART_SVG = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;
  const WA_PATH = `M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z`;

  function injectCartHTML() {
    const tpl = document.createElement("template");
    tpl.innerHTML = `
<div class="cart-fab"><button class="cart-btn" id="cartFabBtn">${CART_SVG}<span id="cartFabText">—</span><span class="cart-badge" id="cartBadge">0</span></button></div>
<div class="drawer-overlay" id="drawerOverlay"></div>
<div class="drawer" id="drawer" role="dialog">
  <div class="drawer-head">
    <span class="drawer-title">My Cart</span>
    <button class="drawer-close" id="drawerClose"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
  </div>
  <div class="drawer-body" id="drawerBody"></div>
  <div class="drawer-foot">
    <div class="cart-summary"><span>Estimated total</span><strong id="cartTotal">RM 0</strong></div>
    <p class="cart-note-sm">*Not included shipping fee yet. Shipping fee will be confirmed on WhatsApp.</p>
    <button class="wa-checkout-btn" id="waCheckoutBtn"><svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="${WA_PATH}"/></svg>Proceed to Order</button>
  </div>
</div>
<div class="toast" id="toast"></div>`;
    document.body.appendChild(tpl.content);
  }

  // Call this once per page to wire up the cart FAB + drawer
  function initCart(opts = {}) {
    if (opts.emptyMsg) _emptyMsg = opts.emptyMsg;
    injectCartHTML();
    document.getElementById("cartFabBtn").addEventListener("click", openDrawer);
    document
      .getElementById("drawerClose")
      .addEventListener("click", closeDrawer);
    document
      .getElementById("drawerOverlay")
      .addEventListener("click", closeDrawer);
    document.getElementById("waCheckoutBtn").addEventListener("click", () => {
      if (cart.length === 0) return;
      const total = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
      window.open(
        `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
          buildWaMsg(cart, total)
        )}`,
        "_blank"
      );
    });
    updateCartFab();
  }

  function initCarousels() {
    document.querySelectorAll(".img-track").forEach((track, idx) => {
      const slides = track.querySelectorAll(".img-slide");
      if (slides.length <= 1) return;
      let i = 0;
      setTimeout(() => {
        setInterval(() => {
          i = (i + 1) % slides.length;
          track.style.transform = `translateX(-${i * 100}%)`;
        }, 3500);
      }, idx * 500);
    });
  }

  return {
    renderNav,
    renderFooter,
    addToCart,
    updateCartFab,
    renderDrawer,
    showToast,
    initCart,
    initCarousels,
    get cart() {
      return cart;
    },
  };
})();
