class CartRemoveButton extends HTMLElement {
    constructor() {
      super(), this.addEventListener("click", (e => {
        e.preventDefault();
        (this.closest("cart-items") || this.closest("cart-drawer-items")).updateQuantity(this.dataset.index, 0)
      }))
    }
  }
  customElements.define("cart-remove-button", CartRemoveButton);
  class CartItems extends HTMLElement {
    constructor() {
      super(), this.lineItemStatusElement = document.getElementById("shopping-cart-line-item-status") || document.getElementById("CartDrawer-LineItemStatus");
      const e = debounce((e => {
        this.onChange(e)
      }), ON_CHANGE_DEBOUNCE_TIMER);
      this.addEventListener("change", e.bind(this))
    }
    cartUpdateUnsubscriber = void 0;
    connectedCallback() {
      this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (e => {
        "cart-items" !== e.source && this.onCartUpdate()
      }))
    }
    disconnectedCallback() {
      this.cartUpdateUnsubscriber && this.cartUpdateUnsubscriber()
    }
    onChange(e) {
      this.updateQuantity(e.target.dataset.index, e.target.value, document.activeElement.getAttribute("name"))
    }
    onCartUpdate() {
      fetch(`${routes.cart_url}?section_id=main-cart-items`).then((e => e.text())).then((e => {
        const t = (new DOMParser).parseFromString(e, "text/html").querySelector("cart-items");
        this.innerHTML = t.innerHTML
      })).catch((e => {
        console.error(e)
      }))
    }
    renderCartPage(t) {
      if ( t == '' || t.length == 0 ) return;
      const n = JSON.parse(t),
        i = document.querySelectorAll(".cart-item");
      if (n.errors) return a.value = a.getAttribute("value"), void this.updateLiveRegions(e, n.errors);
      this.classList.toggle("is-empty", 0 === n.item_count);
      const s = document.querySelector("cart-drawer"),
        o = document.getElementById("main-cart-footer");
      o && o.classList.toggle("is-empty", 0 === n.item_count), s && s.classList.toggle("is-empty", 0 === n.item_count), 
      this.getSectionsToRender().forEach((e => {
        (document.getElementById(e.id).querySelector(e.selector) || document.getElementById(e.id)).innerHTML = this.getSectionInnerHTML(n.sections[e.section], e.selector)
      }));
      const c = n.items[e - 1] ? n.items[e - 1].quantity : void 0;
      let d = "";
      i.length === n.items.length && c !== parseInt(a.value) && (d = void 0 === c ? window.cartStrings.error : window.cartStrings.quantityError.replace("[quantity]", c)), 
      this.updateLiveRegions(e, d);
      const l = document.getElementById(`CartItem-${e}`) || document.getElementById(`CartDrawer-Item-${e}`);
      l && l.querySelector(`[name="${r}"]`) ? s ? trapFocus(s, l.querySelector(`[name="${r}"]`)) : l.querySelector(`[name="${r}"]`).focus() : 0 === n.item_count && s ? trapFocus(s.querySelector(".drawer__inner-empty"), s.querySelector("a")) : document.querySelector(".cart-item") && s && trapFocus(s, document.querySelector(".cart-item__name")), publish(PUB_SUB_EVENTS.cartUpdate, {
        source: "cart-items"
      })
    }
    getSectionsToRender() {
      return [{
        id: "main-cart-items",
        section: document.getElementById("main-cart-items").dataset.id,
        selector: ".js-contents"
      }, {
        id: "cart-icon-bubble",
        section: "cart-icon-bubble",
        selector: ".shopify-section"
      }, {
        id: "cart-live-region-text",
        section: "cart-live-region-text",
        selector: ".shopify-section"
      }, {
        id: "main-cart-footer",
        section: document.getElementById("main-cart-footer").dataset.id,
        selector: ".js-contents-footer"
      }, {
        id: "main-cart-footer",
        section: document.getElementById("main-cart-footer").dataset.id,
        selector: ".desktop-cart-progress"
      }, {
        id: "mobile-progress",
        section: document.getElementById("mobile-progress").dataset.id,
        selector: ".mobile-progress"
      }]
    }
    updateQuantity(e, t, r) {
      this.enableLoading(e);
      const n = JSON.stringify({
        line: e,
        quantity: t,
        sections: this.getSectionsToRender().map((e => e.section)),
        sections_url: window.location.pathname
      });
      fetch(`${routes.cart_change_url}`, {
        ...fetchConfig(),
        body: n
      }).then((e => e.text())).then((t => {
        const n = JSON.parse(t),
          a = document.getElementById(`Quantity-${e}`) || document.getElementById(`Drawer-quantity-${e}`),
          i = document.querySelectorAll(".cart-item");
        if (n.errors) return a.value = a.getAttribute("value"), void this.updateLiveRegions(e, n.errors);
        this.classList.toggle("is-empty", 0 === n.item_count);
        const s = document.querySelector("cart-drawer"),
          o = document.getElementById("main-cart-footer");
        o && o.classList.toggle("is-empty", 0 === n.item_count), s && s.classList.toggle("is-empty", 0 === n.item_count), 
        this.getSectionsToRender().forEach((e => {
          (document.getElementById(e.id).querySelector(e.selector) || document.getElementById(e.id)).innerHTML = this.getSectionInnerHTML(n.sections[e.section], e.selector)
        }));
        const c = n.items[e - 1] ? n.items[e - 1].quantity : void 0;
        let d = "";
        i.length === n.items.length && c !== parseInt(a.value) && (d = void 0 === c ? window.cartStrings.error : window.cartStrings.quantityError.replace("[quantity]", c)), 
        this.updateLiveRegions(e, d);
        const l = document.getElementById(`CartItem-${e}`) || document.getElementById(`CartDrawer-Item-${e}`);
        l && l.querySelector(`[name="${r}"]`) ? s ? trapFocus(s, l.querySelector(`[name="${r}"]`)) : l.querySelector(`[name="${r}"]`).focus() : 0 === n.item_count && s ? trapFocus(s.querySelector(".drawer__inner-empty"), s.querySelector("a")) : document.querySelector(".cart-item") && s && trapFocus(s, document.querySelector(".cart-item__name")), publish(PUB_SUB_EVENTS.cartUpdate, {
          source: "cart-items"
        })
      })).catch((() => {
        this.querySelectorAll(".loading-overlay").forEach((e => e.classList.add("hidden")));
        (document.getElementById("cart-errors") || document.getElementById("CartDrawer-CartErrors")).textContent = window.cartStrings.error
      })).finally((() => {
        this.disableLoading(e)
      }))
    }
    updateLiveRegions(e, t) {
      const r = document.getElementById(`Line-item-error-${e}`) || document.getElementById(`CartDrawer-LineItemError-${e}`);
      r && (r.querySelector(".cart-item__error-text").innerHTML = t), this.lineItemStatusElement.setAttribute("aria-hidden", !0);
      const n = document.getElementById("cart-live-region-text") || document.getElementById("CartDrawer-LiveRegionText");
      n.setAttribute("aria-hidden", !1), setTimeout((() => {
        n.setAttribute("aria-hidden", !0)
      }), 1e3)
    }
    getSectionInnerHTML(e, t) {
      let temp = (new DOMParser).parseFromString(e, "text/html").querySelector(t);
      return (temp != null ? temp.innerHTML : '');
    }
    enableLoading(e) {
      (document.getElementById("main-cart-items") || document.getElementById("CartDrawer-CartItems")).classList.add("cart__items--disabled");
      [...this.querySelectorAll(`#CartItem-${e} .loading-overlay`), ...this.querySelectorAll(`#CartDrawer-Item-${e} .loading-overlay`)].forEach((e => e.classList.remove("hidden"))), document.activeElement.blur(), this.lineItemStatusElement.setAttribute("aria-hidden", !1)
    }
    disableLoading(e) {
      (document.getElementById("main-cart-items") || document.getElementById("CartDrawer-CartItems")).classList.remove("cart__items--disabled");
      const t = this.querySelectorAll(`#CartItem-${e} .loading-overlay`),
        r = this.querySelectorAll(`#CartDrawer-Item-${e} .loading-overlay`);
      t.forEach((e => e.classList.add("hidden"))), r.forEach((e => e.classList.add("hidden")))
    }
  }
  customElements.define("cart-items", CartItems), customElements.get("cart-note") || customElements.define("cart-note", class extends HTMLElement {
    constructor() {
      super(), this.addEventListener("change", debounce((e => {
        const t = JSON.stringify({
          note: e.target.value
        });
        fetch(`${routes.cart_update_url}`, {
          ...fetchConfig(),
          body: t
        })
      }), ON_CHANGE_DEBOUNCE_TIMER))
    }
  });