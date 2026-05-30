(function ($) {
    "use strict";

    $(document).ready(function () {
        // 1. Check if the slider element exists. If not, exit early.
        if ($(".antra-slider").length === 0) {
            return; 
        }

        /* ============================ Animation Function ============================ */
        function sliderAnimations(elements) {
            var animationEndEvents = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
            elements.each(function () {
                var $this = $(this);
                var delay = $this.data("delay");
                var duration = $this.data("duration");
                var animationType = "antra-animation " + $this.data("animation");
                
                $this.css({
                    opacity: 1,
                    "animation-delay": delay,
                    "-webkit-animation-delay": delay,
                    "animation-duration": duration,
                });

                $this.addClass(animationType).one(animationEndEvents, function () {
                    $this.removeClass(animationType);
                });
            });
        }

        /* ============================ Swiper Setup ============================ */
        var sliderOptions = {
            init: false,
            speed: 1500,
            loop: true,
            effect: "fade", // Fixed typo: "verticle" isn't a default Swiper effect, usually "vertical" or "fade"
            grabCursor: true,
            autoplay: false,
            pagination: {
                el: ".antra-swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: '.slider-navigation .swiper-next', // Fixed swapped classes
                prevEl: '.slider-navigation .swiper-prev',
            },
            on: {
                slideChangeTransitionStart: function () {
                    var swiper = this;
                    var animatingElements = $(swiper.slides[swiper.activeIndex]).find("[data-animation]");
                    sliderAnimations(animatingElements);
                }
            }
        };

        /* create swiper globally */
        window.mainSlider = new Swiper(".antra-slider", sliderOptions);

        /* ============================ START AFTER PRELOADER ============================ */
        window.startSliderAfterPreload = function () {
            const swiper = window.mainSlider;
            
            // Check if swiper was actually initialized
            if (!swiper || typeof swiper.init !== 'function') return;

            swiper.init();
            swiper.update();

            const elements = $(swiper.slides[swiper.activeIndex]).find("[data-animation]");
            elements.css("opacity", 0);

            setTimeout(function () {
                const sliderSection = document.querySelector(".slider-section");
                if(sliderSection) {
                    sliderSection.classList.add("slider-ready");
                }
                
                sliderAnimations(elements);

                // Autoplay start
                swiper.params.autoplay = {
                    delay: 7000,
                    disableOnInteraction: false,
                };
                swiper.autoplay.start();
            }, 80);
        };
    });
})(jQuery);