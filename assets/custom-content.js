if (!customElements.get('customcontent-component')) {
  class CustomContent extends HTMLElement {
    constructor() {
      super();

      this.selectors = {
        sliderWrapper: '.btfy-custom-content__items',
        nextEl: '.swiper-btn-next',
        prevEl: '.swiper-btn-prev',
      };

      this.classes = {
        grid: 'f-grid',
        swiper: 'swiper',
        swiperWrapper: 'swiper-wrapper',
      };

      this.sliderInstance = false;
      this.mobileListenersAdded = false;
      this.designModeListenerAdded = false;
    }

    connectedCallback() {
      this.sectionId = this.dataset.sectionId;
      this.section = this.closest(`.section-${this.sectionId}`);

      this.sliderWrapper = this.querySelector(
        this.selectors.sliderWrapper
      );

      this.enableSlider = this.dataset.enableSlider === 'true';
      this.items = parseInt(this.dataset.items || 4, 10);
      this.tabletItems = parseInt(
        this.dataset.tabletItems || this.items,
        10
      );

      if (!this.sliderWrapper) {
        return;
      }

      if (!this.enableSlider) {
        return;
      }

      this.init();

      if (!this.mobileListenersAdded) {
        document.addEventListener('matchMobile', () => {
          this.init();
        });

        document.addEventListener('unmatchMobile', () => {
          this.init();
        });

        this.mobileListenersAdded = true;
      }
    }

    init() {
      if (FoxTheme.config.mqlMobile) {
        this.destroySlider();
      } else {
        this.initSlider();
      }
    }

    initSlider() {
      if (this.sliderInstance) {
        return;
      }

      if (!this.sliderWrapper) {
        return;
      }

      const columnGap =
        FoxTheme.utils.getGridColumnGap(this.sliderWrapper);

      const nextEl = this.section
        ? this.section.querySelector(this.selectors.nextEl)
        : null;

      const prevEl = this.section
        ? this.section.querySelector(this.selectors.prevEl)
        : null;

      const sliderOptions = {
        slidesPerView: Math.min(this.tabletItems, 3),

        spaceBetween: columnGap.tablet,

        navigation: {
          nextEl: nextEl,
          prevEl: prevEl,
        },

        pagination: false,

        breakpoints: {
          1024: {
            slidesPerView: this.items,
            spaceBetween: columnGap.tabletLarge,
          },

          1280: {
            slidesPerView: this.items,
            spaceBetween: columnGap.desktop,
          },
        },

        loop: true,
        threshold: 2,
      };

      this.classList.add(this.classes.swiper);

      this.sliderWrapper.classList.remove(this.classes.grid);
      this.sliderWrapper.classList.add(this.classes.swiperWrapper);

      this.sliderInstance = new window.FoxTheme.Carousel(
        this,
        sliderOptions
      );

      this.sliderInstance.init();

      if (
        Shopify.designMode &&
        !this.designModeListenerAdded
      ) {
        document.addEventListener(
          'shopify:block:select',
          (event) => {
            if (
              event.detail.sectionId !== this.sectionId
            ) {
              return;
            }

            const target = event.target;

            if (!target) {
              return;
            }

            const index = Number(
              target.dataset.index || 0
            );

            if (this.sliderInstance) {
              this.sliderInstance.slider.slideToLoop(index);
            }
          }
        );

        this.designModeListenerAdded = true;
      }

      const focusableElements =
        FoxTheme.a11y.getFocusableElements(this);

      focusableElements.forEach((element) => {
        element.addEventListener('focusin', () => {
          if (!this.sliderInstance) {
            return;
          }

          const slide =
            element.closest('.swiper-slide');

          if (!slide) {
            return;
          }

          const index =
            this.sliderInstance.slider.slides.indexOf(
              slide
            );

          if (index !== -1) {
            this.sliderInstance.slider.slideTo(index);
          }
        });
      });
    }

    destroySlider() {
      this.classList.remove(this.classes.swiper);

      if (this.sliderWrapper) {
        this.sliderWrapper.classList.remove(
          this.classes.swiperWrapper
        );

        this.sliderWrapper.classList.add(
          this.classes.grid
        );
      }

      if (this.sliderInstance) {
        this.sliderInstance.slider.destroy();
        this.sliderInstance = false;
      }
    }
  }

  customElements.define(
    'customcontent-component',
    CustomContent
  );
}