// announcement

// mobile only slider grid layout
document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth <= 768) {
    var swiper = new Swiper('.custom-swipe-mobile', {
      slidesPerView: 1,    // You can adjust how many slides you want to show
      spaceBetween: 10,
       navigation: {
        nextEl: ".swiper-ann-btn-next",
        prevEl: ".swiper-ann-btn-prev",
      },
    });
  }
});


// Check if there are more than 1 slide
document.addEventListener('DOMContentLoaded', function() {
  var slideCount = document.querySelectorAll('.announcement_sliers .swiper-slide').length;

  if (slideCount > 1) {
    var swiper = new Swiper(".announcement_sliers", {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-ann-btn-next",
        prevEl: ".swiper-ann-btn-prev",
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        480: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 1,
        },
      },
    });
  } else {
    // Hide arrows if there's only one slide
    document.querySelector('.swiper-ann-btn-prev').style.display = 'none';
    document.querySelector('.swiper-ann-btn-next').style.display = 'none';
  }
});

 
// end announcement

var swiper = new Swiper(".custom-switch-set", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});


var swiper = new Swiper(".custom-cart-recomm", {
  slidesPerView: 4,  
  spaceBetween: 0, 
  navigation: {
    nextEl: ".re-col-slide-next",
    prevEl: ".re-col-slide-prev",
  },
  breakpoints: {
   
    320: {
      slidesPerView: 1.5,
    },
  
    480:{ 
      slidesPerView: 2.5,
    },
   
    768: {
      slidesPerView: 3,
    },
  },
});





var swiper = new Swiper(".custom-cart-recomm", {
  slidesPerView: 4,  
  spaceBetween: 0, 
  navigation: {
    nextEl: ".fea-col-slide-next",
    prevEl: ".fea-col-slide-prev",
  },
  breakpoints: {
   
    320: {
      slidesPerView: 1.5,
    },
  
    480: {
      slidesPerView: 2.5,
    },
   
    768: {
      slidesPerView: 3,
    },
  },
});


var swiper = new Swiper(".videoswiper", {
  slidesPerView: 2,  
  spaceBetween: 32, 
  navigation: {
    nextEl: ".fea-col-slide-next",
    prevEl: ".fea-col-slide-prev",
  },
  breakpoints: {
   
    320: {
      slidesPerView: 1,
      spaceBetween: 10
    },
  
    580: {
      slidesPerView: 2,
      spaceBetween: 10
    },
   
    768: {
      slidesPerView: 2,
    },
  },
});

var swiper = new Swiper(".videoswiper1", {
  slidesPerView: 2,  
  spaceBetween: 32, 
  navigation: {
    nextEl: ".fea-col-slide-next",
    prevEl: ".fea-col-slide-prev",
  },
  breakpoints: {
   
    320: {
      slidesPerView: 1,
      spaceBetween: 10
    },
  
    580: {
      slidesPerView: 2,
      spaceBetween: 10
    },
   
    768: {
      slidesPerView: 3,
    },
       1200: {
      slidesPerView: 4,
    },
  },
});

var swiper = new Swiper(".videoswiper2", {
  slidesPerView: 'auto', // Allows dynamic adjustment to show partial slides
  spaceBetween: 10, 
  loop: true,

  initialSlide: 1,
  navigation: {
    nextEl: ".fea-col-slide-next",
    prevEl: ".fea-col-slide-prev",
  },
  breakpoints: {
    420: {
      slidesPerView: 1, // Show 2.5 slides on medium screens
    },
    480: {
      slidesPerView: 2, // Show 2.5 slides on medium screens
    },
    768: {
      slidesPerView: 3.5, // Show 3.5 slides on tablets
    },
    1200: {
      slidesPerView: 4, // Show 4 slides fully in the center
    },
  },
});


// Home-Blog Post section by customize select blog and recepies direct.

document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.home-blog-posts .tab-titles li');
  const panels = document.querySelectorAll('.home-blog-posts .tab-panel');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      // Remove active class from all tabs and panels
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(panel => panel.classList.remove('active'));
  
      // Add active class to the clicked tab and corresponding panel
      this.classList.add('active');
      var tab_id = this.querySelector('a').getAttribute('data-tab');
      document.getElementById(tab_id).classList.add('active');
    });
  });
});

//blog artical home upper by customize

document.querySelectorAll('.article-tab a').forEach(tabLink => {
  tabLink.addEventListener('click', function(event) {
    event.preventDefault();

    // Remove active class from all tabs
    document.querySelectorAll('.article-tab li').forEach(li => li.classList.remove('active'));

    // Add active class to clicked tab
    this.parentElement.classList.add('active');

    // Hide all content sections
    document.querySelectorAll('.article-content > div').forEach(section => section.style.display = 'none');

    // Show the selected tab content
    const activeTab = this.dataset.tab;
    document.querySelector(`.${activeTab}-content`).style.display = 'block';
  });
});

// Default to show the articles tab
if(document.querySelector('.articles-content')){
document.querySelector('.articles-content').style.display = 'block';
}

// footer mobile menu start -------

$(document).ready(function(){
  // Function to run only for mobile view (768px or less)
  function handleMobileMenu() {
    if ($(window).width() <= 768) {
      // Close all menus initially
      $(".ab-footer-linklist").hide();

      // When an arrow is clicked
      $(".ab-icon-arrow").off('click').on('click', function(){
        // Get the clicked menu
        var menu = $(this).closest('.footer-menu-block').find('.ab-footer-linklist');

        // If the clicked menu is already open, close it
        if(menu.is(':visible')){
          menu.slideUp();
          $(this).removeClass('rotate-arrow'); // Remove rotation on close
        } 
        // If the clicked menu is closed, close all other menus and open this one
        else {
          $(".ab-footer-linklist").slideUp(); // Close all menus
          $(".ab-icon-arrow").removeClass('rotate-arrow'); // Reset rotation for all arrows
          menu.slideDown(); // Open the clicked menu
          $(this).addClass('rotate-arrow'); // Apply rotation to the clicked arrow
        }

        // Manage active-menu class on body or blocks if needed
        $("body").toggleClass("active-menu", menu.is(':visible'));
      });
    } else {
      // If screen is larger than 768px, reset any applied styles
      $(".ab-footer-linklist").show(); // Keep menus open on larger screens
      $(".ab-icon-arrow").removeClass('rotate-arrow'); // Reset any rotations
    }
  }

  // Run on page load
  handleMobileMenu();

  // Re-check when the window is resized
  $(window).resize(function(){
    handleMobileMenu();
  });
});



// footer mobile menu end -----

 /*$(document).ready(function(){
  $('.video-slider').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
});*/


$(document).ready(function () {

  lazyLoadVideos();
  
  /*START -- Announcement bar*/
  var announcementBar = document.querySelector("[data-slider-announcement-bar]") || null;
  if (announcementBar) {
    announcementBarSlider();
  }
  /*END -- Announcement bar*/

  /*START -- Navigation menu*/
  $(document).on("mouseenter", "header-menu details", function (e) {
    $("header-menu details").removeAttr("open");
    $(this).attr("open", "");
  });
  // header.header .header__inline-menu>ul .mega-menu__content
  $(document).on("mouseleave", "header-menu details", function (e) {
    $("header-menu details").removeAttr("open");
  });
  $(document).mouseleave(function (e) {
    $("header-menu details").removeAttr("open");
  });
  /*END -- Navigation menu*/

  //footer accordion
  if ($(window).width() <= 749) {
    $(document).on("click","[data-footer-accordion] [data-footer-head]",function () {
        $(this).closest("[data-footer-accordion]").siblings().removeClass("active").find("[data-footer-accordion-content]").slideUp();
        $(this).closest("[data-footer-accordion]").toggleClass("active").find("[data-footer-accordion-content]").slideToggle();
    });
  }

  // START template -- index [ HOMEPAGE ]
  if (document.body.classList.contains("template-index")) {
    // section ==> home-featured-collection.liquid
    var proF_c_carousel = document.querySelector(".products-carousel [data-featured-collection-slider]") || null;
    if (proF_c_carousel && document.body.clientWidth > 989) {
      proFeaturedCollectionCarousel();
      // if(proF_c_carousel) proFeaturedCollectionCarousel();
    }

    // section ==> home-hero.liquid
    var heroSection = document.querySelector(".hero-section [data-hero-section]") || null;
    if (heroSection) {
      heroSectionSlider();
    }

    // section ==> scrollable-bar.liquid
    var marqueeSection = document.querySelector("[data-marquee-slider]") || null;
    if (marqueeSection) {
      marqueeSlider();
    }

    // section ==> multiple-collections.liquid
    var multiColls = document.querySelector("[data-multi-collections-slider]") || null;
    if (multiColls && document.body.clientWidth > 989) {
      multiCollections();
    }
  }
  // END template -- index [ HOMEPAGE ]

  // START template -- [ Product page ]
  if (document.body.classList.contains("template-product")) {
    
    // section ==> product-lookbook.liquid
    var proF_c_carousel = document.querySelector(".products-carousel [data-featured-product-lookbook]") || null;
    if (proF_c_carousel && document.body.clientWidth > 989) {
      proFeaturedLookBookCarousel();
    }
    
    
    //accordion
    toggleAccordion();
    
    //slider in product page
    styleWithSlider();
    $(document).on('click', '.review_bedge', function(e) {
      e.preventDefault();
       $("html,body").animate({ scrollTop: $("#judgeme_product_reviews").offset().top - 40 },"slow");
    });
  }
  // END template -- [ Product page ]

  // START template -- [ Customers Register ]
  if (document.body.classList.contains("template-customers-register") || document.body.classList.contains("template-customers-login") || document.body.classList.contains("template-customers-account")) {
    var prosCarousel = document.querySelector(".products-carousel [data-featured-collection-slider]") || null;
    if (prosCarousel && document.body.clientWidth > 989) {
      proFeaturedCollectionCarousel();
    }
  }
  // END template -- [ Customers Register ]

  //faq page & returns-exchanges
  if ($(".template-page.faq").length || $(".template-page.returns-exchanges").length) {
    // faq search
    $(document).on("keyup", "#sidebar-faq-search", function () {
      var q = $(this).val().toLowerCase();
      if (q.length >= 3) {
        $("[data-content]").addClass("hidden");
        $("[data-content*='" + q + "']").removeClass("hidden");

        $("[data-content*='" + q + "'].faq-qa-btn").closest("[data-faq-row]").addClass("active").find("[data-faq-title]").removeClass("hidden");
        $("[data-content*='" + q + "'].faq-qa-btn").closest("[data-faq-row]").find("[data-faq-qa-list]").slideDown();
        $("[data-content*='" + q + "'].faq-qa-btn").closest("[data-faq-question-wrap]").removeClass("hidden");

        $("[data-content*='" + q + "'].faq-title").closest("[data-faq-row]").find("[data-faq-qa-list] [data-faq-question-wrap]").removeClass("hidden");
        $("[data-content*='" + q + "'].faq-title").closest("[data-faq-row]").find("[data-faq-qa-list] [data-faq-question-wrap] [data-faq-question]").removeClass("hidden");

        $("[data-content*='" + q + "'].faq-qa-wrap").closest("[data-faq-row]").find("[data-faq-title]").removeClass("hidden");
        $("[data-content*='" + q + "'].faq-qa-wrap").closest("[data-faq-row]").addClass("active").find("[data-faq-qa-list]").slideDown();
        $("[data-content*='" + q + "'].faq-qa-wrap").find("[data-faq-question]").removeClass("hidden");
        $("[data-content*='" + q + "'].faq-qa-wrap").addClass("active").find("[data-faq-ans]").slideDown();

        // console.log("qa",$("[data-content*='" + q + "']"));
      } else {
        $("[data-content]").removeClass("hidden");
      }
    });

    // faq category show/hide
    $(document).on("click", "[data-faq-category]", function (e) {
      //remove hidden class and set blank search input
      e.preventDefault();
      var header = $("sticky-header").outerHeight(true) || 0;
      var id = $(this).attr("href");
      $("html, body").stop();
      $("html, body").animate({scrollTop: $(id).offset().top - header - 23},200);
      $("[data-content]").removeClass("hidden");
      $(".faq-content-wrapper #sidebar-faq-search").val("");
    });

    //faq questions/answer toggle
    $(document).on("click","[data-faq-question-wrap] [data-faq-question]",function () {
        $(this).closest(".faq-row").siblings().find("[data-faq-question-wrap]").removeClass("active").find("[data-faq-ans]").slideUp();
        $(this).closest("[data-faq-question-wrap]").siblings().removeClass("active").find("[data-faq-ans]").slideUp();
        $(this).closest("[data-faq-question-wrap]").toggleClass("active").find("[data-faq-ans]").slideToggle();
      }
    );

    // faq category title click
    $(document).on("click", "[data-faq-title]", function () {
      // $(this).closest("[data-faq-row]").siblings().removeClass("active").find("[data-faq-qa-list]").slideUp();
      $(this).closest("[data-faq-row]").toggleClass("active").find("[data-faq-qa-list]").slideToggle();
    });
  }
  // && faq page & returns-exchanges

  // START template -- gift-guide [ Mother's Day Gift Guide ]
  if (document.body.classList.contains("template-page") && document.body.classList.contains("gift-guide")) {
    // section ==> home-featured-collection.liquid
    var proF_c_carousel = document.querySelector(".products-carousel [data-featured-collection-slider]") || null;
    if (proF_c_carousel && document.body.clientWidth > 989) {
      proFeaturedCollectionCarousel();
    }

    // section ==> msd-collection-feature.liquid
    var msd = document.querySelector(".msd-collection-feature[data-msd-collection-feature-slider]") || null;
    if (msd && document.body.clientWidth > 989) {
      msdCollectionFeature();
    }
  }
  // END template -- gift-guide [ Mother's Day Gift Guide ]
    
  // START template -- collection
  if ($(".template-collection").length){
   collectionTopCategory(); 
  }
  // END template -- collection  

  // START template -- lookbook [ lookbook ]
  if (document.body.classList.contains("lookbook")) {
    // section ==> home-featured-collection.liquid
    var proF_c_carousel = document.querySelector(".products-carousel [data-featured-collection-slider]") || null;
    if (proF_c_carousel && document.body.clientWidth > 989) {
      proFeaturedCollectionCarousel();      
    }
  }
  // END template -- lookbook
  
});

function tabItems(){
  const tabItems = document.querySelectorAll('.makro-proGrid-section .tab-item');
  const tabContents = document.querySelectorAll('.makro-proGrid-section .tab-content');

  tabItems.forEach(tab => {
    tab.addEventListener('click', function() {
      /*// Remove active class from all tab-items*/
      tabItems.forEach(item => item.classList.remove('active'));

      /*// Add active class to the clicked tab-item*/
      this.classList.add('active');

      /*// Get the data-id of the clicked tab-item*/
      const selectedTab = this.getAttribute('data-id');

      /*// Remove active class from all tab-contents*/
      tabContents.forEach(content => { content.classList.remove('actived'); content.classList.remove('active'); });

      /*// Add active class to the corresponding tab-content*/
      document.getElementById(selectedTab).classList.add('active');
      setTimeout(function(){ document.getElementById(selectedTab).classList.add('actived'); },100);
    });
  });  
  return;
}

document.addEventListener('DOMContentLoaded', function() {
  tabItems();
});
/* makro-title-product-grid.liquid */


/*--------------- collection page swatch hover change main image code ---------------*/
if(document.querySelectorAll('.variants.metaSwatch li').length){
  document.querySelectorAll('.variants.metaSwatch li').forEach((grid_li) =>{
      grid_li.onmouseout = function(event) {
         grid_li.closest('.card').querySelector('.card__inner .card__media .media .hover-img').remove();
      };
      grid_li.onmouseover = function(event) {
          var img_src = grid_li.getAttribute('data-image');
          let mainISize = grid_li.getAttribute('data-main-img-size');
          let imgSizes = grid_li.getAttribute('data-img-sizes');
          let srcSet = [];
          if( imgSizes ){
            imgSizes = imgSizes.split(',');
            let srcSet = imgSizes.map((img, index) => {
              var _size = `width=${ img }`;
               return `${ img_src.replace('width=1', _size )} ${ img }w`
            });            
            srcSet = srcSet.join(', ') + `, ${img_src.replace('&width=1', '' )} ${mainISize}w`;
            grid_li.closest('.card').querySelector('.card__inner .card__media .media').innerHTML = 
              grid_li.closest('.card').querySelector('.card__inner .card__media .media').innerHTML +`<img class="hover-img" srcset="${srcSet}" sizes="${ grid_li.closest('.card').querySelector('.card__inner .card__media .media img').getAttribute('sizes') }" >`;
          }
          
      };
  });  
}
/*--------------- collection page swatch hover change main image code END ---------------*/

function announcementBarSlider() {
  var mySwiper = new Swiper("[data-slider-announcement-bar]", {
    direction: "vertical",
    slidesPerView: 1,
    spaceBetween: 0,
    allowTouchMove: false,
    speed: 700,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".slider-button--next",
      prevEl: ".slider-button--prev",
    },
    on:{
      init: function () {        
        var _this = this;
        if( this.el != null && this.el.querySelector('.swiper-slide-active') != null ){
          if( this.el.querySelector('.swiper-slide-active').getAttribute('data-background-color') != null ){            
            _this.el.querySelector('.swiper-slide-active').closest('.utility-bar').style.setProperty('--gradient-background', _this.el.querySelector('.swiper-slide-active').getAttribute('data-background-color'));            
          }
        }
      },
      slideChangeTransitionStart: function(){
        var _this = this;
        if( this.el != null && this.el.querySelector('.swiper-slide-active') != null ){
          if( this.el.querySelector('.swiper-slide-active').getAttribute('data-background-color') != null ){            
            _this.el.querySelector('.swiper-slide-active').closest('.utility-bar').style.setProperty('--gradient-background', _this.el.querySelector('.swiper-slide-active').getAttribute('data-background-color'));            
          }
        }    
      },
      slideChangeTransitionEnd: function(){
        var _this = this;
        if( this.el != null && this.el.querySelector('.swiper-slide-active') != null ){
          if( this.el.querySelector('.swiper-slide-active').getAttribute('data-background-color') == null ){            
            _this.el.querySelector('.swiper-slide-active').closest('.utility-bar').style.setProperty('--gradient-background', '');            
          }
        }    
      }
    }
  });
}

function proFeaturedCollectionCarousel() {
  let spaceBetween = 2;
  if( document.querySelector('.lookbook-collection-list') ){
    spaceBetween = 4;
  } 
  var mySwiper = new Swiper("[data-featured-collection-slider]", {
    // loop: true,
    slidesPerView: 3,
    spaceBetween: spaceBetween,
    slidesPerGroup: 3,
    speed: 900,
    // cssMode: true,
    // mousewheel: true,
    navigation: {
      nextEl: ".fea-col-slide-next",
      prevEl: ".fea-col-slide-prev",
    },
    breakpoints: {
      1200: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        // speed: 700
      },
    },
  });
}

function proFeaturedLookBookCarousel() {  
  var mySwiper = new Swiper("[data-featured-product-lookbook]", {
    // loop: true,
    slidesPerView: 'auto',
    spaceBetween: 4,
    slidesPerGroup: 1,
    speed: 700,
    // cssMode: true,
    // mousewheel: true,
    navigation: {
      nextEl: ".fea-col-slide-next",
      prevEl: ".fea-col-slide-prev",
    },
    breakpoints: {
      1200: {
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        // speed: 700
      },
    },
  });
}

function heroSectionSlider() {
  var heroSec = new Swiper("[data-hero-section]", {
    loop: true,
    // allowTouchMove: false,true,
    longSwipes: false,
    slidesPerView: 1,
    speed: 300,
    navigation: {
      nextEl: ".btn-next",
      prevEl: ".btn-prev",
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    navigation: {
      nextEl: ".hero-nav-btn.btn-next",
      prevEl: ".hero-nav-btn.btn-prev",
    },
  });

  if (heroSec.length) {
    heroSec.forEach((section) => function () {
      section.on("slideChange", function () {
        if (
          section.wrapperEl.querySelectorAll(".slideshow__slide").length > 1
        ) {
          var videoHolders = section.wrapperEl.querySelectorAll(".slideshow__slide video-holder");
          if (videoHolders) {
            videoHolders.forEach((videoWrap) => {
              var videoEle = videoWrap.querySelector(".video") || null;

              setTimeout(function () {
                if (videoEle) {
                  var videoUrl = videoWrap.querySelector("[data-src]").dataset.src;
                  if (videoEle.nodeName == "VIDEO") {
                    videoEle.querySelector("source").setAttribute("src", videoUrl);
                    videoEle.pause();
                  } else {
                    videoEle.setAttribute("src", videoUrl);
                  }
                  videoWrap.classList.remove("active");
                }
              }, 300);
            });
          }
        }
      });
    });
  } else {
    heroSec.on("slideChange", function () {
      var autoplayVid = heroSec.wrapperEl.querySelectorAll(".slideshow__slide .autoplay-true");
      autoplayVid.forEach((vid) => {
        if (vid.nodeName == "VIDEO") {
          vid.pause();
        } else {
          var src = vid.getAttribute("src");
          vid.removeAttribute("src");
          if (!vid.hasAttribute("data-src")) {
            vid.setAttribute("data-src", src);
          }
        }
      });

      var videoHolders = heroSec.wrapperEl.querySelectorAll(".slideshow__slide video-holder");
      if (videoHolders) {
        videoHolders.forEach((videoWrap) => {
          var videoEle = videoWrap.querySelector(".video") || null;

          setTimeout(function () {
            if (videoEle) {
              if (videoEle.nodeName == "VIDEO") {
                // videoEle.querySelector('source').setAttribute('src',videoUrl);
                videoEle.pause();
              } else {
                var videoUrl =
                  videoWrap.querySelector("[data-src]").dataset.src;
                videoEle.setAttribute("src", videoUrl);
              }
              videoWrap.classList.remove("active");
            }
          }, 300);
        });
      }

      setTimeout(function () {
        var activeSlidesWrap = heroSec.wrapperEl.querySelectorAll(".slideshow__slide.swiper-slide-active .autoplay-true");
        if (activeSlidesWrap.length) {
          activeSlidesWrap.forEach((activeSlide_vid) => {
            if (activeSlide_vid.nodeName == "VIDEO") {
              activeSlide_vid.play();
            } else {
              var src = activeSlide_vid.getAttribute("data-src");
              // vid.removeAttribute("src");
              activeSlide_vid.setAttribute("src", src);
            }
          });
        }
      }, 200);
    });
  }
}

// marquee slider -- scrollable-bar.liquid
function marqueeSlider() {
  let SwiperTop = new Swiper("[data-marquee-slider]", {
    spaceBetween: 0,
    centeredSlides: true,
    speed: 5000,
    autoplay: {
      delay: 0,
    },
    loop: true,
    slidesPerView: "auto",
    allowTouchMove: false,
    disableOnInteraction: true,
  });
}

// multiple-collections.liquid
function multiCollections() {
  var multiColls = new Swiper("[data-multi-collections-slider]", {
    loop: true,
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: 2,
    speed: 900,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      type: "fraction",
    },
  });
}

// msd-collection-feature.liquid
function msdCollectionFeature() {
  var multiColls = new Swiper("[data-msd-collection-feature-slider]", {
    loop: true,
    // allowTouchMove: false,true,
    longSwipes: false,
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: 2,
    speed: 900,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      type: "fraction",
    },
  });
}

// collection-top-category.liquid
function collectionTopCategory() {
  let categorySlider = new Swiper(".collection-top-category [data-collection-category-slider]", {
    slidesPerView: 2.7,
    slidesPerGroup: 1,
    spaceBetween: 6,
    freeMode: true,
    loop: true,
    speed: 600,
    navigation: {
      nextEl: ".collection-top-category .swiper-button--next",
      prevEl: ".collection-top-category .swiper-button--prev"
    },
    breakpoints: {
      750: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        speed: 600,
        freeMode: false
      },
      990: {
        slidesPerView: 5,
        slidesPerGroup: 5,
        speed: 700,
        freeMode: false
      },
      1200: {
        slidesPerView: 6,
        slidesPerGroup: 6,
        speed: 800,
        freeMode: false
      },
      1500: {
        slidesPerView: 8,
        slidesPerGroup: 8,
        speed: 900,
        freeMode: false
      }
    },
    on: {
      init: function loopBagFix(swiper){
        if(swiper.params.loop){
          /* Add a copy of the slides */
          const slides = swiper.slides
          const wrapper = swiper.wrapperEl
          slides.forEach( (slide) => {wrapper.append(slide.cloneNode(true))} )  
        }
      }
    }
  });
}

// hero section <video-holder> JS
class videoGroup extends HTMLElement {
  constructor() {
    super();
    this.observeVideoElemenentViewPort();
  }

  observeVideoElemenentViewPort() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const intersecting = entry.isIntersecting;
        if (intersecting) {
          const targetVisibleEle = entry.target;
          setTimeout(() => {
            this.initVideo(targetVisibleEle);
          }, 150);
          observer.unobserve(targetVisibleEle);
        }
      });
    });
    observer.observe(this);
  }

  initVideo(target, windowWidth = document.body.getBoundingClientRect().width) {
    const figureEle = target.querySelector("figure");
    const videoEle = target.querySelector(".video");

    if (videoEle) {
      //iframe with no autoplay [ thumb click to play ]
      if (figureEle) {
        var temp = 0;
        figureEle.addEventListener("click", () => {
          if (temp == 0) {
            temp = 1;
            if (videoEle.nodeName == "VIDEO") {
              setTimeout(() => {
                // videoEle.load();
                videoEle.play();
              });
            } else {
              target
                .querySelector("iframe")
                .setAttribute(
                  "src",
                  target.querySelector("[data-src]").dataset.src
                );
            }
            target.classList.add("active");
          } else {
            temp = 0;
            target.classList.remove("active");
            if (videoEle.nodeName == "VIDEO") {
              videoEle.pause();
            } else {
              videoEle.removeAttribute("src");
            }
          }
        });
      }
    }
  }
}
customElements.define("video-holder", videoGroup);

function styleWithSlider() {
  var mySwiper = new Swiper("[data-style-with-slider]", {
    slidesPerView: 2,
    spaceBetween: 10,
    navigation: {
      nextEl: ".slide-button-next",
      prevEl: ".slide-button-prev"
    }
  });
}

function toggleAccordion() {
  $(document).on("click", ".product__accordion .accordion-title", function(e) {
    e.preventDefault();
    var accItem = $(this).closest('.product__accordion').find('.accordion-item');
    var accBody = $(this).closest('.product__accordion').find('.accordion-body');
    if (accItem.hasClass("accordion-open")) {
      accItem.removeClass("accordion-open");
      accBody.slideUp(500);
    } else{
      $(".product__accordion .accordion-item").removeClass("accordion-open");
      accItem.addClass("accordion-open");
      $(".accordion-body").slideUp(500);
      accBody.slideDown(500);
    }
  });
}

function toggleFilterAccordion(element) {
  const openClass = "tab--open";
  const mainParent = document.querySelectorAll(".mobile-facets__main .mobile-facets__details");
  const currentParent = element.closest(".mobile-facets__details");
  const content = currentParent.querySelector(".mobile-facets__submenu");

  if (currentParent.classList.contains(openClass)) {
    currentParent.classList.remove(openClass);
    currentParent.querySelector(".mobile-facets__submenu").style.maxHeight = "0px";
  } else {
    mainParent.forEach((e) => {
      if (e.classList.contains(openClass)) {
        e.classList.remove(openClass);
        e.querySelector(".mobile-facets__submenu").style.maxHeight = "0px";
      }
    });
    currentParent.classList.add(openClass);
    content.style.maxHeight = `${content.scrollHeight + 10}px`;
  }
}

function lazyLoadVideos() {
  var lazyVideos = [].slice.call(document.querySelectorAll(".vid-lazyload"));
  if(!lazyVideos.length) return;
  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
              videoSource.removeAttribute('data-src');
              videoSource.closest('video').classList.remove('vid-lazyload');
              if(videoSource.closest('video').querySelector('img')){
                videoSource.closest('video').querySelector('img').remove();
              }
            }
          }
          video.target.load();
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });
    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
}

/* lookbook temp */
if( document.querySelector('body.lookbook') ){
document.addEventListener('click', function(event){
  let target = event.target; 
  if( document.querySelector('.lookbook-popup.active') ){
    if( target.closest('.lookbook-popup') ){      
    } else {
      document.querySelectorAll('.lookbook-popup>.button.active').forEach(ele => ele.classList.remove('active'));
      document.querySelectorAll('.lookbook-popup.active').forEach(ele => ele.classList.remove('active'));      
    }    
  }
});
}
function showLookBookPopup(event, element, parent = false) {
  let eventType = event.type;
  if(eventType == "mouseenter" && window.innerWidth < 750 ) return false;
  if(eventType == "click" && element.classList.contains('mouseEvent')) return false;  
  
  if( parent == true ){
    if( element.closest('.lookbook-popup-title') ){
      element = element.closest('.lookbook-popup').querySelector('button.button');
    }else{
      element = element.querySelector('button.button');
    }    
  }
  let contentParent = element.closest('.lookbook-popup');
  if(eventType == "mouseenter" && event.sourceCapabilities.firesTouchEvents == false){
    element.classList.add('mouseEvent');
  }  
  if( element.classList.contains('active') ){
    element.classList.remove('active');
    contentParent.classList.remove('active');
    if( window.innerWidth < 750 ){
      document.querySelector('body').classList.remove('show-lookbook-popup');
    }
  }else{
    document.querySelectorAll('.lookbook-popup>.button.active').forEach(ele => ele.classList.remove('active'));
    document.querySelectorAll('.lookbook-popup.active').forEach(ele => ele.classList.remove('active'));
    element.classList.add('active');
    contentParent.classList.add('active');
    let pparentOff = element.closest('.lookbook-image').offsetLeft;
    let parentOff = contentParent.offsetLeft;
    if( parentOff <= 0 & pparentOff <= 0 ){
      contentParent.classList.add('content-overflowed');
      contentParent.querySelector('.lookbook-popup-gird').style.left = ((parentOff * -1) + 20) + 'px';
    }
    if( window.innerWidth < 750 ){
      document.querySelector('body').classList.add('show-lookbook-popup');
    }
  }
  
  if(eventType == "mouseleave" && event.sourceCapabilities.firesTouchEvents == false){
    element.classList.remove('mouseEvent');
  }
  return false;
}
/* lookbook temp */


/* ***This will only render in the theme editor / customiser***** */
if (Shopify.designMode) {
  document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("shopify:section:load", function () {
      const proCarousel = event.target.closest(".products-carousel") || null;
      if (proCarousel) {
        proFeaturedCollectionCarousel();
      }

      const heroSection = event.target.closest(".hero-section") || null;
      if (heroSection) {
        heroSectionSlider();
      }

      const collCategorySection = event.target.closest(".collection-top-category") || null;
      if (collCategorySection) {
        collectionTopCategory();
      }

      // section ==> scrollable-bar.liquid
      var marqueeSection = event.target.closest("[data-marquee-slider]") || null;
      if (marqueeSection) marqueeSlider();

      // section ==> multiple-collections.liquid
      var multiColls = event.target.closest("[data-multi-collections-slider]") || null;
      if (multiColls && document.body.clientWidth > 989) {
        multiCollections();
      }

      //section ==> msd-collection-feature.liquid
      var proF_c_carousel = event.target.closest("[data-msd-collection-feature-slider]") || null;
      if (proF_c_carousel && document.body.clientWidth > 989) {
        msdCollectionFeature();
      }
      
      //section ==> msd-collection-feature.liquid
      var tab_item = event.target.closest(".shopify-section").querySelectorAll('.tab-item') || null;
      if (tab_item) {
        tabItems();
      }
    });
  });
}