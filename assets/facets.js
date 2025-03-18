class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      let target = event.target
      if( target.closest('[tag-filter]') ){
        let parentNode = target.closest('[role="list"]');        
        parentNode.querySelectorAll('input:checked').forEach(function(ele){ ele.checked == false });
        target.closest('[tag-filter]').querySelector('input').checked == true;
      }
      this.onSubmitHandler(event);
    }, 500);

    const facetForm = this.querySelector('form');
    facetForm.addEventListener('input', this.debouncedOnSubmit.bind(this));

    const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
    if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);

    //for sticky filter bar
    this.detectStickyFilterBarEle();

    document.querySelectorAll('[role="list"] input[type="checkbox"]').forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
        const checkboxQueSe = checkbox.closest('[role="list"]');
        checkboxQueSe.querySelectorAll('input[type="checkbox"]').forEach(function(otherCheckbox) {
          if (otherCheckbox !== checkbox) {
            otherCheckbox.checked = false;
          }
        });
      });
    });

    if( document.querySelector('div[id*=-Mobile-SortBy] .mobile-facets__summary select') ){
      document.querySelector('div[id*=-Mobile-SortBy] .mobile-facets__summary select').addEventListener('change', function(){
        document.querySelector('.product-grid-container facet-filters-form select[name="sort_by"]').value = this.value;
        document.querySelector('.product-grid-container facet-filters-form select[name="sort_by"]').dispatchEvent(new Event('input', { bubbles: true }))
      });
    }    
  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);
    };
    window.addEventListener('popstate', onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    /* remove-facet event */
    let has_filter_remove = false;
    let filter_remove_url = '';
    if( event.target != null ){      
      if( event.target.classList.contains('active-facets__button') ){
        has_filter_remove = true;
        filter_remove_url = event.target.href;
      }else if( event.target.parentNode.classList.contains('active-facets__button') ){      
        has_filter_remove = true;
        filter_remove_url = event.target.parentNode.href;
      }
    }
    if( has_filter_remove == true && searchParams == '' ){
      searchParams = new URLSearchParams(window.location.search).toString();
    }
    console.log('has_filter_remove', has_filter_remove, filter_remove_url);
    /* remove-facet event */
    
    console.log('searchParams', searchParams, event);
    let searchPs = [], searchPstag = [], searchPstemp = [];
    if(searchParams.indexOf('tag') > -1 ){      
      if( searchParams.indexOf('&') > -1 ){
        searchPstemp = searchParams.split('&');
      }else{
        searchPstemp.push(searchParams);
      }
      console.log('searchPstemp', searchPstemp);
      searchPstemp.forEach(function(text){
        console.log('text', text);
        if( text.indexOf('tag') > -1 ){
          searchPstag.push(text.split('=')[1]);
        }else{
          searchPs.push(text);
        }
        console.log('text text text text');
      });
      console.log('searchPs, searchPstag', searchPs, searchPstag);
      searchParams = searchPs.join('&');
    }
    
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();
    const countContainer = document.getElementById('ProductCount');
    const countContainerDesktop = document.getElementById('ProductCountDesktop');
    document.getElementById('ProductGridContainer').querySelector('.collection').classList.add('loading');
    
    if(document.querySelector('[data-facets-bar] .mobile-facets__wrapper')){
      // for filter drawer
      document.querySelector('[data-facets-bar] .mobile-facets__wrapper').classList.add('loading');
    }
    
    if (countContainer) {
      countContainer.classList.add('loading');
    }
    if (countContainerDesktop) {
      countContainerDesktop.classList.add('loading');
    }

    const facetFormOnSaleFilter = document.querySelectorAll('.on-sale-filter--input');
    let onSaleChecked = false;
    facetFormOnSaleFilter.forEach(function(saleEle) {
      if (!onSaleChecked && saleEle.querySelector('input').checked){
        onSaleChecked = true; 
      }
    });
    let r_url = filter_remove_url != '' ? filter_remove_url : window.collection_url;
    sections.forEach((section) => {      
      const url = searchPstag.length > 0 ? onSaleChecked ? `${r_url}/${ searchPstag.join('+') }?${searchParams}&view=ajax-onsale` : `${r_url}/${ searchPstag.join('+') }?section_id=${section.section}&${searchParams}` 
        : onSaleChecked ? `${r_url}?${searchParams}&view=ajax-onsale` : `${r_url}?section_id=${section.section}&${searchParams}` ;      
      //const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = (element) => element.url === url;

      FacetFiltersForm.filterData.some(filterDataUrl)
        ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event)
        : FacetFiltersForm.renderSectionFromFetch(url, event);
    });

    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams, searchPstag, r_url);

    //close filter if open
    setTimeout(() => {
      if (window.matchMedia('(min-width: 1199px)').matches) {
        if(event?.target.closest('details') && event?.target.closest('details').hasAttribute('open') && !event?.target.closest('.facets-container-drawer')){
          event.target.closest('details').removeAttribute('open');
        }  
      }
    },250);

    

    document.querySelectorAll('[tag-filter] input[type="checkbox"]').forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {        
        checkbox.closest('[role="list"]').querySelectorAll('[tag-filter] input[type="checkbox"]').forEach(function(otherCheckbox) {
          if (otherCheckbox !== checkbox) {
            otherCheckbox.checked = false;
          }
        });
      });
    });    
    
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGridContainer(html);
        FacetFiltersForm.renderProductCount(html);
        if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
      });
  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html);
    FacetFiltersForm.renderProductCount(html);
    if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
  }

  static renderProductGridContainer(html) {
    document.getElementById('ProductGridContainer').innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('ProductGridContainer').innerHTML;

    document
      .getElementById('ProductGridContainer')
      .querySelectorAll('.scroll-trigger')
      .forEach((element) => {
        element.classList.add('scroll-trigger--cancel');
      });
  }

  static renderProductCount(html) {
    const facetFormOnSaleFilter = document.querySelectorAll('.on-sale-filter--input');
    let onSaleChecked = false;
    facetFormOnSaleFilter.forEach(function(saleEle) {
      if (!onSaleChecked && saleEle.querySelector('input').checked){
        onSaleChecked = true; 
      }
    });
    let count_item = document.querySelectorAll('#product-grid .grid__item').length;
    count_item = count_item <= 1 ? `${ count_item } Item`: `${ count_item } Items`
    const count = onSaleChecked ? count_item : new DOMParser().parseFromString(html, 'text/html').getElementById('ProductCount').innerHTML;
    const container = document.getElementById('ProductCount');
    const containerDesktop = document.getElementById('ProductCountDesktop');
    
    container.innerHTML = count;
    container.classList.remove('loading');
    if (containerDesktop) {
      containerDesktop.innerHTML = count;
      containerDesktop.classList.remove('loading');
    }
    
    if(document.querySelector('[data-facets-bar] .mobile-facets__wrapper')){
      // for filter drawer
      document.querySelector('[data-facets-bar] .mobile-facets__wrapper').classList.remove('loading');
    }

    //remove open class form all accordian as new html is appeded
    const mainParent = document.querySelectorAll('.mobile-facets__main .mobile-facets__details');
    mainParent.forEach(e => {
      if(e.classList.contains('tab--open')){
        e.classList.remove('tab--open');
        e.querySelector(".mobile-facets__submenu").style.maxHeight = "0px";
      }
    });


    // swym wishlist reInit
    setTimeout(() => {
      typeof window._swat != 'undefined' ? window._swat.initializeActionButtons("body") : '';
    },300);
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

    const facetDetailsElements = parsedHTML.querySelectorAll(
      '#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersPillsForm .js-filter'
    );
    const matchesIndex = (element) => {
      const jsFilter = event ? event.target.closest('.js-filter') : undefined;
      return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
    };
    const facetsToRender = Array.from(facetDetailsElements).filter((element) => !matchesIndex(element));
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {      
      if( document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`) ){
        document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
      }else{
        console.log('element.dataset.index', element.dataset.index);
      }
    });

    //re-render html for stock availability checkbox
    const stoclAvlCheckbox = document.querySelectorAll(`[data-stock-availability]`);
    if(stoclAvlCheckbox.length){
     stoclAvlCheckbox.forEach(e => {
        e.innerHTML = parsedHTML.querySelector(`[data-stock-availability]`).innerHTML;
      }); 
    }

    FacetFiltersForm.renderActiveFacets(parsedHTML);
    FacetFiltersForm.renderAdditionalElements(parsedHTML);

    if (countsToRender) FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
  }

  static renderActiveFacets(html) {
    const activeFacetElementSelectors = ['.active-facets-desktop', '.active-facets-mobile'];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      if( document.querySelector(selector) ){
        document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
      }
    });

    FacetFiltersForm.toggleActiveFacets(false);
  }

  static renderAdditionalElements(html) {
    const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting'];

    mobileElementSelectors.forEach((selector) => {
      if (!html.querySelector(selector)) return;
      document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
    });

    document.getElementById('FacetFiltersFormMobile').closest('menu-drawer').bindEvents();
  }

  static renderCounts(source, target) {
    const targetElement = target.querySelector('.facets__selected');
    const sourceElement = source.querySelector('.facets__selected');

    const targetElementAccessibility = target.querySelector('.facets__summary');
    const sourceElementAccessibility = source.querySelector('.facets__summary');

    if (sourceElement && targetElement) {
      target.querySelector('.facets__selected').outerHTML = source.querySelector('.facets__selected').outerHTML;
    }

    if (targetElementAccessibility && sourceElementAccessibility) {
      target.querySelector('.facets__summary').outerHTML = source.querySelector('.facets__summary').outerHTML;
    }
  }

  static updateURLHash(searchParams, searchParamsTags = [], url = '' ) {
    if ( url == '' ){
      url = window.collection_url;
    }
    if( searchParamsTags.length > 0 ){
      history.pushState({ searchParams }, '', `${url}/${ searchParamsTags.join('+') }${searchParams && '?'.concat(searchParams)}`);      
    }else{
      history.pushState({ searchParams }, '', `${url}${searchParams && '?'.concat(searchParams)}`);
    }
  }

  static getSections() {
    return [
      {
        section: document.getElementById('product-grid').dataset.id
      }
    ];
  }

  createSearchParams(form) {
    const formData = new FormData(form);
    return new URLSearchParams(formData).toString();
  }

  onSubmitForm(searchParams, event) {
    FacetFiltersForm.renderPage(searchParams, event);
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const sortFilterForms = document.querySelectorAll('facet-filters-form form');
    if (event.srcElement.className == 'mobile-facets__checkbox') {
      const searchParams = this.createSearchParams(event.target.closest('form'));
      this.onSubmitForm(searchParams, event);
    } else {
      const forms = [];
      const isMobile = event.target.closest('form').id === 'FacetFiltersFormMobile';
      let tagArray = [];
      sortFilterForms.forEach((form) => {
        if (!isMobile) {
          if (form.id === 'FacetSortForm' || form.id === 'FacetFiltersForm' || form.id === 'FacetSortDrawerForm') {
            const noJsElements = document.querySelectorAll('.no-js-list');
            noJsElements.forEach((el) => el.remove());            
            forms.push(this.createSearchParams(form));            
          }
        } else if (form.id === 'FacetFiltersFormMobile') {
          forms.push(this.createSearchParams(form));
        }
      });
      this.onSubmitForm(forms.join('&'), event);
    }
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    const url =
      event.currentTarget.href.indexOf('?') == -1
        ? ''
        : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
    FacetFiltersForm.renderPage(url, event);
  }


  detectStickyFilterBarEle(){
    const filterBarEle = document.querySelector('[data-facets-bar]');
    if(!filterBarEle) return;
    let totalTopDistance = 0;
    //add dynamic top pixel to sticky filter element
    if(document.querySelector('header')){
      const headerOffset = document.querySelector('header').offsetHeight;
      totalTopDistance += headerOffset;
    }
    if(document.querySelector('.utility-bar.sticky-content')){
      const annoucementBarOffset = document.querySelector('.announcement-bar-section') ? document.querySelector('.announcement-bar-section').offsetHeight : 0;
      totalTopDistance += annoucementBarOffset;
    }
    filterBarEle.style.top = `${totalTopDistance}px`;
  }
  
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

class PriceRange extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll('input').forEach((element) =>
      element.addEventListener('change', this.onRangeChange.bind(this))
    );
    this.setMinAndMaxValues();
  }

  onRangeChange(event) {
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
  }

  setMinAndMaxValues() {
    const inputs = this.querySelectorAll('input');
    const minInput = inputs[0];
    const maxInput = inputs[1];
    if (maxInput.value) minInput.setAttribute('max', maxInput.value);
    if (minInput.value) maxInput.setAttribute('min', minInput.value);
    if (minInput.value === '') maxInput.setAttribute('min', 0);
    if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
  }

  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));

    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }
}

customElements.define('price-range', PriceRange);

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    const facetLink = this.querySelector('a');
    facetLink.setAttribute('role', 'button');
    facetLink.addEventListener('click', this.closeFilter.bind(this));
    facetLink.addEventListener('keyup', (event) => {
      event.preventDefault();
      if (event.code.toUpperCase() === 'SPACE') this.closeFilter(event);
    });
  }

  closeFilter(event) {
    event.preventDefault();
    const form = this.closest('facet-filters-form') || document.querySelector('facet-filters-form');
    form.onActiveFilterClick(event);
  }
}

customElements.define('facet-remove', FacetRemove);


class customSortBy extends HTMLElement {
  constructor() {
    super();

    this.querySelector('.selected-sort').addEventListener('click',(e) => {
      e.preventDefault();
      e.currentTarget.classList.toggle('active');
    });
    
    // this.querySelectorAll('input[type="radio"]').forEach((element) => {
    //   element.addEventListener('change', this.onSortOptionchange.bind(this))
    // });

    //outside click close dropown
    document.addEventListener('click',(e) => {
      if(!e.target.closest('custom-sort-by')){
        this.querySelector('.selected-sort').classList.remove('active');
      }
    });
    
  }

  onSortOptionchange(event){
    event.preventDefault();
    event.stopPropagation();
    const selectedValue = event.target.getAttribute('value');
    const selectEle = event.target.closest('[data-sorting]').querySelector('select[name="sort_by"]');
    if(selectEle){
      selectEle.value = selectedValue;
      selectEle.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}

customElements.define('custom-sort-by', customSortBy);



class customPriceBlocks extends HTMLElement {
  constructor() {
    super();
    this.allInputEle = this.querySelectorAll('input');
    this.querySelectorAll('input').forEach((element) => {
      element.addEventListener('change', this.onPricechange.bind(this))
    });
  }

  onPricechange(event){
    event.preventDefault();
    event.stopPropagation();
    const minValues = [];
    const maxValues = [];
    this.allInputEle.forEach((input) => {
      if(input.checked){
        minValues.push(Number(input.getAttribute('data-min')));
        maxValues.push(Number(input.getAttribute('data-max')));
      }
    });
    let selectedMinValue = '', selectedMaxValue = '';
    if(minValues.length) selectedMinValue = Math.min(...minValues);
    if(maxValues.length) selectedMaxValue = Math.max(...maxValues);

    //console.log('selectedMinValue >>',selectedMinValue, 'selectedMaxValue >>',selectedMaxValue)
    
    const PriceRangeEleMin = document.querySelectorAll('price-range input.min-field');
    const PriceRangeEleMax = document.querySelectorAll('price-range input.max-field');

    if(PriceRangeEleMin.length){
      PriceRangeEleMin.forEach((min) => {
        min.value = selectedMinValue;
      });
    }
    if(PriceRangeEleMax.length){
      PriceRangeEleMax.forEach((max) => {
        max.value = selectedMaxValue;
      });
    }
    
  }
}

customElements.define('custom-price-blocks', customPriceBlocks);



class infiniteCardLoading extends HTMLElement {
  constructor() {
    super();
    
    if(!this.querySelector('[data-loading-type]')) return;
    
    this.loadingType = this.querySelector('[data-loading-type]').dataset.loadingType;
    this.url = this.querySelector('[data-loading-type]').getAttribute('href');
    
    if(this.loadingType == 'click'){
      this.querySelector('[data-loading-type]').addEventListener('click', this.onPaginationChange.bind(this));
    }else{
      this.callbackForViewPort();
    }
  }

  callbackForViewPort(){
    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);
      this.onPaginationChange();
    };
    new IntersectionObserver(handleIntersection.bind(this), { rootMargin: '0px 0px 300px 0px' }).observe(this);
  }

  onPaginationChange(event){
    if(event) event.preventDefault();
    this.querySelector('[data-loading-type]').classList.add('loading');
    this.querySelector('.loading-overlay__spinner').classList.remove('hidden'); // button loader
    const url = this.url.split('?')[1];
    this.renderNewPage(url, null);
  }

  renderNewPage(searchParams, event) {
    let searchPs = [], searchPstag = [], searchPstemp;
    if(searchParams.indexOf('tag') > -1 ){
      if( searchParams.indexOf('&') > -1 ){
        searchPstemp = searchParams.split('&');
        searchPstemp.forEach(function(text){
          if( text.indexOf('tag') > -1 ){
            searchPstag.push(text.split('=')[1]);
          }else{
            searchPs.push(text);
          }
        });
      }
      searchParams = searchPs.join('&');
    }
    
    const sections = FacetFiltersForm.getSections();
    document.getElementById('ProductGridContainer').querySelector('.collection').classList.add('loading');

    const facetFormOnSaleFilter = document.querySelectorAll('.on-sale-filter--input');
    let onSaleChecked = false;
    facetFormOnSaleFilter.forEach(function(saleEle) {
      if (!onSaleChecked && saleEle.querySelector('input').checked){
        onSaleChecked = true; 
      }
    });
    sections.forEach((section) => {    
      const url = searchPstag.length > 0 ? onSaleChecked ? `${window.collection_url}/${ searchPstag.join('+') }?section_id=${section.section}&${searchParams}&view=ajax-onsale` : `${window.collection_url}/${ searchPstag.join('+') }?section_id=${section.section}&${searchParams}`
                  : onSaleChecked ? `${window.collection_url}?section_id=${section.section}&${searchParams}&view=ajax-onsale` : `${window.collection_url}?section_id=${section.section}&${searchParams}`;
      //const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      //console.log('url >>',url)
      this.renderSection(url, event);
    });
    
    if(searchParams.indexOf('page') > -1){
      let url = new URL(window.location.href);
      url.searchParams.delete('page');
      searchParams = url.search.substring(1);      
    }
    FacetFiltersForm.updateURLHash(searchParams, searchPstag);
  }

  renderSection(url, event) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
        FacetFiltersForm.renderFilters(html, event);
        this.renderProductGrid(html);
        FacetFiltersForm.renderProductCount(html);
        if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
      });
  }
  
  renderProductGrid(html) {
    const productCard = document.querySelector('#ProductGridContainer #product-grid');
    const pagination = document.querySelector('#ProductGridContainer .pagination-wrapper');
    const DOM = new DOMParser().parseFromString(html, 'text/html');
    
    productCard.innerHTML += DOM.querySelector('#ProductGridContainer #product-grid').innerHTML;
    pagination.innerHTML = DOM.querySelector('#ProductGridContainer .pagination-wrapper').innerHTML;

    document.querySelectorAll('#ProductGridContainer .scroll-trigger').forEach((element) => {
      element.classList.add('scroll-trigger--cancel');
    });
    
    document.getElementById('ProductGridContainer').querySelector('.collection').classList.remove('loading');
  }

}

customElements.define('ajaxinate-loading', infiniteCardLoading);