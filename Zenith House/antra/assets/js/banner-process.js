(function ($) {
    "use strict";
    function initAntraBannerProcess() {
        // 1. Initialize Swiper
        const swiperContainer = document.querySelector('.banner-process-carousel');
        if (swiperContainer) {
            // Check if Swiper library is available
            if (typeof Swiper !== 'undefined') {
                new Swiper(swiperContainer, {
                    // Optional parameters
                    direction: 'horizontal', // or 'vertical'
                    loop: true, // Enable loop mode
                    slidesPerView: 4, // Number of slides per view
                    spaceBetween: 30, // Space between slides in pixels

                    // If you need pagination
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },

                    // If you need navigation
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },

                    // If you need scrollbar
                    scrollbar: {
                        el: '.swiper-scrollbar',
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
                            slidesPerView: 4,
                            slidesPerGroup: 1,
                        },
                        1199: {
                            slidesPerView: 4,
                            slidesPerGroup: 1,
                        },
                    },
                });
            } else {
                console.error('Swiper library is not loaded. Please include it in your HTML.');
            }
        }

        // 2. Initialize Banner Process Interaction
        const items = document.querySelectorAll('.elementor-banner-process-item');
        const images = document.querySelectorAll('.banner-process-image-list .banner-process-img');
        const imageList = document.querySelector('.banner-process-image-list');

        // Ensure we have elements before proceeding
        if (items.length === 0 || images.length === 0 || !imageList) {
            return;
        }

        if (!document.querySelector('.banner-process-img.show')) {
            const firstImg = images[0];
            if (firstImg) {
                firstImg.classList.add('show');
                firstImg.style.display = 'block';
            }
        }

        // Filter out cloned slides from Swiper's loop mode
        const originalItems = Array.from(items).filter(item => 
            !item.classList.contains('swiper-slide-duplicate') && 
            !item.classList.contains('cloned')
        );

        // Add a data-index to each original item
        originalItems.forEach((item, i) => {
            item.setAttribute('data-index', i);
        });

        // Ensure all items (including duplicates) have a data-index
        items.forEach(item => {
            const hasIndex = item.getAttribute('data-index');
            if (hasIndex === null) {
                const swiperIndex = item.getAttribute('data-swiper-slide-index');
                if (swiperIndex !== null) {
                    item.setAttribute('data-index', swiperIndex);
                } else if (originalItems.length) {
                    const list = Array.from(items);
                    const pos = list.indexOf(item);
                    const mapped = pos % originalItems.length;
                    item.setAttribute('data-index', String(mapped));
                }
            }
        });

        // Add mouseenter event listener to each item
        items.forEach(item => {
            item.addEventListener('mouseenter', function() {
                // Prevent animation if one is already running
                if (imageList.classList.contains('running')) return;
                
                const index = parseInt(this.getAttribute('data-index'), 10);
                if (isNaN(index) || index >= images.length || index < 0) return;

                const curImgShow = document.querySelector('.banner-process-img.show');
                const targetImg = images[index];
                if (targetImg.classList.contains('show')) return; // Already showing, do nothing

                if (!curImgShow) {
                    targetImg.classList.add('show');
                    targetImg.style.display = 'block';
                    imageList.classList.remove('running');
                    return;
                }

                imageList.classList.add('running');
                
                // Update active caption
                document.querySelectorAll('.banner-process-caption').forEach(caption => {
                    caption.classList.remove('active');
                });
                const currentCaption = this.querySelector('.banner-process-caption');
                if (currentCaption) {
                    currentCaption.classList.add('active');
                }

                const isAfter = index > Array.from(images).indexOf(curImgShow);

                if (isAfter) {
                    targetImg.classList.add('showing');
                } else {
                    curImgShow.classList.add('showing');
                }
                
                targetImg.style.display = 'block';
                
                // Animate with slideUp effect
                const startHeight = curImgShow.offsetHeight + 'px';
                curImgShow.style.height = startHeight;
                curImgShow.style.overflow = 'hidden';
                
                let start = null;
                const duration = 500; // milliseconds
                
                function animateSlide(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percent = Math.min(progress / duration, 1);
                    
                    // Easing function for smooth animation
                    const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                    const easedProgress = easeInOutQuad(percent);
                    
                    curImgShow.style.height = (1 - easedProgress) * parseFloat(startHeight) + 'px';
                    curImgShow.style.opacity = 1 - easedProgress;
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(animateSlide);
                    } else {
                        // Animation complete
                        curImgShow.classList.remove('show');
                        curImgShow.style.display = 'none';
                        curImgShow.style.height = '';
                        curImgShow.style.overflow = '';
                        curImgShow.style.opacity = '';
                        
                        if (!isAfter) {
                            curImgShow.classList.remove('showing');
                        }
                        targetImg.classList.remove('showing');
                        targetImg.classList.add('show');
                        imageList.classList.remove('running');
                    }
                }
                
                window.requestAnimationFrame(animateSlide);
            });
        });
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', initAntraBannerProcess);
})(jQuery);
