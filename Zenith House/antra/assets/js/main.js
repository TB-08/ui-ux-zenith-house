(function ($) {
  "use strict";

  // Get Device width
  var device_width = window.innerWidth;

  /*======================================
        Preloader activation
    ========================================*/
  function textAnimationEffect() {
    let TextAnim = gsap.timeline();
    let splitText = new SplitType(".text-animation-effect", { types: "chars" });
    if ($(".text-animation-effect .char").length) {
      TextAnim.from(
        ".text-animation-effect .char",
        { duration: 1, x: 50, autoAlpha: 0, stagger: 0.1 },
        "-=1",
      );
    }
  }

  /* ===============================
        Smooth Preloader
        ================================*/

  var innerBars = document.querySelectorAll(".inner-bar");
  var increment = 0;

  function animateBars() {
    /* loading bar animation */
    for (var i = 0; i < 2; i++) {
      var randomWidth = Math.floor(Math.random() * 101);

      gsap.to(innerBars[i + increment], {
        width: randomWidth + "%",
        duration: 0.5,
        ease: "none",
      });
    }

    setTimeout(function () {
      for (var i = 0; i < 2; i++) {
        gsap.to(innerBars[i + increment], {
          width: "100%",
          duration: 0.5,
          ease: "none",
        });
      }

      increment += 2;

      if (increment < innerBars.length) {
        animateBars();
      } else {
        /* ===================================
               PRELOADER EXIT TIMELINE
            =================================== */

        var preloaderTL = gsap.timeline();

        /* 1️⃣ fade out preloader smoothly */
        preloaderTL.to(".preloader", {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });

        /* 2️⃣ START SLIDER AFTER PRELOAD  ⭐ IMPORTANT */
        preloaderTL.call(function () {
          if (window.startSliderAfterPreload) {
            window.startSliderAfterPreload();
          }
        });

        /* 3️⃣ remove preloader completely */
        preloaderTL.set(".preloader", {
          display: "none",
        });

        /* ===================================
               OPTIONAL TEXT ANIMATION
            =================================== */

        let splitText = new SplitType(".text-animation-effect", {
          types: "chars",
        });

        if (document.querySelectorAll(".text-animation-effect .char").length) {
          preloaderTL.from(
            ".text-animation-effect .char",
            {
              duration: 1.2,
              y: 40,
              autoAlpha: 0,
              stagger: 0.05,
              ease: "power2.out",
            },
            "-=0.5",
          );
        }
      }
    }, 200);
  }

  /* start preloader */
  animateBars();

  // Panorama Image
  var panorama, panoViewer, panoContainer;
  panoContainer = document.querySelector(".antra-panoroma-img");

  if (panoContainer) {
    var antraData = $(".antra-panoroma-img").data("img");
    panorama = new PANOLENS.ImagePanorama(antraData);
    panoViewer = new PANOLENS.Viewer({ container: panoContainer });
    panoViewer.add(panorama);
  }

  $(window).on("load", function () {
    animateBars();
    setTimeout(function () {
      $(".preloader").remove();
    }, 3000);
  });

  $(document).ready(function () {
    // Image Comparison Slider
    $(".antra-image-comparison").twentytwenty({
      default_offset_pct: 0.5,
      orientation: "horizontal",
      no_overlay: true,
      move_slider_on_hover: true,
      move_with_handle_only: false,
      click_to_move: false,
    });

    if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
      $("body").addClass("firefox");
    }

    var header = $(".header"),
      stickyHeader = $(".primary-header");

    function setHeaderHeight() {
      if (header.length > 0) {
        var setHeight = document.querySelector(".header").offsetHeight;
        header.css({ height: setHeight + "px" });
      }
    }

    function menuSticky() {
      $(window)
        .off("scroll.sticky")
        .on("scroll.sticky", function () {
          var scroll = $(window).scrollTop();
          if (scroll >= 110) {
            stickyHeader.addClass("fixed");
          } else {
            stickyHeader.removeClass("fixed");
          }
        });
    }

    // Init on page load
    if (header.hasClass("sticky-active")) {
      setHeaderHeight();
      menuSticky();
    }

    // Re-evaluate on resize (handles orientation change too)
    $(window).on("resize", function () {
      if (header.hasClass("sticky-active")) {
        setHeaderHeight();
      }
    });

    //Mobile Menu Js
    if ($(".mobile-menu-items").length) {
      $(".mobile-menu-items").meanmenu({
        meanMenuContainer: ".side-menu-wrap",
        meanScreenWidth: "992",
        meanMenuCloseSize: "30px",
        meanExpand: ['<i class="fa-solid fa-caret-down"></i>'],
      });
    }

    // Mobile Sidemenu
    $(".mobile-side-menu-toggle").on("click", function () {
      $(".mobile-side-menu, .mobile-side-menu-overlay").toggleClass("is-open");
    });

    $(".mobile-side-menu-close, .mobile-side-menu-overlay").on(
      "click",
      function () {
        $(".mobile-side-menu, .mobile-side-menu-overlay").removeClass(
          "is-open",
        );
      },
    );

    // Popup Search Box
    $(function () {
      $("#popup-search-box").removeClass("toggled");

      $(".dl-search-icon").on("click", function (e) {
        e.stopPropagation();
        $("#popup-search-box").toggleClass("toggled");
        $("#popup-search").focus();
      });

      $("#popup-search-box input").on("click", function (e) {
        e.stopPropagation();
      });

      $("#popup-search-box, body").on("click", function () {
        $("#popup-search-box").removeClass("toggled");
      });
    });

    // Popup Sidebox
    function sideBox() {
      $("body").removeClass("open-sidebar");
      $(document).on("click", ".sidebar-trigger", function (e) {
        e.preventDefault();
        $("body").toggleClass("open-sidebar");
      });
      $(document).on(
        "click",
        ".sidebar-trigger.close, #sidebar-overlay",
        function (e) {
          e.preventDefault();
          $("body.open-sidebar").removeClass("open-sidebar");
        },
      );
    }

    sideBox();

    // Venobox Video

    function venoboxInit() {}
    new VenoBox({
      selector: ".video-popup, .img-popup, .venobox",
      bgcolor: "transparent",
      // overlayColor: "transparent",
      numeration: true,
      infinigall: true,
      spinner: "plane",
    });
    venoboxInit();

    // Data Background
    $("[data-background").each(function () {
      $(this).css(
        "background-image",
        "url( " + $(this).attr("data-background") + "  )",
      );
    });

    // Custom Cursor
    function customCursor(viewSelector = ".antra-hover-view") {
      $("body").append('<div class="mt-cursor"></div>');
      $("body").append('<div class="mt-cursor-view"></div>');

      const cursor = $(".mt-cursor");
      const viewButton = $(".mt-cursor-view");

      let targetX = 0;
      let targetY = 0;
      let cursorX = 0;
      let cursorY = 0;
      let viewX = 0;
      let viewY = 0;
      let rafId = null;
      let running = false;

      function animate() {
        if (!running) return;
        cursorX += (targetX - cursorX) * 0.35;
        cursorY += (targetY - cursorY) * 0.35;
        viewX += (targetX - viewX) * 0.18;
        viewY += (targetY - viewY) * 0.18;

        cursor.css({
          "--tl-cx": `${cursorX}px`,
          "--tl-cy": `${cursorY}px`,
          visibility: "inherit",
        });
        viewButton.css({
          "--tl-vx": `${viewX}px`,
          "--tl-vy": `${viewY}px`,
        });
        rafId = window.requestAnimationFrame(animate);
      }

      $(window).on("mousemove.cursor", function (e) {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!running) {
          running = true;
          rafId = window.requestAnimationFrame(animate);
        }
      });

      $("body")
        .on("mouseenter.cursor", viewSelector, function () {
          viewButton.addClass("active");
          cursor.css("opacity", "0");
        })
        .on("mouseleave.cursor", viewSelector, function () {
          viewButton.removeClass("active");
          cursor.css("opacity", "1");
        });

      // NEW: hero text effect
      $("body")
        .on("mouseenter.cursor", ".cursor-effect", function () {
          cursor.addClass("cursor-lg cursor-blend");
        })
        .on("mouseleave.cursor", ".cursor-effect", function () {
          cursor.removeClass("cursor-lg cursor-blend");
        });

      window.destroyCustomCursor = function () {
        $(window).off(".cursor");
        $("body").off(".cursor");
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        running = false;
        cursor.remove();
        viewButton.remove();
      };
    }
    customCursor();

    // Price range slider
    var priceRange = $("#price-range"),
      priceOutput = $("#price-output span");
    priceOutput.html(priceRange.val());
    priceRange.on("change input", function () {
      priceOutput.html($(this).val());
    });

    /* Odometer */
    $(".odometer").waypoint(
      function () {
        var odo = $(".odometer");
        odo.each(function () {
          var countNumber = $(this).attr("data-count");
          $(this).html(countNumber);
        });
      },
      {
        offset: "80%",
        triggerOnce: true,
      },
    );

    // Nice Select Js
    $("select").niceSelect();

    function featureHoverGSAP(options) {
      const settings = Object.assign(
        {
          container: ".feature-img",
          image: ".feature-img img",
          text: null,
          trigger: ".feature-item",
        },
        options,
      );

      const activeClass = "active";
      const fadeSpeed = 0.28;

      const imgEl = document.querySelector(settings.image);
      const textEl = settings.text
        ? document.querySelector(settings.text)
        : null;
      const box = document.querySelector(settings.container);

      let lastItem = null;
      let interactionMode = null;

      const triggerItems = document.querySelectorAll(settings.trigger);

      function activate(item) {
        if (!item || item === lastItem) return;
        lastItem = item;

        const newImg = item.dataset.img;
        const newText = item.dataset.text;

        triggerItems.forEach((el) => el.classList.remove(activeClass));
        item.classList.add(activeClass);

        gsap.killTweensOf([box, imgEl, textEl]);

        gsap.to(box, {
          opacity: 0,
          y: -8,
          scale: 0.985,
          duration: fadeSpeed,
          ease: "power1.out",
          onComplete: () => {
            if (newImg) imgEl.src = newImg;
            gsap.fromTo(
              box,
              { opacity: 0, y: 10, scale: 0.985 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: fadeSpeed,
                ease: "power1.out",
              },
            );

            if (textEl && newText) {
              textEl.textContent = newText;
              gsap.fromTo(
                textEl,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: fadeSpeed, ease: "power1.out" },
              );
            }
          },
        });
      }

      triggerItems.forEach((item) => {
        // Check if item should use click mode via data attribute
        const useClickMode = item.dataset.mode === "click";

        // HOVER MODE (default behavior)
        if (!useClickMode) {
          item.addEventListener("mouseenter", () => {
            if (interactionMode === "click") return;
            interactionMode = "hover";
            activate(item);
          });
        }

        // CLICK MODE
        item.addEventListener("click", (e) => {
          // Only prevent default if it's a link and we're in click mode
          if (useClickMode) {
            e.preventDefault();
            interactionMode = "click";
            activate(item);
          } else {
            // For non-click mode items, let the link work normally
            // but still activate the item if needed
            if (interactionMode !== "hover") {
              activate(item);
            }
          }
        });
      });
    }

    featureHoverGSAP({
      container: ".feature-img",
      image: ".feature-img img",
      text: ".feature-img .img-content p",
      trigger: ".feature-item",
    });

    featureHoverGSAP({
      container: ".team-img",
      image: ".team-img img",
      trigger: ".team-item",
    });

    featureHoverGSAP({
      container: ".award-img",
      image: ".award-img img",
      trigger: ".award-item",
    });

    featureHoverGSAP({
      container: ".service-img-7",
      image: ".service-img-7 img",
      trigger: ".service-item-7",
    });

    function gallaryScroll() {
      gsap.config({
        force3D: true,
      });
      var $container = $(".gallary-wrap");

      $container.each(function () {
        const $section = $(this);
        const $imageContainer = $section.find(".gallery-scroll-wrap");
        const windowWidth = $(window).width();

        let scrollDistance = -(windowWidth / 3);

        $imageContainer.append($imageContainer.html());
        // 2️⃣ Re-init venobox after duplication
        // reInitVenoBox();
        if ($section.hasClass("gallery-scroll-direction-ltr")) {
          scrollDistance = scrollDistance * -1;
        }

        gsap.to($imageContainer, {
          x: scrollDistance,
          ease: "sine.out",
          scrollTrigger: {
            trigger: $section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
            markers: false,
            anticipatePin: 1,
          },
        });
      });
    }
    gallaryScroll();

    // Project Carousel

    var swiperProject = new Swiper(".project-carousel", {
      slidesPerView: 3,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: true,
      autoplay: false,
      grabcursor: true,
      speed: 800,
      breakpoints: {
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
        767: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 3,
          slidesPerGroup: 1,
        },
      },
    });

    var swiperProject2 = new Swiper(".project-carousel-2", {
      slidesPerView: 2,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: false,
      autoplay: false,
      grabcursor: true,
      speed: 800,
      breakpoints: {
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
        767: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
      },
    });

    // Service Carousel
    var swiperService = new Swiper(".service-carousel", {
      slidesPerView: 3,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: true,
      autoplay: false,
      grabcursor: true,
      speed: 800,
      breakpoints: {
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
        767: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 3,
          slidesPerGroup: 1,
        },
      },
    });

    // Service Carousel
    var swiperService = new Swiper(".service-carousel-3", {
      slidesPerView: 3,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: true,
      autoplay: false,
      grabcursor: true,
      speed: 800,
      breakpoints: {
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
        767: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
      },
    });

    // Gallary Carousel
    var swiperGallary = new Swiper(".gallary-carousel", {
      slidesPerView: 3,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: true,
      autoplay: false,
      grabcursor: true,
      speed: 800,
      navigation: {
        nextEl: ".gallary-carousel-wrap .swiper-prev",
        prevEl: ".gallary-carousel-wrap .swiper-next",
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
        767: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 3,
          slidesPerGroup: 1,
        },
      },
    });

    // Testi Carousel (loop disabled: single-slide markup breaks loop layout and causes horizontal overflow)
    var swiperTesti = new Swiper(".testi-carousel", {
      slidesPerView: 1,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: false,
      watchOverflow: true,
      autoplay: false,
      grabcursor: true,
      speed: 800,
      navigation: {
        nextEl: ".testi-top-content-wrap .swiper-prev",
        prevEl: ".testi-top-content-wrap .swiper-next",
      },
    });

    //Testi Carousel

    var swiperTesti = new Swiper(".testi-carousel-3", {
      slidesPerView: 3,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: true,
      autoplay: false,
      grabcursor: true,
      speed: 800,
      direction: "vertical",
      mousewheel: {
        enabled: true,
        sensitivity: 4,
        invert: true,
      },
    });

    var swiperHistory = new Swiper(".testi-carousel-5", {
      slidesPerView: 3,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: true,
      autoplay: false,
      grabcursor: true,
      speed: 800,
      navigation: {
        nextEl: ".testi-top-content-wrap-5 .swiper-prev",
        prevEl: ".testi-top-content-wrap-5 .swiper-next",
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
        767: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 3,
          slidesPerGroup: 1,
        },
      },
    });

    // Project Carousel
    var swiperHistory = new Swiper(".history-carousel", {
      slidesPerView: 4,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: true,
      autoplay: false,
      grabcursor: true,
      speed: 800,
      breakpoints: {
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
        767: {
          slidesPerView: 3,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 4,
          slidesPerGroup: 1,
        },
      },
    });

    // Sponsor Carousel
    var swiperSponsor = new Swiper(".sponsor-carousel", {
      slidesPerView: 6,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: true,
      autoplay: false,
      grabcursor: true,
      speed: 800,
      breakpoints: {
        320: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
        767: {
          slidesPerView: 4,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 4,
          slidesPerGroup: 1,
        },
        1199: {
          slidesPerView: 6,
          slidesPerGroup: 1,
        },
      },
    });

    // Blog Carousel
    var swiperBlog = new Swiper(".blog-carousel", {
      slidesPerView: 3,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: true,
      autoplay: true,
      grabcursor: true,
      speed: 800,
      breakpoints: {
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
        767: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 3,
          slidesPerGroup: 1,
        },
        1199: {
          slidesPerView: 3,
          slidesPerGroup: 1,
        },
      },
    });

    // Blog Carousel
    var swiperBlog = new Swiper(".blog-carousel-2", {
      slidesPerView: 3,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: true,
      autoplay: true,
      grabcursor: true,
      speed: 800,
      centeredSlides: true,
      breakpoints: {
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
        767: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 3,
          slidesPerGroup: 1,
        },
        1199: {
          slidesPerView: 3,
          slidesPerGroup: 1,
        },
      },
    });

    // Blog Carousel
    var swiperBlog = new Swiper(".blog-carousel-3", {
      slidesPerView: 2,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: true,
      autoplay: true,
      grabcursor: true,
      speed: 800,
      breakpoints: {
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
        767: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
        1199: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
      },
    });

    // hover reveal start
    const hoverItems = document.querySelectorAll(".service-hover-reveal-item");

    const OFFSET_X = 120;
    const OFFSET_Y = 0;

    hoverItems.forEach((item) => {
      const img = item.querySelector(".hover-img");
      if (!img) return;

      let tl = gsap.timeline({ paused: true });

      item.addEventListener("mouseenter", () => {
        const rect = item.getBoundingClientRect();
        const x = rect.width + OFFSET_X;
        const y = rect.height / 2 + OFFSET_Y;

        gsap.set(img, { x, y });

        tl.clear()
          .to(img, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
          })
          .from(
            img,
            {
              x: x + 40,
              duration: 0.6,
              ease: "power3.out",
            },
            0,
          );

        tl.play();
      });

      item.addEventListener("mouseleave", () => {
        gsap.to(img, {
          opacity: 0,
          scale: 0.95,
          x: "+=20",
          duration: 0.4,
          ease: "power2.inOut",
        });
      });
    });
    // hover reveal end

    // Hover Effect Project
    function activateOnHover(selector, activeClass = "active") {
      const elements = document.querySelectorAll(selector);
      let lastActiveElement = null;
      elements.forEach((element) => {
        element.addEventListener("mouseenter", () => {
          elements.forEach((el) => el.classList.remove(activeClass));
          element.classList.add(activeClass);
          lastActiveElement = element;
        });
      });
      if (lastActiveElement) {
        lastActiveElement.classList.add(activeClass);
      }
    }
    // Card Hover
    activateOnHover(".project-accordian .project-card", "active");

    // Project Home 9

    const trigger = document.querySelector(".project-wrap-9");

    if (trigger) {
      const items = trigger.querySelectorAll(".project-item-3");

      items[0].classList.add("active");

      items.forEach((item) => {
        item.addEventListener("mouseenter", function () {
          items.forEach((el) => el.classList.remove("active"));
          this.classList.add("active");
        });
      });
    }

    // carouselTicker initail
    $(".carouselTicker-nav").carouselTicker({});
    $(".carouselTicker-start").carouselTicker({
      direction: "next",
    });

    //Running Animated Text
    const scrollers = document.querySelectorAll(".scroller");

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach((scroller) => {
        scroller.setAttribute("data-animated", true);

        const scrollerInner = scroller.querySelector(".scroller__inner");
        const scrollerContent = Array.from(scrollerInner.children);

        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          duplicatedItem.setAttribute("aria-hidden", true);
          scrollerInner.appendChild(duplicatedItem);
        });
      });
    }

    // BG Image Animation
    (function () {
      const parallaxArea = document.querySelector(".parallax-area");
      const parallaxImg = document.querySelector(".bg-img-parallax");

      // stop silently if elements don't exist
      if (!parallaxArea || !parallaxImg) return;

      gsap.to(parallaxImg, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: parallaxArea,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    })();

    gsap.registerPlugin(ScrollTrigger);

    // Home 2 project stack: `pin` + scrub on small viewports causes layout overflow (horizontal scroll)
    const mmHome2Projects = gsap.matchMedia();
    mmHome2Projects.add("(min-width: 992px)", () => {
      gsap.utils
        .toArray(".project-item-wrap-2 .project-item-2")
        .forEach((element, index, array) => {
          if (index === array.length - 1) return;

          const delay = parseFloat(element.getAttribute("data-ani-delay")) || 0;
          gsap.to(element, {
            scale: 0.6,
            opacity: 0,
            duration: 2,
            delay: delay,
            scrollTrigger: {
              trigger: element,
              start: "top 15%",
              end: "bottom 15%",
              scrub: 2,
              pin: true,
              pinSpacing: false,
              markers: false,
            },
          });
        });
    });

    //

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const scrollArea = document.querySelector(".scroll-area");
      const scrollImg = document.querySelector(".scroll-img");

      // ✅ Run only if elements exist
      if (!scrollArea || !scrollImg) return;

      gsap.to(scrollImg, {
        x: -400,
        ease: "none",
        scrollTrigger: {
          trigger: scrollArea,
          start: "top bottom",
          end: "bottom top",
          scrub: 2.5,
          invalidateOnRefresh: true,
        },
      });

      // cleanup
      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
        gsap.set(scrollImg, { x: 0 });
      };
    });

    // Sticky Element

    gsap.registerPlugin(ScrollTrigger);
    const localMM = gsap.matchMedia();

    localMM.add("(min-width: 1024px)", () => {
      const pinInner = document.querySelector(".pin-inner");
      const pinBox = document.querySelector(".pin-box");
      const scrollContent = document.querySelector(".scroll-content");

      if (!pinInner || !pinBox || !scrollContent) return;

      const trigger = ScrollTrigger.create({
        trigger: pinInner,
        start: "-150px top",
        endTrigger: scrollContent,
        end: "bottom bottom",
        pin: pinBox,
      });

      return () => trigger.kill();
    });

    // Image Reveal

    gsap.registerPlugin(ScrollTrigger);

    let revealContainers = document.querySelectorAll(".reveal");

    revealContainers.forEach((container) => {
      let image = container.querySelector("img");
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          toggleActions: "restart none none reset",
        },
      });

      tl.set(container, { autoAlpha: 1 });
      tl.from(container, 1.5, {
        xPercent: -100,
        ease: Power2.out,
      });
      tl.from(image, 1.5, {
        xPercent: 100,
        scale: 1.3,
        delay: -1.5,
        ease: Power2.out,
      });
    });

    const images = document.querySelectorAll(".img-reveal");

    const removeOverlay = (overlay) => {
      let tl = gsap.timeline();

      tl.to(overlay, {
        duration: 1.4,
        ease: "Power2.easeInOut",
        width: "0%",
      });

      return tl;
    };

    const scaleInImage = (image) => {
      let tl = gsap.timeline();

      tl.from(image, {
        duration: 1.4,
        scale: 1.4,
        ease: "Power2.easeInOut",
      });

      return tl;
    };

    images.forEach((image) => {
      gsap.set(image, {
        visibility: "visible",
      });

      const overlay = image.querySelector(".img-overlay");
      const img = image.querySelector("img");

      const masterTL = gsap.timeline({ paused: true });
      masterTL.add(removeOverlay(overlay)).add(scaleInImage(img), "-=1.4");

      let options = {
        threshold: 0,
      };

      const io = new IntersectionObserver((entries, options) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            masterTL.play();
          } else {
            masterTL.progress(0).pause();
          }
        });
      }, options);

      io.observe(image);
    });

    // Scroll Animation

    let typeSplit = new SplitType("[data-text-animation]", {
      types: "lines,words, chars",
      className: "line",
    });
    var text_animations = document.querySelectorAll("[data-text-animation]");

    function createScrollTrigger(triggerElement, timeline) {
      // Play tl when scrolled into view (60% from top of screen)
      ScrollTrigger.create({
        trigger: triggerElement,
        start: "top 80%",
        onEnter: () => timeline.play(),
        toggleClass: { targets: triggerElement, className: "active" },
      });
    }

    text_animations.forEach((animation) => {
      let type = "slide-up",
        duration = 0.75,
        offset = 80,
        stagger = 0.6,
        delay = 0,
        scroll = 1,
        split = "line",
        ease = "power2.out";
      // Set attribute
      if (animation.getAttribute("data-stagger")) {
        stagger = animation.getAttribute("data-stagger");
      }
      if (animation.getAttribute("data-duration")) {
        duration = animation.getAttribute("data-duration");
      }
      if (animation.getAttribute("data-text-animation")) {
        type = animation.getAttribute("data-text-animation");
      }
      if (animation.getAttribute("data-delay")) {
        delay = animation.getAttribute("data-delay");
      }
      if (animation.getAttribute("data-ease")) {
        ease = animation.getAttribute("data-ease");
      }
      if (animation.getAttribute("data-scroll")) {
        scroll = animation.getAttribute("data-scroll");
      }
      if (animation.getAttribute("data-offset")) {
        offset = animation.getAttribute("data-offset");
      }
      if (animation.getAttribute("data-split")) {
        split = animation.getAttribute("data-split");
      }
      if (scroll == 1) {
        if (type == "slide-up") {
          let tl = gsap.timeline({ paused: true });
          tl.from(animation.querySelectorAll(`.${split}`), {
            yPercent: offset,
            duration,
            ease,
            opacity: 0,
            stagger: { amount: stagger },
          });
          createScrollTrigger(animation, tl);
        }
        if (type == "slide-down") {
          let tl = gsap.timeline({ paused: true });
          tl.from(animation.querySelectorAll(`.${split}`), {
            yPercent: -offset,
            duration,
            ease,
            opacity: 0,
            stagger: { amount: stagger },
          });
          createScrollTrigger(animation, tl);
        }
        if (type == "rotate-in") {
          let tl = gsap.timeline({ paused: true });
          tl.set(animation.querySelectorAll(`.${split}`), {
            transformPerspective: 400,
          });
          tl.from(animation.querySelectorAll(`.${split}`), {
            rotationX: -offset,
            duration,
            ease,
            force3D: true,
            opacity: 0,
            transformOrigin: "top center -50",
            stagger: { amount: stagger },
          });
          createScrollTrigger(animation, tl);
        }
        if (type == "slide-from-left") {
          let tl = gsap.timeline({ paused: true });
          tl.from(animation.querySelectorAll(`.${split}`), {
            opacity: 0,
            xPercent: -offset,
            duration,
            opacity: 0,
            ease,
            stagger: { amount: stagger },
          });
          createScrollTrigger(animation, tl);
        }
        if (type == "slide-from-right") {
          let tl = gsap.timeline({ paused: true });
          tl.from(animation.querySelectorAll(`.${split}`), {
            opacity: 0,
            xPercent: offset,
            duration,
            opacity: 0,
            ease,
            stagger: { amount: stagger },
          });
          createScrollTrigger(animation, tl);
        }
        if (type == "fade-in") {
          let tl = gsap.timeline({ paused: true });
          tl.from(animation.querySelectorAll(`.${split}`), {
            opacity: 0,
            duration,
            ease,
            opacity: 0,
            stagger: { amount: stagger },
          });
          createScrollTrigger(animation, tl);
        }
        if (type == "fade-in-right") {
          let tl = gsap.timeline({ paused: true });
          tl.from(animation.querySelectorAll(`.${split}`), {
            x: 100,
            autoAlpha: 0,
            duration,
            stagger: stagger,
          });
          createScrollTrigger(animation, tl);
        }
        if (type == "fade-in-bottom-line") {
          let tl = gsap.timeline({ paused: true });
          tl.from(animation.querySelectorAll(`.${split}`), {
            autoAlpha: 0,
            rotationX: -80,
            force3D: true,
            transformOrigin: "top center -50",
            delay: 0.3,
            duration,
            stagger: stagger,
          });
          createScrollTrigger(animation, tl);
        }
        if (type == "fade-in-random") {
          let tl = gsap.timeline({ paused: true });
          tl.from(animation.querySelectorAll(`.${split}`), {
            opacity: 0,
            duration,
            ease,
            opacity: 0,
            stagger: { amount: stagger, from: "random" },
          });
          createScrollTrigger(animation, tl);
        }
        if (type == "scrub") {
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: animation,
              start: "top 90%",
              end: "top center",
              scrub: true,
            },
          });
          tl.from(animation.querySelectorAll(`.${split}`), {
            opacity: 0.2,
            duration,
            ease,
            stagger: { amount: stagger },
          });
        }

        // Avoid flash of unstyled content
        gsap.set("[data-text-animation]", { opacity: 1 });
      } else {
        if (type == "slide-up") {
          let tl = gsap.timeline({ paused: true });
          tl.from(animation.querySelectorAll(`.${split}`), {
            yPercent: offset,
            duration,
            ease,
            opacity: 0,
          });
        }
        if (type == "slide-down") {
          let tl = gsap.timeline({ paused: true });
          tl.from(animation.querySelectorAll(`.${split}`), {
            yPercent: -offset,
            duration,
            ease,
            opacity: 0,
          });
        }
        if (type == "rotate-in") {
          let tl = gsap.timeline({ paused: true });
          tl.set(animation.querySelectorAll(`.${split}`), {
            transformPerspective: 400,
          });
          tl.from(animation.querySelectorAll(`.${split}`), {
            rotationX: -offset,
            duration,
            ease,
            force3D: true,
            opacity: 0,
            transformOrigin: "top center -50",
          });
        }
        if (type == "slide-from-right") {
          let tl = gsap.timeline({ paused: true });
          tl.from(animation.querySelectorAll(`.${split}`), {
            opacity: 0,
            xPercent: offset,
            duration,
            opacity: 0,
            ease,
          });
        }
        if (type == "fade-in") {
          let tl = gsap.timeline({ paused: true });
          tl.from(animation.querySelectorAll(`.${split}`), {
            opacity: 0,
            duration,
            ease,
            opacity: 0,
          });
        }
        if (type == "fade-in-random") {
          let tl = gsap.timeline({ paused: true });
          tl.from(animation.querySelectorAll(`.${split}`), {
            opacity: 0,
            duration,
            ease,
            opacity: 0,
            stagger: { amount: stagger, from: "random" },
          });
        }
        if (type == "scrub") {
          tl.from(animation.querySelectorAll(`.${split}`), {
            opacity: 0.2,
            duration,
            ease,
          });
        }
      }
    });

    if ($(".fade-wrapper").length > 0) {
      $(".fade-wrapper").each(function () {
        var section = $(this);
        var fadeItems = section.find(".fade-top");

        fadeItems.each(function (index, element) {
          var delay = index * 0.1;

          gsap.set(element, {
            opacity: 0,
            y: 100,
          });

          ScrollTrigger.create({
            trigger: element,
            start: "top 100%",
            end: "bottom 20%",
            scrub: 0.5,
            onEnter: function () {
              gsap.to(element, {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: delay,
              });
            },
            once: true,
          });
        });
      });
    }

    let fadeArray_items = document.querySelectorAll(".slide-anim");
    if (fadeArray_items.length > 0) {
      const fadeArray = gsap.utils.toArray(".slide-anim");
      fadeArray.forEach((item, i) => {
        var fade_direction = "bottom";
        var onscroll_value = 1;
        var duration_value = 1.15;
        var fade_offset = 50;
        var delay_value = 0.15;
        var ease_value = "power2.out";
        if (item.getAttribute("data-offset")) {
          fade_offset = item.getAttribute("data-offset");
        }
        if (item.getAttribute("data-duration")) {
          duration_value = item.getAttribute("data-duration");
        }
        if (item.getAttribute("data-direction")) {
          fade_direction = item.getAttribute("data-direction");
        }
        if (item.getAttribute("data-on-scroll")) {
          onscroll_value = item.getAttribute("data-on-scroll");
        }
        if (item.getAttribute("data-delay")) {
          delay_value = item.getAttribute("data-delay");
        }
        if (item.getAttribute("data-ease")) {
          ease_value = item.getAttribute("data-ease");
        }
        let animation_settings = {
          opacity: 0,
          ease: ease_value,
          duration: duration_value,
          delay: delay_value,
        };
        if (fade_direction == "top") {
          animation_settings["y"] = -fade_offset;
        }
        if (fade_direction == "left") {
          animation_settings["x"] = -fade_offset;
        }
        if (fade_direction == "bottom") {
          animation_settings["y"] = fade_offset;
        }
        if (fade_direction == "right") {
          animation_settings["x"] = fade_offset;
        }
        if (onscroll_value == 1) {
          animation_settings["scrollTrigger"] = {
            trigger: item,
            start: "top 85%",
          };
        }
        gsap.from(item, animation_settings);
      });
    }

    window.addEventListener("load", (event) => {
      setTimeout(() => {
        function textAnimationEffect() {
          let TextAnim = gsap.timeline();
          let splitText = new SplitType(".text-animation-effect", {
            types: "chars",
          });
          if ($(".text-animation-effect .char").length) {
            TextAnim.from(
              ".text-animation-effect .char",
              { duration: 1, x: 50, autoAlpha: 0, stagger: 0.1 },
              "-=1",
            );
          }
        }
        textAnimationEffect();
      }, 200);
    });

    // scale animation
    var scale = document.querySelectorAll(".scale");
    var image = document.querySelectorAll(".scale img");
    scale.forEach((item) => {
      gsap.to(item, {
        scale: 1,
        duration: 1,
        ease: "power1.out",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play reverse play reverse",
        },
      });
    });
    image.forEach((image) => {
      gsap.set(image, {
        scale: 1.3,
      });
      gsap.to(image, {
        scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play reverse play reverse",
        },
      });
    });

    // Page Scroll Percentage
    function scrollTopPercentage() {
      const scrollPercentage = () => {
        const scrollTopPos = document.documentElement.scrollTop;
        const calcHeight =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        const scrollValue = Math.round((scrollTopPos / calcHeight) * 100);
        const scrollElementWrap = $("#scroll-percentage");

        scrollElementWrap.css(
          "background",
          `conic-gradient( var(--tl-color-common-white) ${scrollValue}%, var(--tl-color-theme-primary) ${scrollValue}%)`,
        );

        // ScrollProgress
        if (scrollTopPos > 100) {
          scrollElementWrap.addClass("active");
        } else {
          scrollElementWrap.removeClass("active");
        }

        if (scrollValue < 96) {
          $("#scroll-percentage-value").text(`${scrollValue}%`);
        } else {
          $("#scroll-percentage-value").html(
            '<i class="fa-sharp fa-regular fa-arrow-up-long"></i>',
          );
        }
      };
      window.onscroll = scrollPercentage;
      window.onload = scrollPercentage;

      // Back to Top
      function scrollToTop() {
        document.documentElement.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      $("#scroll-percentage").on("click", scrollToTop);
    }

    scrollTopPercentage();
  });

  document.querySelectorAll(".scroll-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      var sectionTarget = btn.getAttribute("data-target");
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: sectionTarget, offsetY: 70 },
      });
    });
  });

  const sm = gsap.matchMedia();
  sm.add("(min-width: 768px)", () => {
    if (
      document.querySelector("#antra-smooth-wrapper") &&
      document.querySelector("#antra-smooth-content")
    ) {
      ScrollSmoother.create({
        wrapper: "#antra-smooth-wrapper",
        content: "#antra-smooth-content",
        smooth: 1.8,
        effects: true,
        smoothTouch: 0.15,
        ignoreMobileResize: true,
      });
    }
  });

  let resizeTimer;
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  });
})(jQuery);
