class CartDrawer extends HTMLElement {
  constructor() {
    super(), 
    this.addEventListener("keyup", (e => "Escape" === e.code && this.close())), 
    this.querySelector("#CartDrawer-Overlay").addEventListener("click", this.close.bind(this)),
    this.setHeaderCartIconAccessibility(),
    this.routineSlider();
  }
  setHeaderCartIconAccessibility() {
    const e = document.querySelector("#cart-icon-bubble");
    e.setAttribute("role", "button"), e.setAttribute("aria-haspopup", "dialog"), 
    e.addEventListener("click", (t => {
      t.preventDefault(), 
      null == document.querySelector("body.smart-cart--enabled") && this.open(e)
    })), e.addEventListener("keydown", (t => {
      "SPACE" === t.code.toUpperCase() && (t.preventDefault(), null == document.querySelector("body.smart-cart--enabled") && this.open(e))
    }))
  }
  open(e) {
    if (document.querySelector("body.smart-cart--enabled")) return;
    e && this.setActiveElement(e);
    const t = this.querySelector('[id^="Details-"] summary');
    t && !t.hasAttribute("role") && this.setSummaryAccessibility(t), setTimeout((() => {
      this.classList.add("animate", "active")
    })), this.addEventListener("transitionend", (() => {
      const e = this.classList.contains("is-empty") ? this.querySelector(".drawer__inner-empty") : document.getElementById("CartDrawer"),
        t = this.querySelector(".drawer__inner") || this.querySelector(".drawer__close");
      trapFocus(e, t)
    }), {
      once: !0
    }), document.body.classList.add("overflow-hidden"), document.body.classList.add("cart-drawer-show")
  }
  close() {
    this.classList.remove("active"), removeTrapFocus(this.activeElement), document.body.classList.remove("overflow-hidden"), document.body.classList.remove("cart-drawer-show")
  }
  setSummaryAccessibility(e) {
    e.setAttribute("role", "button"), e.setAttribute("aria-expanded", "false"), e.nextElementSibling.getAttribute("id") && e.setAttribute("aria-controls", e.nextElementSibling.id), e.addEventListener("click", (e => {
      e.currentTarget.setAttribute("aria-expanded", !e.currentTarget.closest("details").hasAttribute("open"))
    })), e.parentElement.addEventListener("keyup", onKeyUpEscape)
  }
  renderContents(e) {
    let current_this = this;
    this.querySelector(".drawer__inner").classList.contains("is-empty") && this.querySelector(".drawer__inner").classList.remove("is-empty"),
    this.productId = e.id,
    this.getSectionsToRender().forEach((t => {
      (t.selector ? document.querySelector(t.selector) : document.getElementById(t.id)).innerHTML = this.getSectionInnerHTML(e.sections[t.id], t.selector)
    })), setTimeout((() => {
      current_this.querySelector("#CartDrawer-Overlay") ? current_this.querySelector("#CartDrawer-Overlay").addEventListener("click", current_this.close.bind(this)): '', 
      current_this.open()
    }));
    /*if( document.querySelector('cart-drawer product-recommendations .makro-product-carousel:not(.swiper-initialized)') != null ){
      setTimeout(function(){
         document.querySelector('cart-drawer product-recommendations .makro-product-carousel:not(.swiper-initialized)')
      },450);
    }*/
  }
  getSectionInnerHTML(e, t = ".shopify-section") {    
    let tempDom = (new DOMParser).parseFromString(e, "text/html").querySelector(t);
    return tempDom != null ? tempDom.innerHTML : '';
  }
  getSectionsToRender() {
    return [{
      id: "cart-drawer",
      selector: "#CartDrawer"
    }, {
      id: "cart-icon-bubble"
    }]
  }
  getSectionDOM(e, t = ".shopify-section") {
    return (new DOMParser).parseFromString(e, "text/html").querySelector(t)
  }
  setActiveElement(e) {
    this.activeElement = e
  }

  routineSlider(){
    let swiperElement = this.querySelector('.completeRoutine--swiper');
    if(swiperElement){
      this.routineSliderSwiper = new Swiper( swiperElement, {
        speed: 500,
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 0,      
        navigation: {
          nextEl: ".cart-drawer-swiper-next",
          prevEl: ".cart-drawer-swiper-prev",
        },
        breakpoints: {
          0: {
            autoHeight: true
          },
          750: {
            autoHeight: false
          }
        },
      });
    }
  }
}
customElements.define("cart-drawer", CartDrawer);
class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [{
      id: "CartDrawer",
      section: "cart-drawer",
      selector: ".drawer__inner"
    }, {
      id: "cart-icon-bubble",
      section: "cart-icon-bubble",
      selector: ".shopify-section"
    }]
  }
}
customElements.define("cart-drawer-items", CartDrawerItems);