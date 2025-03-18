function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}



document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  
  summary.setAttribute('role', 'button');
  summary.setAttribute('aria-expanded', summary.parentNode.hasAttribute('open'));

  if (summary.nextElementSibling.getAttribute('id')) {
    summary.setAttribute('aria-controls', summary.nextElementSibling.id);
  }

  summary.addEventListener('click', (event) => {
    if(summary.closest('div').classList.contains('product__accordion')){
    }else{
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));  
    }
    
  });

  if (summary.closest('header-drawer, menu-drawer')) return;
  summary.parentElement.addEventListener('keyup', onKeyUpEscape);
});

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (event.target !== container && event.target !== last && event.target !== first) return;

    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if ((event.target === container || event.target === first) && event.shiftKey) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);

  elementToFocus.focus();

  if (
    elementToFocus.tagName === 'INPUT' &&
    ['search', 'text', 'email', 'url'].includes(elementToFocus.type) &&
    elementToFocus.value
  ) {
    elementToFocus.setSelectionRange(0, elementToFocus.value.length);
  }
}

// Here run the querySelector to figure out if the browser supports :focus-visible or not and run code based on it.
try {
  document.querySelector(':focus-visible');
} catch (e) {
  focusVisiblePolyfill();
}

function focusVisiblePolyfill() {
  const navKeys = [
    'ARROWUP',
    'ARROWDOWN',
    'ARROWLEFT',
    'ARROWRIGHT',
    'TAB',
    'ENTER',
    'SPACE',
    'ESCAPE',
    'HOME',
    'END',
    'PAGEUP',
    'PAGEDOWN',
  ];
  let currentFocusedElement = null;
  let mouseClick = null;

  window.addEventListener('keydown', (event) => {
    if (navKeys.includes(event.code.toUpperCase())) {
      mouseClick = false;
    }
  });

  window.addEventListener('mousedown', (event) => {
    mouseClick = true;
  });

  window.addEventListener(
    'focus',
    () => {
      if (currentFocusedElement) currentFocusedElement.classList.remove('focused');

      if (mouseClick) return;

      currentFocusedElement = document.activeElement;
      currentFocusedElement.classList.add('focused');
    },
    true
  );
}

function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  });
  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', '*');
  });
  document.querySelectorAll('video').forEach((video) => video.pause());
  document.querySelectorAll('product-model').forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}
function playAllMedia() {
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
  });
  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow.postMessage('{"method":"play"}', '*');
  });
  document.querySelectorAll('video').forEach((video) => video.play());
  document.querySelectorAll('product-model').forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.play();
  });
}
function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== 'ESCAPE') return;

  const openDetailsElement = event.target.closest('details[open]');
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector('summary');
  openDetailsElement.removeAttribute('open');
  summaryElement.setAttribute('aria-expanded', false);
  summaryElement.focus();
}


function formatMoney(cents, format) {
  
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }

  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
      formatString = format || '${{amount}}';

  function defaultTo(value, defaultValue) {
    return value == null || value !== value ? defaultValue : value;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultTo(precision, 2);
    thousands = defaultTo(thousands, ',');
    decimal = defaultTo(decimal, '.');

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);
    var parts = number.split('.'),
        dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        centsAmount = parts[1] ? decimal + parts[1] : '';
    return dollarsAmount + centsAmount;
  }

  var value = '';

  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;

    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;

    case 'amount_with_space_separator':
      value = formatWithDelimiters(cents, 2, ' ', '.');
      break;

    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, ',', '.');
      break;

    case 'amount_no_decimals_with_space_separator':
      value = formatWithDelimiters(cents, 0, ' ');
      break;

    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
  }

  if (formatString.indexOf('with_comma_separator') !== -1) {
    return formatString.replace(placeholderRegex, value);
  } else {
    return formatString.replace(placeholderRegex, value);
  }
  
}


class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true });

    this.input.addEventListener('change', this.onInputChange.bind(this));
    this.querySelectorAll('button').forEach((button) =>
      button.addEventListener('click', this.onButtonClick.bind(this))
    );
  }

  quantityUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.validateQtyRules();
    this.quantityUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.quantityUpdate, this.validateQtyRules.bind(this));
  }

  disconnectedCallback() {
    if (this.quantityUpdateUnsubscriber) {
      this.quantityUpdateUnsubscriber();
    }
  }

  onInputChange(event) {
    this.validateQtyRules();
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
  }

  validateQtyRules() {
    const value = parseInt(this.input.value);
    if (this.input.min) {
      const min = parseInt(this.input.min);
      const buttonMinus = this.querySelector(".quantity__button[name='minus']");
      buttonMinus.classList.toggle('disabled', value <= min);
    }
    if (this.input.max) {
      const max = parseInt(this.input.max);
      const buttonPlus = this.querySelector(".quantity__button[name='plus']");
      buttonPlus.classList.toggle('disabled', value >= max);
    }
  }
}

customElements.define('quantity-input', QuantityInput);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
  };
}

/*
 * Shopify Common JS
 *
 */
if (typeof window.Shopify == 'undefined') {
  window.Shopify = {};
}

Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
};

Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent('on' + eventName, callback);
};

Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options['method'] || 'post';
  var params = options['parameters'] || {};

  var form = document.createElement('form');
  form.setAttribute('method', method);
  form.setAttribute('action', path);

  for (var key in params) {
    var hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', key);
    hiddenField.setAttribute('value', params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (country_domid, province_domid, options) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);

  Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler, this));

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = '';
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  },
};

class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.mainDetailsToggle = this.querySelector('details');

    this.addEventListener('keyup', this.onKeyUp.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll('summary').forEach((summary) =>
      summary.addEventListener('click', this.onSummaryClick.bind(this))
    );
    this.querySelectorAll('button:not(.localization-selector)').forEach((button) =>
      button.addEventListener('click', this.onCloseButtonClick.bind(this))
    );
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    const openDetailsElement = event.target.closest('details[open]');
    if (!openDetailsElement) return;

    openDetailsElement === this.mainDetailsToggle
      ? this.closeMenuDrawer(event, this.mainDetailsToggle.querySelector('summary'))
      : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const parentMenuElement = detailsElement.closest('.has-submenu');
    const isOpen = detailsElement.hasAttribute('open');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function addTrapFocus() {
      trapFocus(summaryElement.nextElementSibling, detailsElement.querySelector('button'));
      summaryElement.nextElementSibling.removeEventListener('transitionend', addTrapFocus);
    }

    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen) event.preventDefault();
      isOpen ? this.closeMenuDrawer(event, summaryElement) : this.openMenuDrawer(summaryElement);

      if (window.matchMedia('(max-width: 990px)')) {
        document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
      }
    } else {
      setTimeout(() => {
        detailsElement.classList.add('menu-opening');
        summaryElement.setAttribute('aria-expanded', true);
        parentMenuElement && parentMenuElement.classList.add('submenu-open');
        !reducedMotion || reducedMotion.matches ? addTrapFocus() : summaryElement.nextElementSibling.addEventListener('transitionend', addTrapFocus);
      }, 100);
    }
    
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add('menu-opening');
    });
    summaryElement.setAttribute('aria-expanded', true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
    document.body.classList.add(`filter-drawer-open`);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event === undefined) return;

    this.mainDetailsToggle.classList.remove('menu-opening');
    this.mainDetailsToggle.querySelectorAll('details').forEach((details) => {
      details.removeAttribute('open');
      details.classList.remove('menu-opening');
    });
    this.mainDetailsToggle.querySelectorAll('.submenu-open').forEach((submenu) => {
      submenu.classList.remove('submenu-open');
    });
    setTimeout(() => {
    if(document.querySelectorAll('.mobile_navabar .nav-toggle-menu.active').length > 0){
      document.querySelector('.mobile_navabar .nav-toggle-menu.active').classList.remove('active')
      }
    },800)
    document.body.classList.remove(`overflow-hidden-${this.dataset.breakpoint}`);
    document.body.classList.remove(`filter-drawer-open`);
    removeTrapFocus(elementToFocus);
    this.closeAnimation(this.mainDetailsToggle);

    if (event instanceof KeyboardEvent) elementToFocus?.setAttribute('aria-expanded', false);
  }

  onFocusOut() {
    setTimeout(() => {
      if (this.mainDetailsToggle.hasAttribute('open') && !this.mainDetailsToggle.contains(document.activeElement))
        this.closeMenuDrawer();
    });
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest('details');
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    const parentMenuElement = detailsElement.closest('.submenu-open');
    parentMenuElement && parentMenuElement.classList.remove('submenu-open');
    detailsElement.classList.remove('menu-opening');
    detailsElement.querySelector('summary').setAttribute('aria-expanded', false);
    removeTrapFocus(detailsElement.querySelector('summary'));
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute('open');
        if (detailsElement.closest('details[open]')) {
          trapFocus(detailsElement.closest('details[open]'), detailsElement.querySelector('summary'));
        }
      }
    };

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define('menu-drawer', MenuDrawer);

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
  }

  openMenuDrawer(summaryElement) {
    this.header = this.header || document.querySelector('.section-header');
    this.borderOffset =
      this.borderOffset || this.closest('.header-wrapper').classList.contains('header-wrapper--border-bottom') ? 1 : 0;
    document.documentElement.style.setProperty(
      '--header-bottom-position',
      `${parseInt(this.header.getBoundingClientRect().bottom - this.borderOffset)}px`
    );
    this.header.classList.add('menu-open');

    setTimeout(() => {
      this.mainDetailsToggle.classList.add('menu-opening');
    });

    summaryElement.setAttribute('aria-expanded', true);
    this.querySelectorAll('.noscript_dropdown_menu').forEach(function(nos_ele){
      const nos_ele_parent = nos_ele.parentNode;
      nos_ele_parent.innerHTML += nos_ele.innerHTML;
      nos_ele.remove();
    });
    
    window.addEventListener('resize', this.onResize);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }

  closeMenuDrawer(event, elementToFocus) {
    if (!elementToFocus) return;
    super.closeMenuDrawer(event, elementToFocus);
    this.header.classList.remove('menu-open');
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.header &&
      document.documentElement.style.setProperty(
        '--header-bottom-position',
        `${parseInt(this.header.getBoundingClientRect().bottom - this.borderOffset)}px`
      );
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
  };
}

customElements.define('header-drawer', HeaderDrawer);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener('click', this.hide.bind(this, false));
    this.addEventListener('keyup', (event) => {
      if (event.code.toUpperCase() === 'ESCAPE') this.hide();
    });
    if (this.classList.contains('media-modal')) {
      this.addEventListener('pointerup', (event) => {
        if (event.pointerType === 'mouse' && !event.target.closest('deferred-media, product-model')) this.hide();
      });
    } else {
      this.addEventListener('click', (event) => {
        if (event.target === this) this.hide();
      });
    }
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    document.body.appendChild(this);
  }

  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector('.template-popup');
    document.body.classList.add('overflow-hidden');
    this.setAttribute('open', '');
    if (popup) popup.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
    window.pauseAllMedia();
  }

  hide() {
    document.body.classList.remove('overflow-hidden');
    document.body.dispatchEvent(new CustomEvent('modalClosed'));
    this.removeAttribute('open');
    removeTrapFocus(this.openedBy);
    window.playAllMedia();
  }
}
customElements.define('modal-dialog', ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector('button');

    if (!button) return;
    button.addEventListener('click', () => {
      const modal = document.querySelector(this.getAttribute('data-modal'));
      if (modal) modal.show(button);
    });
  }
}
customElements.define('modal-opener', ModalOpener);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    const poster = this.querySelector('[id^="Deferred-Poster-"]');
    if (!poster) return;
    poster.addEventListener('click', this.loadContent.bind(this));
  }

  loadContent(focus = true) {
    window.pauseAllMedia();
    if (!this.getAttribute('loaded')) {
      const content = document.createElement('div');
      content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));

      this.setAttribute('loaded', true);
      const deferredElement = this.appendChild(content.querySelector('video, model-viewer, iframe'));
      if (focus) deferredElement.focus();
      if (deferredElement.nodeName == 'VIDEO' && deferredElement.getAttribute('autoplay')) {
        // force autoplay for safari
        deferredElement.play();
      }
    }
  }
}

customElements.define('deferred-media', DeferredMedia);


class CustomDeferredMedia extends HTMLElement {
  constructor() {
    super();
    const poster = this.querySelector('.cover-image');
    if (!poster) return;
    poster.addEventListener('click', this.loadContent.bind(this));
  }

  loadContent(focus = true) {
    window.pauseAllMedia();
    if (!this.getAttribute('loaded')) {
      const content = document.createElement('div');
      if( window.innerWidth < 750 && this.querySelector('template').content.querySelector('.js-mobile-video')){
        content.appendChild(this.querySelector('template').content.querySelector('.js-mobile-video').cloneNode(true));
      }else{      
        content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));
      }
      
      this.setAttribute('loaded', true);
      const deferredElement = this.appendChild(content.querySelector('video, model-viewer, iframe'));
      if (focus) deferredElement.focus();
      if (deferredElement.nodeName == 'VIDEO' && deferredElement.getAttribute('autoplay')) {
        /*force autoplay for safari*/
        deferredElement.play();
      }else{
        deferredElement.height = this.clientHeight;
        deferredElement.width = this.clientWidth;
      }
    }
  }
}

customElements.define('custom-deferred-media', CustomDeferredMedia);

class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector('[id^="Slider-"]');
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.enableSliderLooping = false;
    this.currentPageElement = this.querySelector('.slider-counter--current');
    this.pageTotalElement = this.querySelector('.slider-counter--total');
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');

    this.sliderMobileDotsEle = this.querySelectorAll('[data-slider-dots] li');

    if (!this.slider || !this.nextButton) return;

    this.initPages();
    const resizeObserver = new ResizeObserver((entries) => this.initPages());
    resizeObserver.observe(this.slider);

    this.slider.addEventListener('scroll', this.update.bind(this));

    this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
    this.nextButton.addEventListener('click', this.onButtonClick.bind(this));

    //for mobile dots click event
    if(this.sliderMobileDotsEle.length){
      this.sliderMobileDotsEle.forEach(e => {
        e.addEventListener('click', (event) => {
          event.preventDefault();
          if(event.currentTarget.classList.contains('active')) return;
          const sliderItemsToShow = Array.from(this.sliderItems);
          if (sliderItemsToShow.length < 2) return;
          const currentPage = Number(event.currentTarget.dataset.count);
          const prevPage = currentPage > 0 ? currentPage - 1 : 1;
          const slideScrollPosition = sliderItemsToShow[prevPage].offsetLeft;
          if (currentPage != prevPage) {
            this.slider.scrollTo({
              left: slideScrollPosition,
            });
          }
        });
      });
    }
    
  }

  initPages() {
    this.sliderItemsToShow = Array.from(this.sliderItems).filter((element) => element.clientWidth > 0);
    if (this.sliderItemsToShow.length < 2) return;
    this.sliderItemOffset = this.sliderItemsToShow[1].offsetLeft - this.sliderItemsToShow[0].offsetLeft;
    this.slidesPerPage = Math.floor(
      (this.slider.clientWidth - this.sliderItemsToShow[0].offsetLeft) / this.sliderItemOffset
    );
    this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;
    this.update();
  }

  resetPages() {
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.initPages();
  }

  update() {
    // Temporarily prevents unneeded updates resulting from variant changes
    // This should be refactored as part of https://github.com/Shopify/dawn/issues/2057
    if (!this.slider || !this.nextButton) return;

    const previousPage = this.currentPage;
    this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1;

    if (this.currentPageElement && this.pageTotalElement) {
      this.currentPageElement.textContent = this.currentPage;
      this.pageTotalElement.textContent = this.totalPages;
    }

    if (this.currentPage != previousPage) {
      this.dispatchEvent(new CustomEvent('slideChanged', { detail: {
        currentPage: this.currentPage,
        currentElement: this.sliderItemsToShow[this.currentPage - 1]
      }}));

      //for mobile slider dots class toggle
      setTimeout(() => {
        this.updateMobileSliderDots(previousPage,this.currentPage);
      },290);
    }

    if (this.enableSliderLooping) return;

    if (this.isSlideVisible(this.sliderItemsToShow[0]) && this.slider.scrollLeft === 0) {
      this.prevButton.setAttribute('disabled', 'disabled');
    } else {
      this.prevButton.removeAttribute('disabled');
    }

    if (this.isSlideVisible(this.sliderItemsToShow[this.sliderItemsToShow.length - 1])) {
      this.nextButton.setAttribute('disabled', 'disabled');
    } else {
      this.nextButton.removeAttribute('disabled');
    }
  }

  updateMobileSliderDots(previousPage,currentPage){
    const sliderMobileDotsEle = this.querySelectorAll('[data-slider-dots] li:not(.hidden)');
    if(!sliderMobileDotsEle.length && !previousPage && !currentPage) return;
    sliderMobileDotsEle.forEach(e => e.classList.remove('active'));
    if(sliderMobileDotsEle[currentPage-1]) sliderMobileDotsEle[currentPage-1].classList.add('active');
  }

  isSlideVisible(element, offset = 0) {
    const lastVisibleSlide = this.slider.clientWidth + this.slider.scrollLeft - offset;
    return element.offsetLeft + element.clientWidth <= lastVisibleSlide && element.offsetLeft >= this.slider.scrollLeft;
  }

  onButtonClick(event) {
    event.preventDefault();
    const step = event.currentTarget.dataset.step || 1;
    this.slideScrollPosition =
      event.currentTarget.name === 'next'
        ? this.slider.scrollLeft + step * this.sliderItemOffset
        : this.slider.scrollLeft - step * this.sliderItemOffset;
    this.slider.scrollTo({
      left: this.slideScrollPosition,
    });
  }
}

customElements.define('slider-component', SliderComponent);

class SlideshowComponent extends SliderComponent {
  constructor() {
    super();
    this.sliderControlWrapper = this.querySelector('.slider-buttons');
    this.enableSliderLooping = true;

    if (!this.sliderControlWrapper) return;

    this.sliderFirstItemNode = this.slider.querySelector('.slideshow__slide');
    if (this.sliderItemsToShow.length > 0) this.currentPage = 1;

    this.sliderControlLinksArray = Array.from(this.sliderControlWrapper.querySelectorAll('.slider-counter__link'));
    this.sliderControlLinksArray.forEach((link) => link.addEventListener('click', this.linkToSlide.bind(this)));
    this.slider.addEventListener('scroll', this.setSlideVisibility.bind(this));
    this.setSlideVisibility();

    if (this.querySelector('.announcement-bar-slider')) {
      this.announcementBarArrowButtonWasClicked = false;

      this.desktopLayout = window.matchMedia('(min-width: 750px)');
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

      [this.reducedMotion, this.desktopLayout].forEach((mediaQuery) => {
        mediaQuery.addEventListener('change', () => {
          if (this.slider.getAttribute('data-autoplay') === 'true') this.setAutoPlay();
        });
      });

      [this.prevButton, this.nextButton].forEach((button) => {
        button.addEventListener('click', () => {
          this.announcementBarArrowButtonWasClicked = true;
        }, {once: true});
      });
    }

    if (this.slider.getAttribute('data-autoplay') === 'true') this.setAutoPlay();
  }

  setAutoPlay() {
    this.autoplaySpeed = this.slider.dataset.speed * 1000;
    this.addEventListener('mouseover', this.focusInHandling.bind(this));
    this.addEventListener('mouseleave', this.focusOutHandling.bind(this));
    this.addEventListener('focusin', this.focusInHandling.bind(this));
    this.addEventListener('focusout', this.focusOutHandling.bind(this));

    if (this.querySelector('.slideshow__autoplay')) {
      this.sliderAutoplayButton = this.querySelector('.slideshow__autoplay');
      this.sliderAutoplayButton.addEventListener('click', this.autoPlayToggle.bind(this));
      this.autoplayButtonIsSetToPlay = true;
      this.play();
    } else {
      this.reducedMotion.matches || this.announcementBarArrowButtonWasClicked || !this.desktopLayout.matches ? this.pause() : this.play();
    }
  }

  onButtonClick(event) {
    super.onButtonClick(event);
    const isFirstSlide = this.currentPage === 1;
    const isLastSlide = this.currentPage === this.sliderItemsToShow.length;

    if (!isFirstSlide && !isLastSlide) return;

    if (isFirstSlide && event.currentTarget.name === 'previous') {
      this.slideScrollPosition =
        this.slider.scrollLeft + this.sliderFirstItemNode.clientWidth * this.sliderItemsToShow.length;
    } else if (isLastSlide && event.currentTarget.name === 'next') {
      this.slideScrollPosition = 0;
    }
    this.slider.scrollTo({
      left: this.slideScrollPosition,
    });
  }

  update() {
    super.update();
    this.sliderControlButtons = this.querySelectorAll('.slider-counter__link');
    this.prevButton.removeAttribute('disabled');

    if (!this.sliderControlButtons.length) return;

    this.sliderControlButtons.forEach((link) => {
      link.classList.remove('slider-counter__link--active');
      link.removeAttribute('aria-current');
    });
    this.sliderControlButtons[this.currentPage - 1].classList.add('slider-counter__link--active');
    this.sliderControlButtons[this.currentPage - 1].setAttribute('aria-current', true);
  }

  autoPlayToggle() {
    this.togglePlayButtonState(this.autoplayButtonIsSetToPlay);
    this.autoplayButtonIsSetToPlay ? this.pause() : this.play();
    this.autoplayButtonIsSetToPlay = !this.autoplayButtonIsSetToPlay;
  }

  focusOutHandling(event) {
    if (this.sliderAutoplayButton) {
      const focusedOnAutoplayButton =
        event.target === this.sliderAutoplayButton || this.sliderAutoplayButton.contains(event.target);
      if (!this.autoplayButtonIsSetToPlay || focusedOnAutoplayButton) return;
      this.play();
    } else if (!this.reducedMotion.matches && !this.announcementBarArrowButtonWasClicked && this.desktopLayout.matches) {
      this.play();
    }
  }

  focusInHandling(event) {
    if (this.sliderAutoplayButton) {
      const focusedOnAutoplayButton =
        event.target === this.sliderAutoplayButton || this.sliderAutoplayButton.contains(event.target);
      if (focusedOnAutoplayButton && this.autoplayButtonIsSetToPlay) {
        this.play();
      } else if (this.autoplayButtonIsSetToPlay) {
        this.pause();
      }
    } else if (this.querySelector('.announcement-bar-slider').contains(event.target)) {
      this.pause();
    }
  }

  play() {
    this.slider.setAttribute('aria-live', 'off');
    clearInterval(this.autoplay);
    this.autoplay = setInterval(this.autoRotateSlides.bind(this), this.autoplaySpeed);
  }

  pause() {
    this.slider.setAttribute('aria-live', 'polite');
    clearInterval(this.autoplay);
  }

  togglePlayButtonState(pauseAutoplay) {
    if (pauseAutoplay) {
      this.sliderAutoplayButton.classList.add('slideshow__autoplay--paused');
      this.sliderAutoplayButton.setAttribute('aria-label', window.accessibilityStrings.playSlideshow);
    } else {
      this.sliderAutoplayButton.classList.remove('slideshow__autoplay--paused');
      this.sliderAutoplayButton.setAttribute('aria-label', window.accessibilityStrings.pauseSlideshow);
    }
  }

  autoRotateSlides() {
    const slideScrollPosition =
      this.currentPage === this.sliderItems.length
        ? 0
        : this.slider.scrollLeft + this.slider.querySelector('.slideshow__slide').clientWidth;
    this.slider.scrollTo({
      left: slideScrollPosition,
    });
  }

  setSlideVisibility() {
    this.sliderItemsToShow.forEach((item, index) => {
      const linkElements = item.querySelectorAll('a');
      if (index === this.currentPage - 1) {
        if (linkElements.length)
          linkElements.forEach((button) => {
            button.removeAttribute('tabindex');
          });
        item.setAttribute('aria-hidden', 'false');
        item.removeAttribute('tabindex');
      } else {
        if (linkElements.length)
          linkElements.forEach((button) => {
            button.setAttribute('tabindex', '-1');
          });
        item.setAttribute('aria-hidden', 'true');
        item.setAttribute('tabindex', '-1');
      }
    });
  }

  linkToSlide(event) {
    event.preventDefault();
    const slideScrollPosition =
      this.slider.scrollLeft +
      this.sliderFirstItemNode.clientWidth *
        (this.sliderControlLinksArray.indexOf(event.currentTarget) + 1 - this.currentPage);
    this.slider.scrollTo({
      left: slideScrollPosition,
    });
  }
}

customElements.define('slideshow-component', SlideshowComponent);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.updateOptions();
    this.updateMasterId();
    //this.updateSezzleWidget();
    this.addEventListener('change', this.onVariantChange);
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();
    this.removeErrorMessage();
    if(document.querySelectorAll('variant-radios .product-form__input').length > 1){
      this.updateVariantStatuses();  
    }

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.updateVariantLists(); //update variant dropdown list only
      this.renderProductInfo();
      this.updateShareUrl();
      this.showImgBasedOnAltText();
    }
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant) return;
    if (!this.currentVariant.featured_media) return;

    const mediaGalleries = document.querySelectorAll(`[id^="MediaGallery-${this.dataset.section}"]`);
    mediaGalleries.forEach((mediaGallery) =>
      mediaGallery.setActiveMedia(`${this.dataset.section}-${this.currentVariant.featured_media.id}`, true)
    );

    const modalContent = document.querySelector(`#ProductModal-${this.dataset.section} .product-media-modal__content`);
    if (!modalContent) return;
    const newMediaModal = modalContent.querySelector(`[data-media-id="${this.currentVariant.featured_media.id}"]`);
    modalContent.prepend(newMediaModal);
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateShareUrl() {
    const shareButton = document.getElementById(`Share-${this.dataset.section}`);
    if (!shareButton || !shareButton.updateUrl) return;
    shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  updateVariantStatuses() {
    
    const selectedOptionOneVariants = this.variantData.filter(
      (variant) => this.querySelector(':checked').value === variant.option1
    );
    const selectedOptionTwoVariants = this.variantData.filter(
      (variant) => document.querySelectorAll('variant-radios fieldset')[1].querySelector(':checked').value === variant.option2
    );
    const inputWrappers = [...this.querySelectorAll('.product-form__input')];
    inputWrappers.forEach((option, index) => {


      if(index == 0){
        const optionInputs1 = [...option.querySelectorAll('input[type="radio"], option')];
        const previousOptionSelected2 = inputWrappers[1].querySelector(':checked').value;
        const availableOptionInputsValue2 = selectedOptionTwoVariants
          .filter((variant) => variant.available && variant[`option2`] === previousOptionSelected2)
          .map((variantOption) => variantOption[`option${index + 1}`]);
        this.setInputAvailability2(optionInputs1, availableOptionInputsValue2);
      }else{
        const optionInputs = [...option.querySelectorAll('input[type="radio"], option')];
        const previousOptionSelected = inputWrappers[index - 1].querySelector(':checked').value;
        const availableOptionInputsValue = selectedOptionOneVariants
          .filter((variant) => variant.available && variant[`option${index}`] === previousOptionSelected)
          .map((variantOption) => variantOption[`option${index + 1}`]);
        this.setInputAvailability(optionInputs, availableOptionInputsValue);
      }
      
      
      if (index === 0) return;
      //console.log(index,option)
      
      
    });
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input, index) => {
      if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
        input.innerText = input.getAttribute('value');
      } else {
        input.innerText = window.variantStrings.unavailable_with_option.replace('[value]', input.getAttribute('value'));
      }
    });
  }

  setcustomInputAvailability(listOfOptions, listOfAvailableOptions, option_title) {
    if(option_title == true){
      listOfOptions.forEach((input) => {
        var data_val = input.getAttribute('data-color');
        if (listOfAvailableOptions.includes(input.getAttribute('data-color'))) {
          input.innerHTML = `<span class='color-label'>${data_val}</span>`;
          input.classList.remove("disabled");
        } else {
          input.innerHTML = `<span class='color-label'>${data_val}</span>`;
          input.classList.add("disabled");
        }
      });
    }else{
      listOfOptions.forEach((input) => {
        var data_val = input.getAttribute('data-color');
        if (listOfAvailableOptions.includes(input.getAttribute('data-color'))) {
          input.innerHTML = `${data_val}`;
          input.classList.remove("disable-val");
        } else {
          input.innerHTML = `${data_val}` + "<span>Out Of Stock</span>";
          input.classList.add("disable-val");
        }
      });
    }
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  removeErrorMessage() {
    const section = this.closest('section');
    if (!section) return;

    const productForm = section.querySelector('product-form');
    if (productForm) productForm.handleErrorMessage();
  }

  renderProductInfo() {
    const requestedVariantId = this.currentVariant.id;
    const sectionId = this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section;

    fetch(`${this.dataset.url}?variant=${requestedVariantId}&section_id=${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        // prevent unnecessary ui changes from abandoned selections
        if (this.currentVariant.id !== requestedVariantId) return;

        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const destination = document.getElementById(`price-${this.dataset.section}`);
        const source = html.getElementById(
          `price-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`
        );
        const skuSource = html.getElementById(
          `Sku-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`
        );
        const skuDestination = document.getElementById(`Sku-${this.dataset.section}`);
        const inventorySource = html.getElementById(
          `Inventory-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`
        );
        const inventoryDestination = document.getElementById(`Inventory-${this.dataset.section}`);

        if (source && destination) destination.innerHTML = source.innerHTML;
        if (inventorySource && inventoryDestination) inventoryDestination.innerHTML = inventorySource.innerHTML;
        if (skuSource && skuDestination) {
          skuDestination.innerHTML = skuSource.innerHTML;
          skuDestination.classList.toggle('visibility-hidden', skuSource.classList.contains('visibility-hidden'));
        }

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove('visibility-hidden');

        if (inventoryDestination) inventoryDestination.classList.toggle('visibility-hidden', inventorySource.innerText === '');

        const addButtonUpdated = html.getElementById(`ProductSubmitButton-${sectionId}`);
        this.toggleAddButton(
          addButtonUpdated ? addButtonUpdated.hasAttribute('disabled') : true,
          window.variantStrings.soldoutlabel
        );
        
        //update product metafield color html if any
        const productColorDestination = document.querySelector('color-variant');
        const productColorSource = html.querySelector('color-variant');
        if(productColorDestination && productColorSource) productColorDestination.outerHTML = productColorSource.outerHTML;

        //update fit-quiz size button
        window.easy_size?.sizeChangedTo(this.currentVariant.option1);

        publish(PUB_SUB_EVENTS.variantChange, {
          data: {
            sectionId,
            html,
            variant: this.currentVariant,
          },
        });

        this.updateSezzleWidget();
        
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton) return;

    if (disable) {
      
      addButton.setAttribute('disabled', 'disabled');
      if(document.body.classList.contains('template-product')){
        document.querySelector('.shop-pay-btn').classList.add('hidden');
      }

      //for notify me when available
      const notifySelectEle = document.querySelector('#email_signup select');
      const notifyFormInputField = document.querySelector('#email_signup .k-variant-title');
      if(!this.currentVariant.available && notifySelectEle){
        notifySelectEle.value = this.currentVariant.title;
        notifySelectEle.dispatchEvent(new Event('change', { bubbles: true }));
        if(notifyFormInputField){
          notifyFormInputField.setAttribute('value',this.currentVariant.title);
        }
      }
      //&& for notify me when available  
      if(document.querySelector('#email_signup') != null){
        document.querySelectorAll('#email_signup select.active').forEach(list => {
          list.classList.remove('active');
        });
        if(document.querySelector('[name="Variant_title"]')) document.querySelector('[name="Variant_title"]').value = this.currentVariant?.title;
        document.querySelectorAll(`#email_signup select`).forEach((list,index,_listarray) =>{
            list.removeAttribute('selected');
        	var email_select = list.getAttribute('data-index');
            document.querySelectorAll('variant-selects .product-form__input').forEach(select => {
        	    var curr_val = select.querySelector('.select select').value;
        	    var select_index = select.getAttribute('data-index');
        	    if(select_index == email_select){
        	    	list.value = curr_val;
        	    }
        	});      
        });
      }
      
      if(addButton.classList.contains('disabled')){
        addButton.classList.add('hidden');
      }
      if (text) addButtonText.textContent = text;

      // add disable class in outofstock variant
      // if(document.querySelector('.size-label-wrapper') != null){
      //   if(document.querySelector('.size-label-wrapper').closest('fieldset').querySelector('input:checked')){
      //       document.querySelector('.size-label-wrapper').closest('fieldset').querySelector('input:checked').classList.add('disabled');    
      //   } 
      // }
    } else {
      addButton.removeAttribute('disabled');
      if(document.body.classList.contains('template-product') && !addButton.classList.contains('disabled')){
        document.querySelector('.shop-pay-btn').classList.remove('hidden');
      }
      addButtonText.textContent = window.variantStrings.addToCart;
      // add disable class in outofstock variant
      // if(document.querySelector('.size-label-wrapper') != null){
      //   if(document.querySelector('.size-label-wrapper').closest('fieldset').querySelector('input:checked')){
      //       document.querySelector('.size-label-wrapper').closest('fieldset').querySelector('input:checked').classList.remove('disabled');    
      //   } 
      // }
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    const inventory = document.getElementById(`Inventory-${this.dataset.section}`);
    const sku = document.getElementById(`Sku-${this.dataset.section}`);

    if (!addButton) return;
    addButtonText.textContent = window.variantStrings.unavailable;
    if (price) price.classList.add('visibility-hidden');
    if (inventory) inventory.classList.add('visibility-hidden');
    if (sku) sku.classList.add('visibility-hidden');
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }

  showImgBasedOnAltText(){
    const colorFieldSet = this.querySelector(`[data-option-name="color"]`) || null;
    if(!colorFieldSet) return;
    const selectedColorVal = colorFieldSet.querySelector(`input:checked`).dataset.color;
    
    //For main product image 
    const allImgs = document.querySelectorAll('slider-component .product__media-list .product__media-item, [data-slider-dots] li');
    const imgsAltText = document.querySelectorAll(`slider-component .product__media-list .product__media-item[data-alt-text="${selectedColorVal}"], [data-slider-dots] li[data-alt-text="${selectedColorVal}"]`);
    const imgsAllAltText = document.querySelectorAll(`slider-component .product__media-list .product__media-item[data-alt-text=""],[data-slider-dots] li[data-alt-text=""]`);
    if(allImgs.length && selectedColorVal){
      allImgs.forEach(images => images.classList.add('hidden'));
    }
    if(imgsAltText.length && selectedColorVal){
      imgsAltText.forEach(images => images.classList.remove('hidden'));
    }
    if(imgsAllAltText.length && selectedColorVal){
      imgsAllAltText.forEach(images => images.classList.remove('hidden'));
    }

    // add active class to slider dots of first respective img
    const activeSliderDots = document.querySelectorAll('[data-slider-dots] li:not(.hidden)');
    const activeSliderDotsClass = document.querySelectorAll('[data-slider-dots] li.active');
    if(activeSliderDotsClass.length) activeSliderDotsClass.forEach(e => e.classList.remove('active'));
    if(activeSliderDots.length) activeSliderDots[0].classList.add('active');

    //for product modal popup image
    const modalAllItems = document.querySelectorAll('product-modal .product-media-modal__content img, product-modal .product-media-modal__content deferred-media');
    const modalItemAltText = document.querySelectorAll(`product-modal .product-media-modal__content img[data-alt-text="${selectedColorVal}"], product-modal .product-media-modal__content deferred-media[data-alt-text="${selectedColorVal}"]`);
    const modalItmeAllAltText = document.querySelectorAll(`product-modal .product-media-modal__content img[data-alt-text=""], product-modal .product-media-modal__content deferred-media[data-alt-text=""]`);
    if(modalAllItems.length && selectedColorVal){
      modalAllItems.forEach(images => images.classList.add('hidden'));
    }
    if(modalItemAltText.length && selectedColorVal){
      modalItemAltText.forEach(images => images.classList.remove('hidden'));
    }
    if(modalItmeAllAltText.length && selectedColorVal){
      modalItmeAllAltText.forEach(images => images.classList.remove('hidden'));
    }
  }
  
  updateSezzleWidget(){
    let price =  this.currentVariant.price;
    if(typeof AwesomeSezzle !== 'function' || AwesomeSezzle === 'undefined' || AwesomeSezzle === null) return;
    if(document.getElementById('sezzle-widget-container')) document.getElementById('sezzle-widget-container').innerHTML = '';
    let renderSezzle = new AwesomeSezzle({
      amount: formatMoney(price,window.theme.moneyFormat),
      renderElement: 'sezzle-widget-container', // sezzle-widget-container-id
      alignment: 'left',
      widgetType: 'product-page',
      widgetTemplate: {en: 'or 4 interest-free payments of Regular price %%price%% with %%logo%% %%info%%'},
      minPrice: 5000, // Amount in cents
    })
    renderSezzle.init();
  }

  handleVariantListClickEvent(){
    const mainListEle = this.querySelectorAll(`[data-variant-list]`);
    const clickEle = this.querySelectorAll(`[data-selected-variant]`);
    if(!mainListEle.length && !clickEle.length) return;
    clickEle.forEach((ele) => {
      ele.addEventListener('click', (e) => {
        if(e.target.closest(`[data-variant-list]`).classList.contains('active')){
          mainListEle.forEach((el) => el.classList.remove('active'));
        }else{
          mainListEle.forEach((el) => el.classList.remove('active'));
          e.target.closest(`[data-variant-list]`).classList.add('active');
        }
      });
    });
    //outside click close dropdown
    document.onclick = function(e){
      if(e.target.dataset.selectedVariant == ''){
      }else{
        mainListEle.forEach((el) => el.classList.remove('active'));
      }
    };
    this.updateVariantLists();
  }

  updateVariantLists(){
    const inputEle = this.querySelectorAll('fieldset:not([data-option-name="size"]) input');
    const allInputEle = this.querySelectorAll('fieldset input');
    const selectedVariantEle = this.querySelectorAll(`[data-selected-variant]`);
    if(!inputEle.length) return;

    selectedVariantEle.forEach(el => {
      el.classList.remove('disable');
      el.querySelector('.oos-label').classList.add('hidden');
      el.closest('[data-variant-list]').classList.remove('active')
    });

    //update selected variant label and class adjustment
    allInputEle.forEach(e => {
      const selectedVariantEle = e.closest('fieldset').querySelector('[data-selected-variant]');
      if(e.checked){
        e.closest('fieldset').querySelector('.selected-variant').textContent = e.value;
        if(selectedVariantEle){
          selectedVariantEle.querySelector('span:not(.oos-label)').textContent = e.value;
          if(e.classList.contains('disabled')){
            selectedVariantEle.classList.add('disable');
            selectedVariantEle.querySelector('.oos-label').classList.remove('hidden');
          }
        }
      }
      if(selectedVariantEle){
        e.closest('li').classList.remove('disable-val');
        e.closest('li').querySelector('[data-sold-out-label]').classList.add('hidden');
        if(e.classList.contains('disabled')){
          e.closest('li').classList.add('disable-val');
          e.closest('li').querySelector('[data-sold-out-label]').classList.remove('hidden');
        }
      }
    });
  }
  
}

customElements.define('variant-selects', VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
    this.handleVariantListClickEvent();
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
        input.classList.remove('disabled');
      } else {
        input.classList.add('disabled');
      }
    });
  }

  setInputAvailability2(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
        input.classList.remove('disabled');
      } else {
        input.classList.add('disabled');
      }
    });
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'));
    this.options = fieldsets.map((fieldset) => {
      let checkedValue = Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
      if( fieldset.querySelector('.form__label .selected-variant') ){
        fieldset.querySelector('.form__label .selected-variant').innerText = checkedValue;
      }
      return checkedValue;
    });    
  }
  
}
customElements.define('variant-radios', VariantRadios);



class ProductRecommendations extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const proReThsi = this;
    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      fetch(this.dataset.url)
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement('div');
          html.innerHTML = text;
          const recommendations = html.querySelector('product-recommendations');
          const recommendationsSlider = recommendations.querySelector('.product-carousel-slider');

          if (recommendations && recommendations.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML;
          }

          /*if (!this.querySelector('slideshow-component') && this.classList.contains('complementary-products')) {this.remove();}*/

          if (html.querySelector('.grid__item')) {
            this.classList.add('product-recommendations--loaded');
          }
          if ( recommendationsSlider ){
            const recommendationsSlider = this.querySelector('.product-carousel-slider');
            setTimeout(function () {
              if( proReThsi.closest('cart-drawer') != null ){
                var mySwiper = new Swiper( recommendationsSlider, {
                  slidesPerView: 1,
                  slidesPerGroup: 1,
                  autoHeight: true,                
                  speed: 900,
                  navigation: {
                    nextEl: ".re-col-slide-next",
                    prevEl: ".re-col-slide-prev",
                  },
                  breakpoints: {
                  750: {
                    spaceBetween: 20,
                  },
                  },
                });
              }else{
                if ( window.innerWidth > 989 ){
                  var mySwiper = new Swiper( recommendationsSlider, {
                  slidesPerView: 2.33,
                  spaceBetween: 10,
                  slidesPerGroup: 2,
                  speed: 900,      
                  navigation: {
                    nextEl: ".re-col-slide-next",
                    prevEl: ".re-col-slide-prev",
                  },
                    breakpoints: {
                    1200: {
                      slidesPerView: 4,
                      slidesPerGroup: 4,
                      spaceBetween: 32,
                    },
                    990: {
                      slidesPerView: 3,
                      slidesPerGroup: 3,
                      spaceBetween: 20,
                    },
                    750: {          
                      slidesPerView: 2.33,
                      slidesPerGroup: 2,
                      spaceBetween: 20,
                    },
                  },
                });
                }
              }
            }, 250);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    new IntersectionObserver(handleIntersection.bind(this), { rootMargin: '0px 0px 400px 0px' }).observe(this);
  }
}
customElements.define('product-recommendations', ProductRecommendations);

class ProductRecentlyViewed extends HTMLElement {
  constructor() {
    super();
    this.options = JSON.parse(this.getAttribute('data-section-settings'));
  }
  
  connectedCallback(){
    this.fetchProducts();
  }

  fetchProducts(){
    const handleIntersection = (entries, observer) => {
    if (!entries[0].isIntersecting) return;
    observer.unobserve(this);

    const queryString = this.getSearchQueryString();
    if (queryString === '') {
      return;
    }
    var $this = this;
    const url = `${this.options['searchUrl']}?section_id=${this.getAttribute('data-section-id')}&type=product&q=${queryString}`;

    fetch(url, { credentials: 'same-origin', method: 'GET'})
      .then((response) => response.text())
      .then(function (content) {
        var tempElement = document.createElement('div');
        tempElement.innerHTML = content;
        if(tempElement.querySelector(`.recently-viewed-products .recently-viewed-products-placeholder`)){
          $this.querySelector('.recently-viewed-products-placeholder').innerHTML = 
            tempElement.querySelector(`.recently-viewed-products .recently-viewed-products-placeholder`).innerHTML;
          $this.querySelector('.collection').classList.remove('hidden');
        }
        setTimeout(() => {
          $this.initSlider();
        },250);
        
      });
    };
    new IntersectionObserver(handleIntersection.bind(this), { rootMargin: '0px 0px 400px 0px' }).observe(this);
  }
  
  getSearchQueryString(){
    // If we are on a product template, we make sure to remove the main product from the related product
    const items = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
    if (items.includes(this.options['currentProductId'])) {
      items.splice(items.indexOf(this.options['currentProductId']), 1);
    }
    return items.map(function (item) {
      return 'id:' + item;
    }).join(' OR ');
  }

  initSlider(){
    const eleSlide = this.querySelector('.recently-viewed-products [data-recently-view-slider]');
    if(!eleSlide) return;
    var mySwiper = new Swiper (eleSlide, {
      slidesPerView: "auto",
      spaceBetween: 20,
      slidesPerGroup: 1,
      speed: 900,
      navigation: {
        nextEl: ".fea-col-slide-next",
        prevEl: ".fea-col-slide-prev",
      },
      breakpoints: {
        1200: {
          slidesPerView: 4,
          slidesPerGroup: 4
        },
        1023: {
          slidesPerView: 4,
          slidesPerGroup: 4
        },
        991: {
          slidesPerView: 3,
          slidesPerGroup: 3
        },
        991: {
          slidesPerView: 2,
          slidesPerGroup: 2
        }
      }
    });
  }
}
customElements.define('recently-viewed-products', ProductRecentlyViewed);

class ColorVariant extends HTMLElement {
  
  static cacheUrlData = ColorVariant.memoizePromiseAPI(ColorVariant.fetchRequestForPage);
  
  constructor() {
    super();
    this.loadType = this.dataset?.ajaxLoad;
    if(this.loadType == 'true'){
      this.querySelectorAll('a').forEach(el => el.addEventListener('click', this.onProductChange.bind(this)));
    }
  }
  
  onProductChange(event){
    event.preventDefault();
    let targetUrl = event.target.dataset.url;
    //console.log('targetUrl >>',targetUrl);
    if(event.target.classList.contains('active')) return;
    this.fetchHtmlData(targetUrl);
  }

  static memoizePromiseAPI(fn){
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        console.log('data from cached >>>');
        return cache.get(key);
      }
      cache.set(
        key,
        fn(...args).catch((error) => {
          cache.delete(key);
          return Promise.reject(error); 
        })
      );
      return cache.get(key);
    };
  }

  static fetchRequestForPage(url) {
    return fetch(url)
    .then((response) => response.text())
    .then((text) => {
      return text;
    });
  }
  
  fetchHtmlData(url){
    if(!document.querySelector('.global-loader')){
      const divEle = document.createElement('div');
      divEle.classList.add('global-loader');
      document.body.appendChild(divEle);
    }
    document.body.classList.add('fetch--progress');
    
    ColorVariant.cacheUrlData(url)
    .then((result) => {
      const html = new DOMParser().parseFromString(result, 'text/html');
      const mainEle = document.getElementById('MainContent');
      const getHtml = html.getElementById('MainContent');
      if(getHtml && mainEle){
        // replace main tag html
        mainEle.innerHTML = getHtml.innerHTML;
        //remove old product-modal inner html data
        if(document.querySelector('product-modal')){
          document.querySelector('product-modal').remove();
        }
        //replace new url
        window.history.replaceState({ }, '', url);
        
        this.reInitRequiredFunction();
      }
      
      setTimeout(() => {
        document.body.classList.remove('fetch--progress');
        //document.body.removeChild(divEle);  
      },950);
    })
    .catch((error) => {
      document.body.classList.remove('fetch--progress');
      console.log('%cCould not fetch the request, please refresh the page and try again..!!','color: red; font-size: 14px; font-weight: 700', error);
    })
  }

  adjustJudgmeReviewHTML(){
    const mainEle = document.querySelector(".jdgm-review-widget .jdgm-rev-widg__summary-inner");
    if(!mainEle) return;
    
    let review_text1 = review_text2 = null;
    
    if(document.querySelector(".jdgm-rev-widg__summary-text")){
      let revText = document.querySelector(".jdgm-rev-widg__summary-text").innerHTML;
      let isHave = revText.includes("Based on");
      if(isHave){
        let arr = document.querySelector(".jdgm-rev-widg__summary-text .jdgm-rev__prod-link").innerHTML.split("Based on");
        review_text1 = arr[0].trim();
        review_text2 = arr[1].trim();
      }
    }

    if(review_text1 && review_text2){
      var review_html = '<div class="review-part-big"><div class="avg-review">'+review_text1+'</div><div class="all-review-box"><div class="rating-stars"><svg width="120" height="21" viewBox="0 0 120 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.53834 1.60996C9.70914 1.19932 10.2909 1.19932 10.4617 1.60996L12.5278 6.57744C12.5998 6.75056 12.7626 6.86885 12.9495 6.88383L18.3123 7.31376C18.7556 7.3493 18.9354 7.90256 18.5976 8.19189L14.5117 11.6919C14.3693 11.8139 14.3071 12.0053 14.3506 12.1876L15.5989 17.4208C15.7021 17.8534 15.2315 18.1954 14.8519 17.9635L10.2606 15.1592C10.1006 15.0615 9.89938 15.0615 9.73937 15.1592L5.14806 17.9635C4.76851 18.1954 4.29788 17.8534 4.40108 17.4208L5.64939 12.1876C5.69289 12.0053 5.6307 11.8139 5.48831 11.6919L1.40241 8.19189C1.06464 7.90256 1.24441 7.3493 1.68773 7.31376L7.05054 6.88383C7.23744 6.86885 7.40024 6.75056 7.47225 6.57744L9.53834 1.60996Z" fill="black"/><path d="M34.5383 1.60996C34.7091 1.19932 35.2909 1.19932 35.4617 1.60996L37.5278 6.57744C37.5998 6.75056 37.7626 6.86885 37.9495 6.88383L43.3123 7.31376C43.7556 7.3493 43.9354 7.90256 43.5976 8.19189L39.5117 11.6919C39.3693 11.8139 39.3071 12.0053 39.3506 12.1876L40.5989 17.4208C40.7021 17.8534 40.2315 18.1954 39.8519 17.9635L35.2606 15.1592C35.1006 15.0615 34.8994 15.0615 34.7394 15.1592L30.1481 17.9635C29.7685 18.1954 29.2979 17.8534 29.4011 17.4208L30.6494 12.1876C30.6929 12.0053 30.6307 11.8139 30.4883 11.6919L26.4024 8.19189C26.0646 7.90256 26.2444 7.3493 26.6877 7.31376L32.0505 6.88383C32.2374 6.86885 32.4002 6.75056 32.4722 6.57744L34.5383 1.60996Z" fill="black"/><path d="M59.5383 1.60996C59.7091 1.19932 60.2909 1.19932 60.4617 1.60996L62.5278 6.57744C62.5998 6.75056 62.7626 6.86885 62.9495 6.88383L68.3123 7.31376C68.7556 7.3493 68.9354 7.90256 68.5976 8.19189L64.5117 11.6919C64.3693 11.8139 64.3071 12.0053 64.3506 12.1876L65.5989 17.4208C65.7021 17.8534 65.2315 18.1954 64.8519 17.9635L60.2606 15.1592C60.1006 15.0615 59.8994 15.0615 59.7394 15.1592L55.1481 17.9635C54.7685 18.1954 54.2979 17.8534 54.4011 17.4208L55.6494 12.1876C55.6929 12.0053 55.6307 11.8139 55.4883 11.6919L51.4024 8.19189C51.0646 7.90256 51.2444 7.3493 51.6877 7.31376L57.0505 6.88383C57.2374 6.86885 57.4002 6.75056 57.4722 6.57744L59.5383 1.60996Z" fill="black"/><path d="M84.5383 1.60996C84.7091 1.19932 85.2909 1.19932 85.4617 1.60996L87.5278 6.57744C87.5998 6.75056 87.7626 6.86885 87.9495 6.88383L93.3123 7.31376C93.7556 7.3493 93.9354 7.90256 93.5976 8.19189L89.5117 11.6919C89.3693 11.8139 89.3071 12.0053 89.3506 12.1876L90.5989 17.4208C90.7021 17.8534 90.2315 18.1954 89.8519 17.9635L85.2606 15.1592C85.1006 15.0615 84.8994 15.0615 84.7394 15.1592L80.1481 17.9635C79.7685 18.1954 79.2979 17.8534 79.4011 17.4208L80.6494 12.1876C80.6929 12.0053 80.6307 11.8139 80.4883 11.6919L76.4024 8.19189C76.0646 7.90256 76.2444 7.3493 76.6877 7.31376L82.0505 6.88383C82.2374 6.86885 82.4002 6.75056 82.4722 6.57744L84.5383 1.60996Z" fill="black"/><path d="M109.538 1.60996C109.709 1.19932 110.291 1.19932 110.462 1.60996L112.528 6.57744C112.6 6.75056 112.763 6.86885 112.949 6.88383L118.312 7.31376C118.756 7.3493 118.935 7.90256 118.598 8.19189L114.512 11.6919C114.369 11.8139 114.307 12.0053 114.351 12.1876L115.599 17.4208C115.702 17.8534 115.231 18.1954 114.852 17.9635L110.261 15.1592C110.101 15.0615 109.899 15.0615 109.739 15.1592L105.148 17.9635C104.769 18.1954 104.298 17.8534 104.401 17.4208L105.649 12.1876C105.693 12.0053 105.631 11.8139 105.488 11.6919L101.402 8.19189C101.065 7.90256 101.244 7.3493 101.688 7.31376L107.051 6.88383C107.237 6.86885 107.4 6.75056 107.472 6.57744L109.538 1.60996Z" fill="black"/></svg></div><div class="review-text">'+review_text2+'</div></div></div>';
      mainEle.innerHTML = review_html;
    }
    
  }

  reInitRequiredFunction(){
    //style with slider function
    if(document.querySelector('[data-style-with-slider]') && typeof styleWithSlider === 'function'){
      styleWithSlider();
    }

    setTimeout(() => {
      //Foursixty widget function
      let fsIds = document.querySelectorAll('.shopify-app-block [data-theme]');
      if(fsIds.length){
        fsIds.forEach(id => {
          const eleId = id.getAttribute('id');
          const type = id.getAttribute('data-theme');
          if(type.includes('slider_')){
            const foursixtyGallery = window.Foursixty?.Slider?.create({targetSelector: `#${eleId}`});
            if(foursixtyGallery) foursixtyGallery.init();
          }else{
            const foursixtyEmbed = window.Foursixty?.Embed?.create({targetSelector: `#${eleId}`});
            if(foursixtyEmbed) foursixtyEmbed.init(); 
          }
        });
        
        let foursixtyAppBlock = setInterval(fsElement, 300);
        let lengthCount = 0;
        function fsElement() {
          if(document.querySelector('.fs-slider-container .fs-timeline') && document.querySelector('.fs-slider-container .fs-timeline').children.length) {
            clearInterval(foursixtyAppBlock);
            document.querySelector('.section-rich-text .isolate').classList.remove('hidden');
          }else if(lengthCount == 10){
            clearInterval(foursixtyAppBlock);
          }  
          lengthCount = lengthCount + 1;
        }
      }
      
      //judgme review widget
      window.judgeme?.initializeWidgets();
      this.adjustJudgmeReviewHTML();
    },650);
    
    //rebuy widget function
    window.Rebuy?.widgets.forEach(widget => widget.methods.reload());
  }

}

customElements.define('color-variant', ColorVariant);




class promoCodeField extends HTMLElement {
  constructor(){
    super();
    this.promoField = this.querySelector('[data-promo-code]');
    if(!this.promoField) return;
    this.promoField.addEventListener('click',this.copyToClipBoard.bind(this));
  }
  
  copyToClipBoard(event){
    event.preventDefault();
    const afterCopytext = this.querySelector('[data-after-copy]');
    const copyText = this.querySelector("#inputCopyText"); // Get the text field
    if(!copyText) return;
    copyText.select(); // Select the text field
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value); // Copy the text inside the text field
    if(afterCopytext){
      this.classList.add('copied');
      afterCopytext.classList.remove('hidden');
      setTimeout(() => {
        afterCopytext.classList.add('hidden');
        this.classList.remove('copied');
      }, 2000);
    } 
    console.log("Copied the coupen code: " + copyText.value);
  }
}
customElements.define('promocode-field', promoCodeField);



